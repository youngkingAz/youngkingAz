import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useToast } from '../components/ui/use-toast';
import { openBillingPortal } from '../lib/billing';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { buildProgressState, resetAllWorkoutProgress } from '../lib/workoutProgress';

/**
 * @typedef {object} AvatarEditorState
 * @property {string} previewUrl
 * @property {number} zoom
 * @property {number} offsetX
 * @property {number} offsetY
 */

/**
 * @typedef {object} EditableUser
 * @property {string} id
 * @property {string | null | undefined} [email]
 * @property {string | null | undefined} [full_name]
 * @property {{
 *   avatar_url?: string | null | undefined,
 *   premium_plan?: string | null | undefined,
 *   has_premium_access?: boolean | null | undefined,
 * } | null} [profile]
 * @property {string | null | undefined} [role]
 */

/** @type {React.CSSProperties} */
const pageStyle = {
  padding: '2rem 1.5rem 3rem',
};

/** @type {React.CSSProperties} */
const containerStyle = {
  width: '100%',
  maxWidth: '34rem',
  margin: '0 auto',
};

/** @type {React.CSSProperties} */
const titleStyle = {
  margin: '0 0 2rem',
  fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
  letterSpacing: '-0.04em',
  color: '#f5f5f5',
};

/** @type {React.CSSProperties} */
const loadingCardStyle = {
  height: '16rem',
  borderRadius: '1rem',
  background: '#111111',
  border: '1px solid #2a2a2a',
};

/** @type {React.CSSProperties} */
const avatarStyle = {
  width: '5rem',
  height: '5rem',
  borderRadius: '999px',
  background: 'rgba(249, 115, 22, 0.12)',
  border: '2px solid rgba(249, 115, 22, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#f97316',
  fontSize: '1.5rem',
  fontWeight: 700,
  overflow: 'hidden',
  flexShrink: 0,
};

/** @type {React.CSSProperties} */
const avatarImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
  borderRadius: '999px',
};

/** @type {React.CSSProperties} */
const badgeCardStyle = {
  background: '#1a1a1a',
  borderRadius: '0.75rem',
  padding: '1rem',
  textAlign: 'center',
};

/** @type {React.CSSProperties} */
const subscriptionValueStyle = {
  margin: 0,
  fontSize: '0.75rem',
  color: '#a3a3a3',
  textTransform: 'capitalize',
};

/** @type {React.CSSProperties} */
const motivationCardStyle = {
  border: '1px solid rgba(249, 115, 22, 0.1)',
  borderRadius: '1rem',
  padding: '1.5rem',
  textAlign: 'center',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), #111111 60%, #111111 100%)',
};

/** @type {React.CSSProperties} */
const dangerCardStyle = {
  border: '1px solid rgba(185, 28, 28, 0.28)',
  borderRadius: '1rem',
  padding: '1.5rem',
  background: 'linear-gradient(135deg, rgba(127, 29, 29, 0.16), #111111 65%)',
};

/** @type {React.CSSProperties} */
const infoCardStyle = {
  border: '1px solid rgba(249, 115, 22, 0.16)',
  borderRadius: '1rem',
  padding: '1.5rem',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.08), #111111 70%)',
};

/** @type {React.CSSProperties} */
const labelStyle = {
  display: 'block',
  marginBottom: '0.45rem',
  color: '#f5f5f5',
  fontSize: '0.9rem',
  fontWeight: 600,
};

/** @type {React.CSSProperties} */
const inputStyle = {
  width: '100%',
  borderRadius: '0.8rem',
  border: '1px solid #2a2a2a',
  background: '#101010',
  color: '#f5f5f5',
  padding: '0.9rem 1rem',
  fontSize: '0.95rem',
  outline: 'none',
};

/**
 * @param {boolean} active
 * @returns {React.CSSProperties}
 */
const tabButtonStyle = (active) => ({
  flex: 1,
  border: '1px solid rgba(249, 115, 22, 0.22)',
  background: active ? '#f97316' : 'transparent',
  color: active ? '#120800' : '#f5f5f5',
  borderRadius: '999px',
  padding: '0.75rem 1rem',
  fontWeight: 700,
  cursor: 'pointer',
});

/** @type {React.CSSProperties} */
const helperTextStyle = {
  margin: '0.75rem 0 0',
  fontSize: '0.85rem',
  color: '#a3a3a3',
  lineHeight: 1.6,
};

/** @type {React.CSSProperties} */
const cropEditorWrapStyle = {
  marginBottom: '2rem',
  padding: '1rem',
  borderRadius: '1rem',
  border: '1px solid #2a2a2a',
  background: '#0f0f0f',
};

/** @type {React.CSSProperties} */
const cropPreviewStyle = {
  position: 'relative',
  width: '220px',
  height: '220px',
  margin: '0 auto 1rem',
  borderRadius: '1rem',
  overflow: 'hidden',
  background: '#070707',
  border: '1px solid #1f1f1f',
};

/** @type {React.CSSProperties} */
const rangeInputStyle = {
  width: '100%',
  accentColor: '#f97316',
};

/**
 * @param {unknown} error
 * @returns {string}
 */
function getErrorMessage(error) {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * @param {string | null | undefined} avatarUrl
 * @returns {string | null}
 */
function getStoragePathFromAvatarUrl(avatarUrl) {
  if (!avatarUrl) {
    return null;
  }

  try {
    const url = new URL(avatarUrl);
    const marker = '/storage/v1/object/public/profile-images/';
    const pathIndex = url.pathname.indexOf(marker);
    if (pathIndex < 0) {
      return null;
    }

    return url.pathname.slice(pathIndex + marker.length);
  } catch {
    return null;
  }
}

/**
 * @param {EditableUser | null | undefined} user
 * @returns {Promise<void>}
 */
async function ensureProfileRecord(user) {
  if (!user?.id) {
    throw new Error('No user account found.');
  }

  const payload = {
    id: user.id,
    email: user.email || null,
    full_name: user.full_name || null,
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, {
      onConflict: 'id',
    });

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * @param {string} imageSource
 * @param {AvatarEditorState} crop
 * @returns {Promise<Blob>}
 */
async function createCroppedAvatarBlob(imageSource, crop) {
  const image = await new Promise((resolve, reject) => {
    const nextImage = new Image();
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = () => reject(new Error('Could not load the selected image.'));
    nextImage.src = imageSource;
  });

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Could not prepare avatar editor.');
  }

  const sourceWidth = image.width;
  const sourceHeight = image.height;
  const baseScale = Math.max(canvas.width / sourceWidth, canvas.height / sourceHeight);
  const scaledWidth = sourceWidth * baseScale * crop.zoom;
  const scaledHeight = sourceHeight * baseScale * crop.zoom;
  const x = (canvas.width - scaledWidth) / 2 + crop.offsetX;
  const y = (canvas.height - scaledHeight) / 2 + crop.offsetY;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, x, y, scaledWidth, scaledHeight);

  const blob = await new Promise((resolve) => {
    canvas.toBlob((nextBlob) => resolve(nextBlob), 'image/png', 0.92);
  });

  if (!blob) {
    throw new Error('Could not create profile photo.');
  }

  return blob;
}

export default function Profile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const {
    user,
    isLoadingAuth,
    logout,
    signIn,
    signUp,
    authError,
    isSupabaseConfigured,
    refreshUserProfile,
  } = useAuth();

  const [mode, setMode] = useState('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileName, setProfileName] = useState('');
  const [localMessage, setLocalMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [isAvatarRemoving, setIsAvatarRemoving] = useState(false);
  const [isSavingName, setIsSavingName] = useState(false);
  const [isResettingAllProgress, setIsResettingAllProgress] = useState(false);
  const [avatarEditor, setAvatarEditor] = useState(/** @type {AvatarEditorState | null} */ (null));
  const fileInputRef = useRef(/** @type {HTMLInputElement | null} */ (null));

  const athleteName = useMemo(() => {
    if (user?.full_name) {
      return user.full_name;
    }

    if (user?.email) {
      return user.email.split('@')[0];
    }

    return 'Athlete';
  }, [user]);

  const initials = useMemo(() => {
    return (
      athleteName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'YK'
    );
  }, [athleteName]);

  useEffect(() => {
    setProfileName(user?.full_name || '');
  }, [user?.full_name]);

  useEffect(() => {
    return () => {
      if (avatarEditor?.previewUrl) {
        URL.revokeObjectURL(avatarEditor.previewUrl);
      }
    };
  }, []);

  /**
   * @param {React.FormEvent<HTMLFormElement>} event
   */
  async function handleSubmit(event) {
    event.preventDefault();
    setLocalMessage('');
    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp({
          email,
          password,
          fullName,
        });

        if (!error) {
          setLocalMessage('Account created. If email confirmation is on, check your inbox next.');
        }
      } else {
        const { error } = await signIn({
          email,
          password,
        });

        if (!error) {
          setLocalMessage('Signed in successfully.');
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleManageSubscription() {
    setLocalMessage('');
    setIsPortalLoading(true);

    try {
      await openBillingPortal();
    } catch (error) {
      setLocalMessage(getErrorMessage(error) || 'Could not open billing portal.');
      setIsPortalLoading(false);
    }
  }

  /**
   * @param {React.ChangeEvent<HTMLInputElement>} event
   */
  function handleAvatarFileSelect(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLocalMessage('');

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setLocalMessage('Please upload a JPG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLocalMessage('Please keep profile photos under 5 MB.');
      event.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarEditor({
      previewUrl,
      zoom: 1,
      offsetX: 0,
      offsetY: 0,
    });

    event.target.value = '';
  }

  async function handleSaveAvatar() {
    if (!avatarEditor || !user?.id) {
      return;
    }

    setLocalMessage('');
    setIsAvatarUploading(true);

    try {
      await ensureProfileRecord(user);

      const nextBlob = await createCroppedAvatarBlob(avatarEditor.previewUrl, avatarEditor);
      const filePath = `${user.id}/avatar-${Date.now()}.png`;
      const previousAvatarPath = getStoragePathFromAvatarUrl(user?.profile?.avatar_url);

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, nextBlob, {
          cacheControl: '3600',
          upsert: true,
          contentType: 'image/png',
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('profile-images').getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      if (previousAvatarPath && previousAvatarPath !== filePath) {
        await supabase.storage.from('profile-images').remove([previousAvatarPath]);
      }

      await refreshUserProfile();
      URL.revokeObjectURL(avatarEditor.previewUrl);
      setAvatarEditor(null);
      setLocalMessage('Profile photo updated.');
    } catch (error) {
      setLocalMessage(getErrorMessage(error) || 'Could not upload profile photo.');
    } finally {
      setIsAvatarUploading(false);
    }
  }

  function handleCancelAvatarEdit() {
    if (avatarEditor?.previewUrl) {
      URL.revokeObjectURL(avatarEditor.previewUrl);
    }

    setAvatarEditor(null);
    setLocalMessage('');
  }

  async function handleRemoveAvatar() {
    if (!user?.id) {
      return;
    }

    setLocalMessage('');
    setIsAvatarRemoving(true);

    try {
      await ensureProfileRecord(user);

      const currentAvatarPath = getStoragePathFromAvatarUrl(user?.profile?.avatar_url);

      if (currentAvatarPath) {
        await supabase.storage.from('profile-images').remove([currentAvatarPath]);
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
        })
        .eq('id', user.id);

      if (updateError) {
        throw new Error(updateError.message);
      }

      await refreshUserProfile();
      setLocalMessage('Profile photo removed.');
    } catch (error) {
      setLocalMessage(getErrorMessage(error) || 'Could not remove profile photo.');
    } finally {
      setIsAvatarRemoving(false);
    }
  }

  async function handleSaveDisplayName() {
    if (!user?.id) {
      return;
    }

    const nextName = profileName.trim();
    if (!nextName) {
      setLocalMessage('Please enter a display name.');
      return;
    }

    setLocalMessage('');
    setIsSavingName(true);

    try {
      await ensureProfileRecord(user);

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: nextName,
        })
        .eq('id', user.id);

      if (profileError) {
        throw new Error(profileError.message);
      }

      const { error: authUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: nextName,
        },
      });

      if (authUpdateError) {
        throw new Error(authUpdateError.message);
      }

      await refreshUserProfile();
      setLocalMessage('Display name updated.');
    } catch (error) {
      setLocalMessage(getErrorMessage(error) || 'Could not update display name.');
    } finally {
      setIsSavingName(false);
    }
  }

  async function handleResetAllProgress() {
    const confirmed = window.confirm(
      'Are you sure you want to reset your progress? All completed workouts will be reset back to how it was before, starting again from Day 1.',
    );

    if (!confirmed) {
      return;
    }

    setLocalMessage('');
    setIsResettingAllProgress(true);

    try {
      await resetAllWorkoutProgress({
        userId: user?.id || null,
      });

      queryClient.setQueriesData(
        { queryKey: ['workout-progress', user?.id || 'guest'] },
        () => buildProgressState([]),
      );

      queryClient.removeQueries({
        queryKey: ['workout-progress', user?.id || 'guest'],
      });

      await queryClient.invalidateQueries({
        queryKey: ['workout-progress', user?.id || 'guest'],
      });

      await queryClient.refetchQueries({
        queryKey: ['workout-progress', user?.id || 'guest'],
      });

      toast({
        title: 'All progress reset',
        description: 'Your workout grind is back at Day 1. Time to build it up again.',
      });
    } catch (error) {
      toast({
        title: 'Could not reset all progress',
        description: getErrorMessage(error) || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResettingAllProgress(false);
    }
  }

  if (isLoadingAuth) {
    return (
      <div style={pageStyle}>
        <div style={containerStyle}>
          <div style={loadingCardStyle} />
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>PROFILE</h1>

        {!isSupabaseConfigured ? (
          <Card
            style={{
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ marginTop: 0, color: '#f5f5f5' }}>Supabase not connected yet</h2>
            <p style={{ color: '#a3a3a3', lineHeight: 1.7, marginBottom: 0 }}>
              Add your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the `.env` file,
              restart Vite, and this page will become your auth test screen.
            </p>
          </Card>
        ) : user ? (
          <>
            <Card
              style={{
                padding: '2rem',
                borderRadius: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  marginBottom: '2rem',
                }}
              >
                {user?.profile?.avatar_url ? (
                  <div style={avatarStyle}>
                    <img src={user.profile.avatar_url} alt={`${athleteName} profile`} style={avatarImageStyle} />
                  </div>
                ) : (
                  <div style={avatarStyle}>{initials}</div>
                )}
                <div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: '1.25rem',
                      fontWeight: 600,
                      color: '#f5f5f5',
                    }}
                  >
                    {athleteName}
                  </h2>
                  <p
                    style={{
                      margin: '0.35rem 0 0',
                      fontSize: '0.9rem',
                      color: '#a3a3a3',
                    }}
                  >
                    {user?.email || 'No email connected'}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label>
                  <span style={labelStyle}>Display Name</span>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(event) => setProfileName(event.target.value)}
                    style={inputStyle}
                    placeholder="YoungKingAz"
                  />
                </label>
                <Button
                  variant="outline"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  onClick={handleSaveDisplayName}
                  disabled={isSavingName}
                >
                  {isSavingName ? 'Saving name...' : 'Save Display Name'}
                </Button>
                <p style={helperTextStyle}>
                  Let members personalize their profile so the program feels more like their own journey.
                </p>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarFileSelect}
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline"
                  style={{ width: '100%' }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAvatarUploading || isAvatarRemoving}
                >
                  Upload Profile Photo
                </Button>
                {user?.profile?.avatar_url ? (
                  <Button
                    variant="outline"
                    style={{
                      width: '100%',
                      marginTop: '0.75rem',
                      borderColor: 'rgba(185, 28, 28, 0.35)',
                      color: '#fca5a5',
                      background: 'transparent',
                    }}
                    onClick={handleRemoveAvatar}
                    disabled={isAvatarUploading || isAvatarRemoving}
                  >
                    {isAvatarRemoving ? 'Removing photo...' : 'Remove Profile Photo'}
                  </Button>
                ) : null}
                <p style={helperTextStyle}>
                  Add your own profile photo so your account feels personal and part of the YoungKingAz program.
                </p>
              </div>

              {avatarEditor ? (
                <div style={cropEditorWrapStyle}>
                  <p style={{ margin: '0 0 0.85rem', color: '#f5f5f5', fontWeight: 700 }}>
                    Adjust Your Profile Photo
                  </p>
                  <div style={cropPreviewStyle}>
                    <img
                      src={avatarEditor.previewUrl}
                      alt="Profile photo preview"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: `translate(calc(-50% + ${avatarEditor.offsetX}px), calc(-50% + ${avatarEditor.offsetY}px)) scale(${avatarEditor.zoom})`,
                        transformOrigin: 'center',
                      }}
                    />
                  </div>

                  <label>
                    <span style={labelStyle}>Zoom</span>
                    <input
                      type="range"
                      min="1"
                      max="2.8"
                      step="0.05"
                      value={avatarEditor.zoom}
                      onChange={
                        /** @param {React.ChangeEvent<HTMLInputElement>} event */
                        (event) =>
                          setAvatarEditor(
                            /** @param {AvatarEditorState | null} current */
                            (current) =>
                              current
                                ? {
                                    ...current,
                                    zoom: Number(event.target.value),
                                  }
                                : current,
                          )
                      }
                      style={rangeInputStyle}
                    />
                  </label>

                  <label>
                    <span style={labelStyle}>Move Left / Right</span>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      step="1"
                      value={avatarEditor.offsetX}
                      onChange={
                        /** @param {React.ChangeEvent<HTMLInputElement>} event */
                        (event) =>
                          setAvatarEditor(
                            /** @param {AvatarEditorState | null} current */
                            (current) =>
                              current
                                ? {
                                    ...current,
                                    offsetX: clamp(Number(event.target.value), -120, 120),
                                  }
                                : current,
                          )
                      }
                      style={rangeInputStyle}
                    />
                  </label>

                  <label>
                    <span style={labelStyle}>Move Up / Down</span>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      step="1"
                      value={avatarEditor.offsetY}
                      onChange={
                        /** @param {React.ChangeEvent<HTMLInputElement>} event */
                        (event) =>
                          setAvatarEditor(
                            /** @param {AvatarEditorState | null} current */
                            (current) =>
                              current
                                ? {
                                    ...current,
                                    offsetY: clamp(Number(event.target.value), -120, 120),
                                  }
                                : current,
                          )
                      }
                      style={rangeInputStyle}
                    />
                  </label>

                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <Button onClick={handleSaveAvatar} disabled={isAvatarUploading}>
                      {isAvatarUploading ? 'Saving photo...' : 'Save Cropped Photo'}
                    </Button>
                    <Button variant="outline" onClick={handleCancelAvatarEdit} disabled={isAvatarUploading}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem',
                }}
              >
                <div style={badgeCardStyle}>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      margin: '0 auto 0.5rem',
                      borderRadius: '999px',
                      background: 'rgba(249, 115, 22, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f97316',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    VIP
                  </div>
                  <p style={subscriptionValueStyle}>
                    {user?.role || 'User'}
                  </p>
                </div>

                <div style={badgeCardStyle}>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      margin: '0 auto 0.5rem',
                      borderRadius: '999px',
                      background: 'rgba(249, 115, 22, 0.14)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f97316',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    GO
                  </div>
                  <p style={subscriptionValueStyle}>
                    {user?.profile?.premium_plan
                      ? `${user.profile.premium_plan} plan`
                      : user?.profile?.has_premium_access
                        ? 'Premium active'
                        : 'Signed In'}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                style={{
                  width: '100%',
                  marginBottom: user?.profile?.premium_plan ? '0.85rem' : 0,
                }}
                onClick={user?.profile?.premium_plan ? handleManageSubscription : () => logout()}
                disabled={isPortalLoading}
              >
                {user?.profile?.premium_plan
                  ? isPortalLoading
                    ? 'Opening billing portal...'
                    : 'Manage Subscription'
                  : (
                    <>
                      <span aria-hidden="true">x</span>
                      Sign Out
                    </>
                  )}
              </Button>

              {user?.profile?.premium_plan ? (
                <>
                  <Button
                    variant="outline"
                    style={{
                      width: '100%',
                      borderColor: 'rgba(185, 28, 28, 0.35)',
                      color: '#fca5a5',
                      background: 'transparent',
                    }}
                    onClick={() => logout()}
                  >
                    <span aria-hidden="true">x</span>
                    Sign Out
                  </Button>
                  <p style={helperTextStyle}>
                    Manage Subscription opens Stripe&apos;s secure customer portal so customers can cancel before the next monthly renewal.
                  </p>
                </>
              ) : null}

              {localMessage ? (
                <p style={{ margin: '0.75rem 0 0', color: '#fdba74', lineHeight: 1.5 }}>{localMessage}</p>
              ) : null}
            </Card>

            <div style={motivationCardStyle}>
              <p
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  letterSpacing: '0.08em',
                  color: '#f97316',
                  fontWeight: 700,
                }}
              >
                TRAIN LIKE A KING
              </p>
              <p
                style={{
                  margin: '0.35rem 0 0',
                  fontSize: '0.9rem',
                  color: '#a3a3a3',
                }}
              >
                Your profile now feels more personal, and your name and photo can grow with your journey.
              </p>
            </div>

            <div style={{ height: '1rem' }} />

            <Card style={dangerCardStyle}>
              <p
                style={{
                  margin: '0 0 0.35rem',
                  color: '#fca5a5',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Reset Workout Progress
              </p>
              <p style={{ margin: '0 0 1rem', color: '#d4d4d4', lineHeight: 1.6 }}>
                If you want to start completely over, you can reset every workout back to Day 1. We will ask you to confirm first so nothing disappears by accident.
              </p>
              <Button
                variant="outline"
                style={{
                  width: '100%',
                  borderColor: 'rgba(185, 28, 28, 0.35)',
                  color: '#fca5a5',
                  background: 'transparent',
                }}
                onClick={handleResetAllProgress}
                disabled={isResettingAllProgress}
              >
                {isResettingAllProgress ? 'Resetting all progress...' : 'Reset All Progress'}
              </Button>
            </Card>

            <div style={{ height: '1rem' }} />

            <Card style={infoCardStyle}>
              <p
                style={{
                  margin: '0 0 0.35rem',
                  color: '#fdba74',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Music Credit
              </p>
              <p style={{ margin: 0, color: '#d4d4d4', lineHeight: 1.6 }}>
                The Only Abs background track is not owned by YoungKingAz.
              </p>
            </Card>
          </>
        ) : (
          <Card
            style={{
              padding: '2rem',
              borderRadius: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button type="button" onClick={() => setMode('signin')} style={tabButtonStyle(mode === 'signin')}>
                Sign In
              </button>
              <button type="button" onClick={() => setMode('signup')} style={tabButtonStyle(mode === 'signup')}>
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
              {mode === 'signup' ? (
                <label>
                  <span style={labelStyle}>Full Name</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    style={inputStyle}
                    placeholder="YoungKingAz"
                  />
                </label>
              ) : null}

              <label>
                <span style={labelStyle}>Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  style={inputStyle}
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label>
                <span style={labelStyle}>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={inputStyle}
                  placeholder="At least 6 characters"
                  required
                />
              </label>

              {authError?.message ? (
                <p style={{ margin: 0, color: '#fca5a5', lineHeight: 1.5 }}>{authError.message}</p>
              ) : null}

              {localMessage ? (
                <p style={{ margin: 0, color: '#fdba74', lineHeight: 1.5 }}>{localMessage}</p>
              ) : null}

              <Button
                type="submit"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                }}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Working...'
                  : mode === 'signup'
                    ? 'Create Account'
                    : 'Sign In'}
              </Button>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
