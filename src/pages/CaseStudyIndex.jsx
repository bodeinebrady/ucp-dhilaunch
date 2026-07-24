import { Link } from 'react-router-dom'

// ─── Brand ──────────────────────────────────────────────────────────────────
// "Bold" design system, matched to sean's portfolio.

// Portfolio home — the brand ("Sean Brady") and the footer back-link point here.
const PORTFOLIO_URL = 'https://portfolio-ten-blue-75.vercel.app/docker-hardened-images/'

// Only attach an href when the URL is set, so an empty URL yields an inert link.
const portfolioLink = PORTFOLIO_URL ? { href: PORTFOLIO_URL } : {}

const T = {
  display: "'Tanker', sans-serif",
  sans: "'Cabinet Grotesk', 'Inter', system-ui, sans-serif",
  red: '#EE3F54',
  ink: '#1C1C1C',
  paper: '#fff',
  ease: 'cubic-bezier(.22,1,.36,1)',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PROTOTYPES = [
  {
    id: 'catalog',
    label: 'DHI Catalog',
    desc: 'The public catalog of Docker Hardened Images — browse, search, and filter by compliance.',
    href: '/catalog',
    external: false,
  },
  {
    id: 'mirror',
    label: 'Mirroring Flow',
    desc: "Mirror a hardened image into your org's namespace, kept patched on an SLA. Org Owner-only.",
    href: '/mirror',
    external: false,
  },
  {
    id: 'customize',
    label: 'Bulk Customizations',
    desc: 'A five-step wizard for configuring DHI images at scale — dry-run preview and env-var inheritance.',
    href: '/customize',
    external: false,
  },
]

// ─── Styles ─────────────────────────────────────────────────────────────────
// Scoped stylesheet so the case rows get real :hover behaviour (title nudge,
// full-row invert) without per-row JS handlers.

const CSS = `
.bold-root{background:${T.paper};color:${T.ink};min-height:100vh;font-family:${T.sans};font-weight:500;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.bold-root a{color:inherit;text-decoration:none}

.bold-nav{position:fixed;top:0;left:0;right:0;z-index:30;display:flex;align-items:center;justify-content:space-between;gap:24px;
  padding:20px clamp(20px,3vw,46px);background:rgba(255,255,255,.82);backdrop-filter:blur(12px) saturate(1.1);-webkit-backdrop-filter:blur(12px) saturate(1.1);
  border-bottom:2px solid ${T.ink}}
.bold-nav-left{display:flex;align-items:baseline;gap:clamp(14px,2vw,28px);min-width:0}
.bold-brand{font-family:${T.display};font-size:clamp(24px,2.2vw,32px);line-height:1;letter-spacing:-.01em;text-transform:uppercase}

.bold-wrap{max-width:1440px;margin:0 auto;padding:0 clamp(20px,3vw,46px)}

.bold-hero{padding:clamp(130px,20vh,220px) 0 clamp(48px,8vh,90px)}
.bold-eyebrow{font-family:${T.sans};font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:12px;color:${T.ink};opacity:.55;margin:0 0 clamp(20px,3vh,34px)}
.bold-title{font-family:${T.display};text-transform:uppercase;font-weight:400;line-height:.85;letter-spacing:-.02em;
  font-size:clamp(52px,9vw,150px);margin:0;color:${T.ink}}
.bold-lead{font-family:${T.sans};font-weight:500;font-size:clamp(17px,1.5vw,22px);line-height:1.4;letter-spacing:-.01em;
  max-width:44ch;margin:clamp(28px,4vh,44px) 0 0}
.bold-lead b{font-weight:800}

.bold-section{margin-bottom:clamp(40px,7vh,80px)}

.bold-rows{display:flex;flex-direction:column}
.bold-case{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:clamp(20px,3vw,48px);align-items:center;
  padding:clamp(26px,4vh,50px) clamp(4px,1vw,16px);border-top:2px solid ${T.ink};color:${T.ink};
  transition:background .4s ${T.ease},color .4s ${T.ease}}
.bold-rows .bold-case:last-child{border-bottom:2px solid ${T.ink}}
.bold-case:hover{background:${T.ink};color:${T.red}}
.bold-ct{font-family:${T.display};text-transform:uppercase;font-weight:400;letter-spacing:-.02em;line-height:.85;
  font-size:clamp(28px,4.4vw,58px);transition:transform .4s ${T.ease}}
.bold-case:hover .bold-ct{transform:translateX(18px)}
.bold-cd{font-family:${T.sans};font-weight:500;font-size:14px;line-height:1.5;letter-spacing:-.005em;margin:0;opacity:.85}
@media(max-width:760px){
  .bold-case{grid-template-columns:1fr;gap:12px}
}

.bold-footer{border-top:2px solid ${T.ink};margin-top:clamp(60px,10vh,120px);padding:clamp(48px,8vh,90px) clamp(20px,3vw,46px);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;max-width:1440px;margin-left:auto;margin-right:auto}
.bold-footer-back{font-family:${T.display};text-transform:uppercase;font-weight:400;letter-spacing:-.02em;line-height:.85;
  font-size:clamp(28px,4.4vw,58px);color:${T.ink};display:inline-flex;align-items:center;gap:.3em;transition:transform .3s ${T.ease}}
.bold-footer-back:hover{transform:translateX(-8px)}
.bold-footer-meta{font-family:${T.sans};font-weight:700;text-transform:uppercase;letter-spacing:.08em;font-size:12px;color:${T.ink};opacity:.5}
`

// ─── Case row ───────────────────────────────────────────────────────────────

function CaseRow({ item }) {
  const Tag = item.external ? 'a' : Link
  const linkProps = item.external
    ? { href: item.href, target: '_blank', rel: 'noreferrer' }
    : { to: `${item.href}?from=portfolio` }

  return (
    <Tag {...linkProps} className="bold-case">
      <span className="bold-ct">{item.label}</span>
      <p className="bold-cd">{item.desc}</p>
    </Tag>
  )
}

function Rows({ items }) {
  return (
    <div className="bold-rows">
      {items.map(item => <CaseRow key={item.id} item={item} />)}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CaseStudyIndex() {
  return (
    <div className="bold-root">
      <style>{CSS}</style>

      {/* Fixed nav */}
      <nav className="bold-nav">
        <div className="bold-nav-left">
          <a className="bold-brand" {...portfolioLink}>Sean Brady</a>
        </div>
      </nav>

      {/* Hero */}
      <div className="bold-wrap">
        <header className="bold-hero">
          <p className="bold-eyebrow">Sean Brady · Docker Hardened Images</p>
          <h1 className="bold-title">Docker Hardened Images</h1>
          <p className="bold-lead">
            Three prototypes covering the <b>Docker Hardened Images</b> journey — from the public
            {' '}<b>catalog</b> to mirroring and bulk customization at scale.
          </p>
        </header>

        {/* Prototypes */}
        <section className="bold-section">
          <Rows items={PROTOTYPES} />
        </section>
      </div>

      {/* Footer */}
      <footer className="bold-footer">
        <a className="bold-footer-back" {...portfolioLink}>&larr; Back to portfolio</a>
        <span className="bold-footer-meta">© 2026 Sean Brady — Docker Hardened Images</span>
      </footer>
    </div>
  )
}
