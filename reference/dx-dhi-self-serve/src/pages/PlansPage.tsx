import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useApp } from '../context/AppContext';

const CHECK = (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
    <path d="M3 8l3.5 3.5L13 4.5" stroke="#1d63ed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function Feature({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <div className="flex items-start gap-2.5" style={{ marginBottom: 10 }}>
      {CHECK}
      <span style={{ fontSize: '0.875rem', color: muted ? '#6b7280' : '#374151', lineHeight: 1.5 }}>{children}</span>
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: '#e5e7eb', margin: '16px 0' }} />;
}

function PlanCard({
  eyebrow,
  title,
  price,
  priceLabel,
  description,
  features,
  everythingIn,
  cta,
  ctaHref,
  primary,
  badge,
  ctaDisabled,
}: {
  eyebrow: string;
  title: string;
  price?: string;
  priceLabel?: string;
  description: string;
  features: string[];
  everythingIn?: string;
  cta: string;
  ctaHref?: string;
  primary?: boolean;
  badge?: string;
  ctaDisabled?: boolean;
}) {
  return (
    <div style={{
      border: primary ? '2px solid #1d63ed' : '1px solid #e5e7eb',
      borderRadius: 12,
      padding: '24px 24px 20px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      flex: 1,
      background: '#fff',
    }}>
      {badge && (
        <div style={{
          position: 'absolute',
          top: -13,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1d63ed',
          color: '#fff',
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: '3px 12px',
          borderRadius: 20,
          whiteSpace: 'nowrap',
        }}>
          {badge}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <p style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: primary ? '#1d63ed' : '#6b7280',
          margin: '0 0 4px',
        }}>
          {eyebrow}
        </p>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: '0 0 6px', lineHeight: 1.2 }}>
          {title}
        </h2>
        {price && (
          <div style={{ marginBottom: 6 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827' }}>{price}</span>
            {priceLabel && <span style={{ fontSize: '0.8125rem', color: '#6b7280', marginLeft: 4 }}>{priceLabel}</span>}
          </div>
        )}
        <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0, lineHeight: 1.5 }}>
          {description}
        </p>
      </div>

      <Divider />

      {/* Features */}
      <div style={{ flex: 1, marginBottom: 20 }}>
        {everythingIn && (
          <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151', margin: '0 0 10px' }}>
            Everything in {everythingIn}, plus:
          </p>
        )}
        {features.map(f => <Feature key={f}>{f}</Feature>)}
      </div>

      {/* CTA */}
      <a
        href={ctaDisabled ? undefined : (ctaHref || '#')}
        onClick={ctaDisabled ? (e) => e.preventDefault() : undefined}
        style={{
          display: 'block',
          textAlign: 'center',
          padding: '10px 20px',
          borderRadius: 6,
          fontSize: '0.9375rem',
          fontWeight: 600,
          textDecoration: 'none',
          background: ctaDisabled ? '#f3f4f6' : (primary ? '#1d63ed' : 'transparent'),
          color: ctaDisabled ? '#9ca3af' : (primary ? '#fff' : '#1d63ed'),
          border: ctaDisabled ? '1.5px solid #e5e7eb' : (primary ? 'none' : '1.5px solid #1d63ed'),
          cursor: ctaDisabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
        }}
      >
        {cta}
      </a>
    </div>
  );
}

const MOCK_ORGS = [
  { slug: 'projectsteam', name: 'projectsteam' },
  { slug: 'acme-corp', name: 'acme-corp' },
  { slug: 'docker-internal', name: 'docker-internal' },
];

function OrgSwitcher({ selectedOrg, onSelect }: {
  selectedOrg: string | null;
  onSelect: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 8,
      padding: '12px 16px',
      marginBottom: 32,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: '#6b7280' }}>
        <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2.5 13.5c0-2.485 2.462-4.5 5.5-4.5s5.5 2.015 5.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span style={{ fontSize: '0.875rem', color: '#374151', flexShrink: 0 }}>
        Purchasing for
      </span>
      <div style={{ position: 'relative', flex: 1 }}>
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: 280,
            background: selectedOrg ? '#f9fafb' : '#fff',
            border: `1.5px solid ${selectedOrg ? '#1d63ed' : '#d1d5db'}`,
            borderRadius: 6,
            padding: '7px 10px',
            fontSize: '0.875rem',
            fontWeight: selectedOrg ? 600 : 400,
            color: selectedOrg ? '#111827' : '#9ca3af',
            cursor: 'pointer',
            fontFamily: 'inherit',
            gap: 8,
          }}
        >
          <span>{selectedOrg ?? 'Select an organization'}</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
            <path d="M2 4l4 4 4-4" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {open && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            minWidth: 280,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
            zIndex: 10,
            overflow: 'hidden',
          }}>
            {MOCK_ORGS.map(org => (
              <button
                key={org.slug}
                onClick={() => { onSelect(org.slug); setOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  background: selectedOrg === org.slug ? '#eff6ff' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: selectedOrg === org.slug ? 600 : 400,
                  color: '#111827',
                  fontFamily: 'inherit',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  background: '#1d63ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#fff' }}>
                    {org.name[0].toUpperCase()}
                  </span>
                </div>
                {org.name}
                {selectedOrg === org.slug && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ marginLeft: 'auto' }}>
                    <path d="M3 8l3.5 3.5L13 4.5" stroke="#1d63ed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      {!selectedOrg && (
        <span style={{ fontSize: '0.8125rem', color: '#f59e0b', fontWeight: 500, flexShrink: 0 }}>
          Required to purchase
        </span>
      )}
    </div>
  );
}

export default function PlansPage() {
  const navigate = useNavigate();
  const { authState } = useApp();
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null);

  const isPersonal = authState === 'personal';
  const ctasEnabled = !isPersonal || selectedOrg !== null;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Manrope Variable, Manrope, sans-serif' }}>
      <Navbar />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '56px 40px 80px' }}>
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            fontSize: '0.875rem',
            fontFamily: 'inherit',
            padding: 0,
            marginBottom: 40,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111827', margin: '0 0 12px', lineHeight: 1.2 }}>
            Docker Hardened Images
          </h1>
          <p style={{ fontSize: '1rem', color: '#6b7280', margin: 0, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Minimal, hardened base images you can drop into any build. Choose the plan that fits where you are.
          </p>
        </div>

        {/* Org switcher — only shown for personal-namespace users */}
        {isPersonal && (
          <OrgSwitcher selectedOrg={selectedOrg} onSelect={setSelectedOrg} />
        )}

        {/* Cards */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'stretch' }}>

          {/* Free */}
          <PlanCard
            eyebrow="DHI"
            title="Free"
            description="Apache 2.0 licensed. Pull hardened images directly from dhi.io at no cost."
            features={[
              'All image repositories',
              'DHI compatible Helm charts',
              'All actively supported hardened image versions',
              'Alpine & Debian distributions',
              'Signed SBOMs & SLSA Build Level 3 provenance',
              'CIS compliance',
            ]}
            cta="Browse the free catalog"
            ctaHref="/v2"
          />

          {/* Free Trial */}
          <PlanCard
            eyebrow="DHI Select"
            title="Free Trial"
            description="Try Select features free for 14 days. No credit card required."
            everythingIn="DHI Free"
            features={[
              'Mirror images to your org registry',
              'Up to 5 image customizations',
              'Critical CVE fixes within 7 days, SLA-backed',
              'FIPS and STIG-compliant variants',
              'Docker Scout vulnerability scanning',
              'Audit logs for compliance',
            ]}
            cta="Start free trial"
            ctaHref="#"
            ctaDisabled={!ctasEnabled}
          />

          {/* Select */}
          <PlanCard
            eyebrow="DHI Select"
            title="Select"
            price="$5,000"
            priceLabel="per repo / year"
            description="Production-ready security with compliance support."
            everythingIn="DHI Free"
            features={[
              'Verifiable SBOMs and SLSA Build L3 provenance',
              'FIPS and STIG-compliant variants',
              'Critical CVE fixes within 7 days, SLA-backed',
              'Up to 5 image customizations',
              'Docker Scout vulnerability scanning',
              'Audit logs for compliance',
            ]}
            cta="Get started"
            ctaHref="#"
            ctaDisabled={!ctasEnabled}
          />

          {/* Enterprise */}
          <PlanCard
            eyebrow="DHI Enterprise"
            title="Enterprise"
            price="Custom"
            priceLabel="Talk to us for pricing"
            description="Advanced security with unlimited customization."
            everythingIn="Select"
            features={[
              'Unlimited image customizations',
              'Access to Docker Hardened System Packages repo',
              'Full catalog of hardened images',
              'Dedicated security review and SLAs',
              'Extended Lifecycle Support available',
            ]}
            cta="Contact sales"
            ctaHref="#"
            primary
            badge="Recommended"
            ctaDisabled={!ctasEnabled}
          />

        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#9ca3af', marginTop: 32 }}>
          Already have a plan?{' '}
          <a href="#" style={{ color: '#1d63ed', textDecoration: 'none', fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
