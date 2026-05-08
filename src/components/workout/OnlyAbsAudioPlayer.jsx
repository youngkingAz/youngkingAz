import React from 'react';

import onlyAbsTheme from '../../assets/only-abs-theme.mp3';

/** @type {React.CSSProperties} */
const toggleButtonStyle = {
  position: 'fixed',
  right: '1rem',
  bottom: '1rem',
  zIndex: 40,
  border: '1px solid rgba(236, 72, 153, 0.35)',
  background: 'rgba(15, 15, 15, 0.92)',
  color: '#f5f5f5',
  borderRadius: '999px',
  padding: '0.8rem 1rem',
  fontSize: '0.85rem',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
};

/** @type {React.CSSProperties} */
const helperStyle = {
  position: 'fixed',
  right: '1rem',
  bottom: '4.4rem',
  zIndex: 39,
  maxWidth: '16rem',
  background: 'rgba(15, 15, 15, 0.92)',
  color: '#f5f5f5',
  border: '1px solid rgba(236, 72, 153, 0.18)',
  borderRadius: '1rem',
  padding: '0.9rem 1rem',
  fontSize: '0.8rem',
  lineHeight: 1.5,
};

const ONLY_ABS_INACTIVE_RESET_DELAY = 5 * 60 * 1000;
const ONLY_ABS_ROUTE_TRANSITION_DELAY = 700;
const ONLY_ABS_AUDIO_STATE_KEY = 'youngkingaz-only-abs-audio-state';

/** @type {HTMLAudioElement | null} */
let sharedAudio = null;
let activeOnlyAbsListeners = 0;
/** @type {number | null} */
let pauseTimeoutId = null;
/** @type {number | null} */
let resetTimeoutId = null;
let sharedMuted = false;
let sharedIsPlaying = false;

function readSavedAudioState() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawValue = window.sessionStorage.getItem(ONLY_ABS_AUDIO_STATE_KEY);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
}

/**
 * @param {{ pausedAt: number, savedAt: number }} nextState
 */
function writeSavedAudioState(nextState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(ONLY_ABS_AUDIO_STATE_KEY, JSON.stringify(nextState));
}

function clearSavedAudioState() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(ONLY_ABS_AUDIO_STATE_KEY);
}

function getSharedAudio() {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!sharedAudio) {
    sharedAudio = new Audio(onlyAbsTheme);
    sharedAudio.loop = true;
    sharedAudio.preload = 'auto';
    sharedAudio.volume = 0.65;
    sharedAudio.muted = sharedMuted;
    sharedAudio.addEventListener('play', () => {
      sharedIsPlaying = true;
    });
    sharedAudio.addEventListener('pause', () => {
      sharedIsPlaying = false;
    });
  }

  return sharedAudio;
}

export default function OnlyAbsAudioPlayer() {
  const [isMuted, setIsMuted] = React.useState(sharedMuted);
  const [isPlaying, setIsPlaying] = React.useState(sharedIsPlaying);
  const [showPlaybackHint, setShowPlaybackHint] = React.useState(false);
  const [needsManualStart, setNeedsManualStart] = React.useState(false);

  const attemptPlayback = React.useCallback(() => {
    const audio = getSharedAudio();
    if (!audio) {
      return Promise.resolve();
    }

    const playPromise = audio.play();
    if (playPromise?.then) {
      return playPromise
        .then(() => {
          sharedIsPlaying = true;
          setIsPlaying(true);
          setShowPlaybackHint(false);
          setNeedsManualStart(false);
        })
        .catch(() => {
          sharedIsPlaying = false;
          setIsPlaying(false);
          setShowPlaybackHint(true);
          setNeedsManualStart(true);
        });
    }

    sharedIsPlaying = !audio.paused;
    setIsPlaying(!audio.paused);
    setShowPlaybackHint(false);
    setNeedsManualStart(false);
    return Promise.resolve();
  }, []);

  React.useEffect(() => {
    const audio = getSharedAudio();
    if (!audio) {
      return undefined;
    }

    activeOnlyAbsListeners += 1;
    setIsPlaying(!audio.paused);

    if (pauseTimeoutId) {
      window.clearTimeout(pauseTimeoutId);
      pauseTimeoutId = null;
    }
    if (resetTimeoutId) {
      window.clearTimeout(resetTimeoutId);
      resetTimeoutId = null;
    }

    const savedState = readSavedAudioState();
    if (audio.paused && savedState?.savedAt) {
      const timeAway = Date.now() - savedState.savedAt;

      if (timeAway < ONLY_ABS_INACTIVE_RESET_DELAY) {
        audio.currentTime = savedState.pausedAt || 0;
      } else {
        audio.currentTime = 0;
        clearSavedAudioState();
      }
    }

    attemptPlayback();

    const unlockOnFirstTap = () => {
      attemptPlayback();
    };

    const syncPlaybackState = () => {
      setIsPlaying(!audio.paused);
      if (!audio.paused) {
        setNeedsManualStart(false);
      }
    };

    audio.addEventListener('play', syncPlaybackState);
    audio.addEventListener('pause', syncPlaybackState);
    window.addEventListener('pointerdown', unlockOnFirstTap);

    return () => {
      audio.removeEventListener('play', syncPlaybackState);
      audio.removeEventListener('pause', syncPlaybackState);
      window.removeEventListener('pointerdown', unlockOnFirstTap);
      activeOnlyAbsListeners = Math.max(0, activeOnlyAbsListeners - 1);

      pauseTimeoutId = window.setTimeout(() => {
        if (activeOnlyAbsListeners === 0) {
          writeSavedAudioState({
            pausedAt: audio.currentTime || 0,
            savedAt: Date.now(),
          });

          audio.pause();
        }
      }, ONLY_ABS_ROUTE_TRANSITION_DELAY);

      resetTimeoutId = window.setTimeout(() => {
        if (activeOnlyAbsListeners === 0) {
          audio.pause();
          audio.currentTime = 0;
          clearSavedAudioState();
        }
      }, ONLY_ABS_INACTIVE_RESET_DELAY);
    };
  }, []);

  React.useEffect(() => {
    const audio = getSharedAudio();
    if (!audio) {
      return;
    }

    sharedMuted = isMuted;
    audio.muted = isMuted;

    if (!isMuted) {
      attemptPlayback();
    }
  }, [attemptPlayback, isMuted]);

  function handleToggleMute() {
    setShowPlaybackHint(false);
    setNeedsManualStart(false);
    setIsMuted((currentValue) => {
      const nextValue = !currentValue;
      if (currentValue && !nextValue) {
        attemptPlayback();
      }
      return nextValue;
    });
  }

  function handleStartMusic() {
    attemptPlayback();
  }

  return (
    <>
      {showPlaybackHint ? (
        <div style={helperStyle}>
          Tap play if your phone blocks autoplay. Once it starts, it will keep looping for Only Abs.
        </div>
      ) : null}
      {needsManualStart || !isPlaying ? (
        <button
          type="button"
          onClick={handleStartMusic}
          style={/** @type {React.CSSProperties} */ ({
            ...toggleButtonStyle,
            bottom: '4.8rem',
            borderColor: 'rgba(236, 72, 153, 0.5)',
          })}
        >
          Play Only Abs Music
        </button>
      ) : null}
      <button type="button" onClick={handleToggleMute} style={toggleButtonStyle}>
        {isMuted ? 'Unmute Only Abs Music' : 'Mute Only Abs Music'}
      </button>
    </>
  );
}
  