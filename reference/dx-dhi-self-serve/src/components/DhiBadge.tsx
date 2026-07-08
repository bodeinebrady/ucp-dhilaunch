const GRADIENT = 'linear-gradient(95deg, #AB00A4 0%, #7D2EFF 25%, #1D63ED 50%, #1C90ED 75%, #88D5C0 100%)';

// Unique IDs per instance to avoid SVG conflicts
let _badgeCounter = 0;

function HardenedShieldIcon({ size = 14 }: { size?: number }) {
  const id = ++_badgeCounter;
  const gradientId = `dhi-grad-${id}`;
  const maskId = `dhi-mask-${id}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={gradientId} x1="-1.52" y1="-1.26" x2="24.21" y2="3.61" gradientUnits="userSpaceOnUse">
          <stop stopColor="#AB00A4" />
          <stop offset="0.25" stopColor="#7D2EFF" />
          <stop offset="0.5" stopColor="#1D63ED" />
          <stop offset="0.75" stopColor="#1C90ED" />
          <stop offset="1" stopColor="#88D5C0" />
        </linearGradient>
        <mask
          id={maskId}
          style={{ maskType: 'alpha' } as React.CSSProperties}
          maskUnits="userSpaceOnUse"
          x="2"
          y="0"
          width="17"
          height="20"
        >
          <path
            d="M15.1368 18.0117V15.5117M15.1368 15.5117V13.0117M15.1368 15.5117H12.6368M15.1368 15.5117H17.6368M16.5579 11.1062C16.6286 10.7473 16.6668 10.3781 16.6668 9.99932V6.01399C16.6668 5.34773 16.6668 5.0146 16.5579 4.72824C16.4616 4.47527 16.3052 4.24955 16.1021 4.0706C15.8722 3.86802 15.5603 3.75105 14.9365 3.51711L10.4683 1.84155C10.2951 1.77658 10.2085 1.7441 10.1193 1.73122C10.0403 1.7198 9.96003 1.7198 9.88098 1.73122C9.79187 1.7441 9.70524 1.77658 9.532 1.84155L5.06383 3.51711C4.43999 3.75105 4.12808 3.86802 3.89821 4.0706C3.69515 4.24955 3.53872 4.47527 3.44246 4.72824C3.3335 5.0146 3.3335 5.34773 3.3335 6.01399V9.99932C3.3335 14.0897 7.79513 17.0647 9.4185 18.0117C9.603 18.1194 9.69524 18.1732 9.82543 18.2011C9.92646 18.2228 10.0739 18.2228 10.1749 18.2011C10.3051 18.1732 10.3973 18.1194 10.5818 18.0117C10.8218 17.8717 11.1238 17.6874 11.4643 17.4617M12.0977 8.08998C12.0977 8.6965 11.8403 9.2429 11.4287 9.62587C11.2797 9.76455 11.2052 9.83389 11.1773 9.88763C11.148 9.94414 11.1395 9.97752 11.1381 10.0412C11.1368 10.1017 11.1615 10.1757 11.2108 10.3237L11.8523 12.248C11.9351 12.4966 11.9766 12.6209 11.9517 12.7198C11.93 12.8064 11.8759 12.8814 11.8007 12.9294C11.7147 12.9843 11.5837 12.9843 11.3216 12.9843H8.67864C8.41663 12.9843 8.28562 12.9843 8.19963 12.9294C8.12435 12.8814 8.0703 12.8064 8.04855 12.7198C8.02371 12.6209 8.06514 12.4966 8.148 12.248L8.78946 10.3237C8.83878 10.1757 8.86345 10.1017 8.86216 10.0412C8.86082 9.97752 8.8523 9.94414 8.82299 9.88763C8.79512 9.83389 8.7206 9.76455 8.57157 9.62587C8.16002 9.2429 7.90259 8.6965 7.90259 8.08998C7.90259 6.93153 8.8417 5.99242 10.0001 5.99242C11.1586 5.99242 12.0977 6.93153 12.0977 8.08998Z"
            stroke="#677285"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <rect width="20" height="20" fill={`url(#${gradientId})`} />
      </g>
    </svg>
  );
}

interface DhiBadgeProps {
  size?: number;
  label?: string;
  fontSize?: string;
}

export function DhiBadge({ size = 14, label = 'Docker Hardened Image', fontSize = '0.75rem' }: DhiBadgeProps) {
  return (
    <div className="flex items-center gap-1">
      <HardenedShieldIcon size={size} />
      <span
        style={{
          fontSize,
          fontWeight: 600,
          lineHeight: 1,
          background: GRADIENT,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {label}
      </span>
    </div>
  );
}
