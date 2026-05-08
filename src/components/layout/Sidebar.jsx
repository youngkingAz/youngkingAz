import React, { useState } from 'react';
import { Dumbbell, House, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import instagramLogo from '../../assets/instagram-logo.png';
import youngkingAzLogo from '../../assets/youngkingaz-logo.png';
import { useAuth } from '../../lib/AuthContext';

const instagramUrl = 'https://www.instagram.com/astmarc38/';

const navItems = [
  { path: '/', label: 'Home', icon: House },
  { path: '/programs', label: 'Programs', icon: Dumbbell },
  { path: '/profile', label: 'Profile', icon: User },
];

/** @type {React.CSSProperties} */
const mobileBarStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.9rem 1rem',
  background: 'rgba(5, 5, 5, 0.9)',
  borderBottom: '1px solid #1f1f1f',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
};

/** @type {React.CSSProperties} */
const brandStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  color: '#f5f5f5',
  textDecoration: 'none',
};

/** @type {React.CSSProperties} */
const logoStyle = {
  width: '2.6rem',
  height: '2.6rem',
  objectFit: 'contain',
  display: 'block',
  flexShrink: 0,
};

/** @type {React.CSSProperties} */
const brandTextStyle = {
  fontSize: '1.1rem',
  letterSpacing: '0.12em',
  fontWeight: 800,
};

/** @type {React.CSSProperties} */
const desktopBrandTextStyle = {
  ...brandTextStyle,
  fontSize: '1.35rem',
};

/** @type {React.CSSProperties} */
const menuButtonStyle = {
  border: '1px solid #2a2a2a',
  background: '#101010',
  color: '#f5f5f5',
  borderRadius: '0.75rem',
  padding: '0.55rem 0.8rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

/** @type {React.CSSProperties} */
const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  zIndex: 49,
};

/** @type {React.CSSProperties} */
const mobilePanelStyle = {
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  width: '260px',
  zIndex: 50,
  background: '#0b0b0b',
  borderRight: '1px solid #1f1f1f',
  padding: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
};

/** @type {React.CSSProperties} */
const mobileHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '2rem',
};

/** @type {React.CSSProperties} */
const navStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
};

/** @type {React.CSSProperties} */
const footerStyle = {
  paddingTop: '1.25rem',
  marginTop: 'auto',
  borderTop: '1px solid #1f1f1f',
  color: '#9ca3af',
  fontSize: '0.75rem',
};

/** @type {React.CSSProperties} */
const memberCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginTop: '1rem',
  padding: '0.85rem',
  borderRadius: '0.9rem',
  background: '#101010',
  border: '1px solid #1f1f1f',
};

/** @type {React.CSSProperties} */
const memberAvatarStyle = {
  width: '2.6rem',
  height: '2.6rem',
  borderRadius: '999px',
  background: 'rgba(249, 115, 22, 0.12)',
  border: '1px solid rgba(249, 115, 22, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#f97316',
  overflow: 'hidden',
  flexShrink: 0,
  fontWeight: 700,
};

/** @type {React.CSSProperties} */
const memberAvatarImageStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

/** @type {React.CSSProperties} */
const instagramBannerStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '0.8rem',
  marginTop: '1rem',
  padding: '0.95rem',
  borderRadius: '1rem',
  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(236, 72, 153, 0.16), #101010)',
  border: '1px solid rgba(249, 115, 22, 0.22)',
  color: '#f5f5f5',
  textDecoration: 'none',
};

/** @type {React.CSSProperties} */
const instagramIconWrapStyle = {
  width: '3rem',
  height: '3rem',
  borderRadius: '0.8rem',
  overflow: 'hidden',
  flexShrink: 0,
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '0.1rem',
};

/** @type {React.CSSProperties} */
const instagramIconStyle = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
};

/** @type {React.CSSProperties} */
const instagramContentStyle = {
  minWidth: 0,
  flex: 1,
};

/** @type {React.CSSProperties} */
const instagramNameStyle = {
  margin: 0,
  color: '#f97316',
  fontSize: '0.78rem',
  fontWeight: 800,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
};

/** @type {React.CSSProperties} */
const instagramTextStyle = {
  margin: '0.4rem 0 0',
  color: '#d4d4d4',
  fontSize: '0.72rem',
  lineHeight: 1.45,
};

/**
 * @param {boolean} active
 * @returns {React.CSSProperties}
 */
function getLinkStyle(active) {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.9rem 1rem',
    borderRadius: '0.8rem',
    color: active ? '#f97316' : '#b3b3b3',
    background: active ? 'rgba(249, 115, 22, 0.1)' : 'transparent',
    textDecoration: 'none',
    fontSize: '0.92rem',
    fontWeight: 600,
    border: active ? '1px solid rgba(249, 115, 22, 0.2)' : '1px solid transparent',
    transition: 'all 0.15s ease',
  };
}

/**
 * @param {{ currentPath?: string, onNavigate?: (() => void) | undefined }} props
 */
function NavList({ currentPath, onNavigate }) {
  return (
    <nav style={navStyle}>
      {navItems.map((item) => {
        const active = currentPath === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            style={getLinkStyle(active)}
          >
            <Icon size={18} strokeWidth={2.2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function InstagramBanner() {
  return (
    <a href={instagramUrl} target="_blank" rel="noreferrer" style={instagramBannerStyle}>
      <span style={instagramIconWrapStyle} aria-hidden="true">
        <img src={instagramLogo} alt="" style={instagramIconStyle} />
      </span>
      <div style={instagramContentStyle}>
        <p style={instagramNameStyle}>YoungKingAz</p>
        <p style={instagramTextStyle}>
          Follow my Instagram and give me feedback on the app or website if anything is bugging,
          lagging, or not working.
        </p>
      </div>
    </a>
  );
}

/**
 * @param {{ currentPath?: string }} props
 */
export default function Sidebar({ currentPath = '/' }) {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const memberName = user?.full_name || user?.email?.split('@')[0] || 'Member';
  const memberInitial = memberName?.[0]?.toUpperCase() || 'Y';

  return (
    <>
      <div style={mobileBarStyle}>
        <Link to="/" style={brandStyle}>
          <img src={youngkingAzLogo} alt="YoungKingAz logo" style={logoStyle} />
          <span style={brandTextStyle}>YOUNGKINGAZ</span>
        </Link>
        <button type="button" onClick={() => setOpen(true)} style={menuButtonStyle}>
          Menu
        </button>
      </div>

      {open && <div style={overlayStyle} onClick={() => setOpen(false)} />}

      {open && (
        <div style={mobilePanelStyle}>
          <div style={mobileHeaderStyle}>
            <Link to="/" style={brandStyle} onClick={() => setOpen(false)}>
              <img src={youngkingAzLogo} alt="YoungKingAz logo" style={logoStyle} />
              <span style={brandTextStyle}>YOUNGKINGAZ</span>
            </Link>
            <button type="button" onClick={() => setOpen(false)} style={menuButtonStyle}>
              Close
            </button>
          </div>

          <NavList currentPath={currentPath} onNavigate={() => setOpen(false)} />

          <div style={footerStyle}>
            <InstagramBanner />
          </div>
        </div>
      )}

      <aside
        style={{
          display: 'none',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '240px',
          background: '#0b0b0b',
          borderRight: '1px solid #1f1f1f',
          padding: '1.5rem',
          zIndex: 40,
          flexDirection: 'column',
        }}
        className="desktop-sidebar"
      >
        <Link to="/" style={{ ...brandStyle, marginBottom: '2.5rem' }}>
          <img src={youngkingAzLogo} alt="YoungKingAz logo" style={logoStyle} />
          <span style={desktopBrandTextStyle}>YOUNGKINGAZ</span>
        </Link>

        <NavList currentPath={currentPath} />

        <div style={footerStyle}>
          {user ? (
            <div style={memberCardStyle}>
              <div style={memberAvatarStyle}>
                {user?.profile?.avatar_url ? (
                  <img src={user.profile.avatar_url} alt={`${memberName} avatar`} style={memberAvatarImageStyle} />
                ) : (
                  <span>{memberInitial}</span>
                )}
              </div>
              <div>
                <p style={{ margin: 0, color: '#f5f5f5', fontSize: '0.82rem', fontWeight: 600 }}>{memberName}</p>
                <p style={{ margin: '0.2rem 0 0', color: '#9ca3af', fontSize: '0.72rem' }}>
                  {user?.profile?.premium_plan ? `${user.profile.premium_plan} plan` : 'YoungKingAz member'}
                </p>
              </div>
            </div>
          ) : null}
          <InstagramBanner />
          <p style={{ margin: 0 }}>Train like a king.</p>
        </div>
      </aside>
    </>
  );
}
