import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { AuthState } from '../context/AppContext';

const ALL_SCENARIOS: { label: string; value: AuthState }[] = [
  { label: 'Not signed in',         value: 'not-signed-in' },
  { label: 'Personal',              value: 'personal' },
  { label: 'Org — Entitled',        value: 'org-entitled' },
  { label: 'Org — At limit',        value: 'org-at-limit' },
  { label: 'Org — No entitlements', value: 'org-no-entitlements' },
];

const VIOLET = {
  pill: '#7d2eff',
  pillBg: 'rgba(125,46,255,0.1)',
  pillBorder: 'rgba(125,46,255,0.3)',
  label: '#6020cc',
};

/**
 * ScenarioBar has two modes:
 *
 * - `mode="pills"` (default for V1/V2): shows the full auth-state pill row so
 *   the user can switch scenarios without leaving the page.
 *
 * - `mode="back"` (used by V3): shows only the "← Scenarios" back link, since
 *   V3 scenario selection lives on the index page.
 */
export default function ScenarioBar({ mode = 'pills' }: { mode?: 'pills' | 'back' }) {
  const { authState, setAuthState, daysRemaining } = useApp();
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 32px',
        flexShrink: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Back link — always present */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 border-none bg-transparent cursor-pointer p-0"
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          color: VIOLET.pill,
          fontFamily: 'inherit',
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M7.5 2L3.5 6l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Scenarios
      </button>

      <div style={{ width: 1, height: 16, backgroundColor: '#e0e0e0', flexShrink: 0 }} />

      {mode === 'pills' ? (
        /* Pill row — V1 / V2 */
        <>
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              color: VIOLET.pill,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Auth state
          </span>

          <div style={{ width: 1, height: 16, backgroundColor: '#d0d0d0', flexShrink: 0 }} />

          <div style={{ display: 'flex', gap: 6, flexShrink: 0, overflowX: 'auto' }}>
            {ALL_SCENARIOS.map((s) => {
              const isActive = authState === s.value;
              return (
                <button
                  key={s.value}
                  onClick={() => setAuthState(s.value)}
                  style={{
                    padding: '2px 12px',
                    borderRadius: 100,
                    border: `1px solid ${isActive ? VIOLET.pill : VIOLET.pillBorder}`,
                    backgroundColor: isActive ? VIOLET.pillBg : 'transparent',
                    fontSize: '0.75rem',
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? VIOLET.pill : VIOLET.label,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </>
      ) : (
        /* Back-link-only mode — V3 shows current state label */
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 700,
            color: VIOLET.pill,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {(() => {
            if (authState === 'not-signed-in') return 'Not signed in';
            if (authState === 'personal') return 'Personal';
            if (authState === 'org-entitled') return 'Org — Entitled';
            if (authState === 'org-at-limit') return 'Org — At limit';
            if (authState === 'org-no-entitlements') return 'Org — No entitlements';
            if (authState === 'org-trial') return `Trial — ${daysRemaining} days remaining`;
            if (authState === 'org-trial-ended') return 'Trial Ended — Not Extended';
            if (authState === 'org-trial-ended-extended') return 'Trial Ended — Extended';
            if (authState === 'org-select-customization-limit') return 'Select — Customization limit';
            return authState;
          })()}
        </span>
      )}
    </div>
  );
}
