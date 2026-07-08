import { Sun, Moon, Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ORG_USER } from '../data/imageData';
import TrialBanner from './TrialBanner';

function DockerLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#1d63ed" />
      <path d="M8 18h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M8 15h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M11 12h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M24 16.5c.5-1.5-.5-3-2-3.5-.5-1.5-2-2-3.5-1.5 0 0-.5-1-2-1-.5 0-1 .2-1.4.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

function NavTab({ label, active, onClick }: { label: string; active: boolean; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center px-4 cursor-pointer whitespace-nowrap transition-colors"
      style={{
        fontSize: '0.9375rem',
        fontWeight: active ? 600 : 400,
        color: active ? '#fff' : 'rgba(255,255,255,0.7)',
        borderBottom: active ? '2px solid #fff' : '2px solid transparent',
      }}
    >
      {label}
    </div>
  );
}

export default function Navbar() {
  const { authState } = useApp();
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isSignedIn = authState !== 'not-signed-in';
  const isOrg = authState.startsWith('org-');
  const orgName = isOrg ? ORG_USER.org : null;
  const avatarLabel = isOrg ? 'PT' : isSignedIn ? 'SB' : null;
  const onMyHub = location.pathname.startsWith('/v3/manage');
  const hasDhi = authState === 'org-trial' || authState === 'org-trial-ended' || authState === 'org-trial-ended-extended' || authState === 'org-entitled' || authState === 'org-at-limit' || authState === 'org-select-customization-limit';
  const showMyHub = isSignedIn;
  const myHubTarget = hasDhi ? '/v3/manage' : '/v3/plans';

  return (
    <>
    <header
      className="sticky top-0 z-50"
      style={{ background: 'linear-gradient(90deg, #1d63ed 0%, #7d2eff 100%)', color: '#ffffff' }}
    >
      <div className="flex items-center px-4 md:px-8" style={{ minHeight: '64px' }}>
        {/* Left — logo + wordmark + nav tabs */}
        <div className="flex items-stretch flex-1 h-16 gap-0">
          <div
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer mr-8"
            onClick={() => navigate('/v3')}
          >
            <DockerLogo />
            <span
              className="text-white"
              style={{ fontSize: '0.9375rem', fontWeight: 680, letterSpacing: '-0.01em' }}
            >
              Docker Hub
            </span>
          </div>

          <NavTab label="Explore" active={!onMyHub} onClick={() => navigate('/v3')} />
          {showMyHub && (
            <NavTab label="My Hub" active={onMyHub} onClick={() => navigate(myHubTarget)} />
          )}
        </div>

        {/* Center — search */}
        <div className="w-[480px] mx-6 flex-shrink-0">
          <div
            className="flex items-center rounded-[6px] px-3 h-9 gap-2"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <Search size={16} style={{ color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search Docker Hub…"
              className="flex-1 bg-transparent border-none outline-none text-sm text-white p-0"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Right — theme toggle + auth */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <button
            onClick={() => setDarkMode(d => !d)}
            className="flex items-center justify-center rounded p-1.5 cursor-pointer border-none bg-transparent"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {isSignedIn && avatarLabel ? (
            <div className="flex items-center gap-3">
              {isOrg && orgName && (
                <span
                  className="inline-flex items-center rounded-full px-2"
                  style={{
                    height: 20,
                    fontSize: '0.6875rem',
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.15)',
                  }}
                >
                  {orgName}
                </span>
              )}
              <div
                className="flex items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ width: 28, height: 28, background: '#1d63ed' }}
              >
                {avatarLabel}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                className="rounded cursor-pointer border font-normal text-white/80 hover:text-white hover:bg-white/10 bg-transparent"
                style={{
                  fontSize: '0.8125rem',
                  padding: '5px 14px',
                  borderColor: 'rgba(255,255,255,0.3)',
                  fontFamily: 'inherit',
                }}
              >
                Sign in
              </button>
              <button
                className="rounded cursor-pointer border text-white"
                style={{
                  fontSize: '0.8125rem',
                  padding: '5px 14px',
                  background: '#1d63ed',
                  borderColor: 'rgba(255,255,255,0.2)',
                  fontFamily: 'inherit',
                }}
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    <TrialBanner />
    </>
  );
}
