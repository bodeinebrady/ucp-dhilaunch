import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { AuthState } from '../context/AppContext';

type Journey = {
  label: string;
  description: string;
  authState: AuthState;
  daysRemaining?: number;
  tag: string;
  tagColor: string;
  tagBg: string;
  borderColor: string;
  arrow: string;
};

const JOURNEYS: Journey[] = [
  {
    label: 'Trial — Early (25 days)',
    description: 'User has just started a free trial. Full access, soft awareness nudge on catalog and drawer.',
    authState: 'org-trial',
    daysRemaining: 25,
    tag: 'Trial',
    tagColor: '#1d63ed',
    tagBg: 'rgba(29,99,237,0.08)',
    borderColor: 'rgba(29,99,237,0.2)',
    arrow: '#1d63ed',
  },
  {
    label: 'Trial — Mid (10 days)',
    description: 'Trial halfway through. Amber nudge escalates — "10 days left, upgrade to keep access."',
    authState: 'org-trial',
    daysRemaining: 10,
    tag: 'Trial',
    tagColor: '#b45309',
    tagBg: 'rgba(232,161,0,0.08)',
    borderColor: 'rgba(232,161,0,0.25)',
    arrow: '#b45309',
  },
  {
    label: 'Trial — Urgent (3 days)',
    description: 'Trial almost over. Red urgent treatment across catalog, drawer, My Hub, and repo detail.',
    authState: 'org-trial',
    daysRemaining: 3,
    tag: 'Urgent',
    tagColor: '#d52536',
    tagBg: 'rgba(213,37,54,0.08)',
    borderColor: 'rgba(213,37,54,0.2)',
    arrow: '#d52536',
  },
  {
    label: 'Trial Ended — Not Extended',
    description: 'Trial expired, no extension granted. Nav banner includes "Request an extension" link alongside the Upgrade CTA.',
    authState: 'org-trial-ended',
    tag: 'Ended',
    tagColor: '#6b7280',
    tagBg: 'rgba(107,114,128,0.08)',
    borderColor: 'rgba(107,114,128,0.2)',
    arrow: '#6b7280',
  },
  {
    label: 'Trial Ended — Extended',
    description: 'Trial expired but an extension was granted. Nav banner acknowledges the extension and pushes toward upgrading.',
    authState: 'org-trial-ended-extended',
    tag: 'Extended',
    tagColor: '#b45309',
    tagBg: 'rgba(232,161,0,0.08)',
    borderColor: 'rgba(232,161,0,0.25)',
    arrow: '#b45309',
  },
];

type PlgScenario = {
  label: string;
  description: string;
  authState: AuthState;
};

const PLG_SCENARIOS: PlgScenario[] = [
  { label: 'Not signed in',        description: 'Anonymous user browsing the catalog. Upsell nudges throughout.',                         authState: 'not-signed-in' },
  { label: 'Personal account',     description: 'Signed in but no org context. Same upsell path as not signed in.',                       authState: 'personal' },
  { label: 'Org — No entitlements', description: 'Org account, no DHI subscription. Full upsell treatment.',                              authState: 'org-no-entitlements' },
  { label: 'Select — Customization limit', description: 'DHI Select subscriber who has used all 5 customization slots. Inline banner on the Customizations tab (manage page + individual repo) with a Contact Sales CTA for Enterprise.', authState: 'org-select-customization-limit' },
];

const OTHER_VERSIONS = [
  { label: 'V1', badge: 'Previous', badgeColor: '#6b7280', badgeBg: '#f3f4f6', description: 'Catalog + image detail with 5 auth states', path: '/v1' },
  { label: 'V2', badge: 'Shipped',  badgeColor: '#388e3c', badgeBg: 'rgba(56,142,60,0.08)', description: 'Neutral CTA + DHI plans page', path: '/v2' },
];

export default function IndexPage() {
  const navigate = useNavigate();
  const { setAuthState, setDaysRemaining } = useApp();

  function startJourney(journey: Journey) {
    setAuthState(journey.authState);
    if (journey.daysRemaining !== undefined) setDaysRemaining(journey.daysRemaining);
    navigate('/v3');
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: 'Manrope Variable, Manrope, sans-serif' }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '64px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
            DHI Free Trial — Prototype
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            Each journey starts on the catalog page. Navigate to My Hub to see the management experience.
          </p>
        </div>

        {/* Journey cards */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
            PLG Motion — Trial Journeys
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {JOURNEYS.map(journey => (
              <button
                key={journey.label}
                onClick={() => startJourney(journey)}
                style={{
                  background: '#fff',
                  border: `1px solid ${journey.borderColor}`,
                  borderRadius: 10,
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  transition: 'box-shadow 0.15s',
                  boxShadow: `0 0 0 0px ${journey.borderColor}`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px ${journey.borderColor}`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 0px transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{journey.label}</span>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: journey.tagColor,
                      background: journey.tagBg,
                      borderRadius: 4, padding: '2px 7px',
                      letterSpacing: '0.04em',
                    }}>
                      {journey.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{journey.description}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: journey.arrow, flexShrink: 0 }}>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* PLG Motion — non-trial scenarios */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
            PLG Motion — Other Scenarios
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {PLG_SCENARIOS.map(s => (
              <button
                key={s.label}
                onClick={() => { setAuthState(s.authState); navigate('/v3'); }}
                style={{
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
                  padding: '18px 22px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: 16, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1d63ed'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 3px rgba(29,99,237,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{s.label}</div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{s.description}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#9ca3af', flexShrink: 0 }}>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Other versions */}
        <div>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 14px' }}>
            Earlier Versions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {OTHER_VERSIONS.map(v => (
              <button
                key={v.label}
                onClick={() => navigate(v.path)}
                style={{
                  background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
                  padding: '18px 22px', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', gap: 16, cursor: 'pointer',
                  fontFamily: 'inherit', textAlign: 'left', transition: 'border-color 0.15s, box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1d63ed'; (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 0 3px rgba(29,99,237,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'; (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'; }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{v.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: v.badgeColor, background: v.badgeBg, borderRadius: 4, padding: '2px 6px', letterSpacing: '0.04em' }}>{v.badge}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{v.description}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: '#9ca3af', flexShrink: 0 }}>
                  <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
