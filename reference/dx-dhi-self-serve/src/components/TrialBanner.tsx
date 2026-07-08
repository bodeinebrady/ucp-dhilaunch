import { AlertTriangle, Zap, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

/**
 * Full-width trial urgency banner. Renders only for:
 *   - org-trial with ≤7 days remaining (red, not dismissable)
 *   - org-trial-ended (amber, dismissable, includes extension form link)
 *   - org-trial-ended-extended (amber, dismissable, pushes upgrade)
 *
 * Sits directly below the Navbar on every page.
 */
export default function TrialBanner() {
  const { authState, daysRemaining } = useApp();
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  const isUrgentTrial = authState === 'org-trial' && daysRemaining <= 7;
  const isTrialEndedNotExtended = authState === 'org-trial-ended';
  const isTrialEndedExtended = authState === 'org-trial-ended-extended';
  const isDismissable = isTrialEndedNotExtended || isTrialEndedExtended;

  if (!isUrgentTrial && !isTrialEndedNotExtended && !isTrialEndedExtended) return null;
  if (isDismissable && dismissed) return null;

  const bg = isUrgentTrial ? 'rgba(213,37,54,0.07)' : 'rgba(232,161,0,0.07)';
  const border = isUrgentTrial ? 'rgba(213,37,54,0.25)' : 'rgba(232,161,0,0.3)';
  const iconColor = isUrgentTrial ? '#d52536' : '#b45309';
  const textColor = isUrgentTrial ? '#7f1d1d' : '#78350f';
  const subColor = isUrgentTrial ? '#991b1b' : '#92400e';
  const btnBg = isUrgentTrial ? '#d52536' : '#b45309';

  const headline = isUrgentTrial
    ? `Your trial ends in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} — upgrade to keep your mirrored images`
    : isTrialEndedExtended
    ? 'Your trial has been extended — upgrade to DHI Enterprise before it ends'
    : 'Your trial has ended — mirrored images have stopped receiving updates';

  const sub = isUrgentTrial
    ? 'After your trial, mirrored repositories stop receiving SLA-backed updates. Upgrade now to avoid disruption.'
    : isTrialEndedExtended
    ? 'You have additional time to evaluate DHI. Upgrade to DHI Enterprise to keep your mirrors and SLA-backed CVE fixes.'
    : 'Upgrade to DHI Enterprise to restore SLA-backed CVE fixes, customizations, and full mirror access.';

  return (
    <div
      style={{
        background: bg,
        borderBottom: `1px solid ${border}`,
        width: '100%',
      }}
    >
      <div
        className="flex items-center justify-between gap-4 mx-auto px-6 md:px-10"
        style={{ maxWidth: 1280, minHeight: 48, paddingTop: 10, paddingBottom: 10 }}
      >
        <div className="flex items-center gap-3">
          {isUrgentTrial ? (
            <Zap size={15} style={{ color: iconColor, flexShrink: 0 }} />
          ) : (
            <AlertTriangle size={15} style={{ color: iconColor, flexShrink: 0 }} />
          )}
          <div>
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: textColor,
                marginRight: 8,
              }}
            >
              {headline}
            </span>
            <span
              style={{
                fontSize: '0.8125rem',
                color: subColor,
                fontWeight: 420,
              }}
            >
              {sub}
            </span>
            {isTrialEndedNotExtended && (
              <>
                {' '}
                <a
                  href="#extend-trial"
                  style={{
                    fontSize: '0.8125rem',
                    color: subColor,
                    fontWeight: 600,
                    textDecoration: 'underline',
                    textUnderlineOffset: 2,
                  }}
                >
                  Request an extension
                </a>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={() => navigate('/v3/plans')}
            className="rounded-md border-none cursor-pointer whitespace-nowrap"
            style={{
              background: btnBg,
              color: '#fff',
              padding: '6px 16px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              fontFamily: 'inherit',
            }}
          >
            Upgrade now
          </button>
          {isDismissable && (
            <button
              onClick={() => setDismissed(true)}
              className="flex items-center justify-center rounded border-none bg-transparent cursor-pointer"
              style={{ color: subColor, padding: 4 }}
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
