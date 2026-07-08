import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  crumbs: Crumb[];
}

export default function PageBreadcrumb({ crumbs }: PageBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-8">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <div key={i} className="flex items-center gap-1">
            {i > 0 && (
              <ChevronRight size={16} className="text-muted-foreground" />
            )}
            {crumb.href && !isLast ? (
              <Link
                to={crumb.href}
                className="no-underline transition-colors hover:underline"
                style={{ color: '#2e7f74', fontWeight: 420 }}
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                style={{
                  color: isLast ? 'var(--foreground)' : 'var(--muted-foreground)',
                  fontWeight: isLast ? 520 : 420,
                }}
              >
                {crumb.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
