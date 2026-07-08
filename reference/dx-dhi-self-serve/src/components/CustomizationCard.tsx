import { Lock } from 'lucide-react';

interface CustomizationCardProps {
  onStartTrial: () => void;
}

const BULLETS = [
  'Add CA certificates and org trust bundles',
  'Layer in monitoring agents and sidecars',
  'Configure entrypoints and compliance modes',
  'SBOM integrity and provenance signatures maintained by Docker',
];

/**
 * Customize this image — variant A (full reveal + bottom gate)
 *
 * Used as a free-trial carrot on the DHI Free detail page for non-entitled users.
 * Shows the value (bullets) and gates the action behind "Start a free trial".
 */
export function CustomizationCard({ onStartTrial }: CustomizationCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg" style={{ padding: 24 }}>
      <h6 style={{ fontSize: '0.875rem', fontWeight: 680, margin: 0, marginBottom: 12 }}>
        Customize this image
      </h6>

      <p
        className="text-sm text-muted-foreground"
        style={{ lineHeight: 1.6, margin: 0, marginBottom: 16 }}
      >
        Modify this image for your org without breaking the security chain.
      </p>

      <ul
        className="flex flex-col"
        style={{ gap: 8, margin: 0, marginBottom: 20, padding: 0, listStyle: 'none' }}
      >
        {BULLETS.map((item) => (
          <li
            key={item}
            className="flex items-start text-sm text-muted-foreground"
            style={{ gap: 8, lineHeight: 1.5 }}
          >
            <span
              className="rounded-full flex items-center justify-center"
              style={{
                marginTop: 5,
                width: 14,
                height: 14,
                flexShrink: 0,
                backgroundColor: 'rgba(29,99,237,0.1)',
              }}
            >
              <span
                className="block rounded-full"
                style={{
                  width: 5,
                  height: 5,
                  backgroundColor: '#1d63ed',
                }}
              />
            </span>
            {item}
          </li>
        ))}
      </ul>

      <div
        style={{
          paddingTop: 16,
          borderTop: '1px solid rgba(29,99,237,0.13)',
        }}
      >
        <div className="flex items-center" style={{ gap: 8, marginBottom: 4 }}>
          <Lock size={14} style={{ color: '#1d63ed', flexShrink: 0 }} />
          <button
            type="button"
            onClick={onStartTrial}
            className="bg-transparent border-0 cursor-pointer hover:underline"
            style={{
              padding: 0,
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1d63ed',
              fontFamily: 'inherit',
              textAlign: 'left',
            }}
          >
            Start a free trial to customize this image
          </button>
        </div>
        <p
          className="text-xs text-muted-foreground"
          style={{ margin: 0, paddingLeft: 22 }}
        >
          No credit card required.
        </p>
      </div>
    </div>
  );
}
