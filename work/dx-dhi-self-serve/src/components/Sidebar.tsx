import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterSection {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}

const FILTER_SECTIONS: FilterSection[] = [
  {
    title: 'Categories',
    defaultOpen: true,
    items: ['All', 'Databases', 'Web Servers', 'Languages', 'Messaging', 'Monitoring', 'Security', 'Storage'],
  },
  {
    title: 'Type',
    defaultOpen: true,
    items: ['Hardened Image', 'Helm Chart'],
  },
  {
    title: 'Compliance',
    defaultOpen: false,
    items: ['CIS', 'FIPS', 'STIG'],
  },
];

function SidebarSection({ section }: { section: FilterSection }) {
  const [open, setOpen] = useState(section.defaultOpen ?? false);
  const [selected, setSelected] = useState<string | null>(section.items[0] ?? null);

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full text-left border-none bg-transparent cursor-pointer px-1 py-1 mb-1"
        style={{ fontFamily: 'inherit' }}
      >
        <span className="text-sm font-semibold text-foreground">{section.title}</span>
        <ChevronDown
          size={14}
          className="text-muted-foreground transition-transform"
          style={{ transform: open ? 'rotate(0deg)' : 'rotate(-90deg)' }}
        />
      </button>

      {open && (
        <div className="flex flex-col">
          {section.items.map(item => (
            <button
              key={item}
              onClick={() => setSelected(item)}
              className="text-left border-none bg-transparent cursor-pointer px-1 transition-colors"
              style={{
                fontFamily: 'inherit',
                fontSize: '0.8125rem',
                padding: '3px 4px',
                color: selected === item ? 'var(--foreground)' : 'var(--muted-foreground)',
                fontWeight: selected === item ? 520 : 420,
              }}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="hidden md:block flex-shrink-0 border-r border-border overflow-y-auto"
      style={{
        width: 208,
        padding: '16px',
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 4rem)',
      }}
    >
      {FILTER_SECTIONS.map(section => (
        <SidebarSection key={section.title} section={section} />
      ))}
    </aside>
  );
}
