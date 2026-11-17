import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUpRight,
  Heart,
  Play,
  ShoppingBag,
  Sparkles,
  Video,
} from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa6';
import ContentStudio from './components/ContentStudio.jsx';

const socialLinks = [
  { name: 'TikTok', handle: '@budolbymayels', subtitle: 'Main channel', Icon: FaTiktok, className: 'tiktok', href: 'https://www.tiktok.com/@budolbymayels' },
  { name: 'Instagram', handle: '@tauorus_', subtitle: 'Photo diaries', Icon: FaInstagram, className: 'instagram', href: 'https://www.instagram.com/tauorus_' },
  { name: 'Facebook', handle: '@mrldlmnttt', subtitle: 'Community', Icon: FaFacebookF, className: 'facebook', href: 'https://web.facebook.com/mrldlmnttt?_rdc=1&_rdr#' },
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;

    const revealSelector = [
      '.hero-copy > *',
      '.hero-art > *',
      '.quick-strip > *',
      '.about-section > *',
      '.about-grid > *',
      '.social-section > *',
      '.social-grid > *',
      '.studio-section > *',
      '.studio-intro > *',
      '.studio-panel > *',
      '.dashboard-stats > *',
      '.content-toolbar > *',
      '.filter-row > *',
      '.content-row',
      '.studio-panel-footer',
      '.contact-card > *',
      '.site-footer > *',
      'main h1',
      'main h2',
      'main h3',
      'main h4',
      'main p',
      'main a',
      'main button',
      'main img',
      'main input',
      'main select',
      'main textarea',
      '.content-modal > *',
    ].join(',');
    const site = document.querySelector('.site-shell');
    if (!site) return undefined;

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

    const observeRevealElements = (root) => {
      const elements = [];
      if (root.matches && root.matches(revealSelector)) elements.push(root);
      elements.push(...root.querySelectorAll(revealSelector));

      elements.forEach((element) => {
        if (!element.classList.contains('scroll-reveal')) {
          const siblings = Array.from(element.parentElement.children).filter((sibling) => sibling.matches(revealSelector));
          const revealIndex = Math.max(0, siblings.indexOf(element));
          element.classList.add('scroll-reveal');
          element.style.setProperty('--reveal-delay', `${Math.min(revealIndex * 75, 375)}ms`);
        }
        observer.observe(element);
      });
    };

    observeRevealElements(site);
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) observeRevealElements(node);
        });
      });
    });
    mutationObserver.observe(site, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <div className="site-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Mariel Creatives home">
          <span className="brand-mark">MC</span>
          <span className="brand-copy">Mariel <b>Creatives.</b><small>CREATE • CONNECT • INSPIRE</small></span>
        </a>

        <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          {menuOpen ? <span>×</span> : <span>☰</span>}
        </button>

        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'}>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#socials" onClick={closeMenu}>My socials</a>
          <a href="#studio" onClick={closeMenu}>Content studio</a>
          <a className="nav-cta" href="#contact" onClick={closeMenu}>Let's connect <ArrowUpRight size={15} /></a>
        </nav>
      </header>

      <main>
        <section className="hero section-wrap" id="home">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> DIGITAL CREATOR & SHOP AFFILIATE</div>
            <h1>Turning little<br /><em>moments</em> into<br />something <span>memorable.</span></h1>
            <p className="hero-description">
              Hey, I'm Mariel! I create relatable content, share finds worth loving, and build genuine connections—one post at a time.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#studio">Explore my work <ArrowUpRight size={17} /></a>
              <a className="text-link" href="#about">Get to know me <ArrowDown size={16} /></a>
            </div>
            <div className="hero-note"><span className="note-heart"><Heart size={15} fill="currentColor" /></span> Creating with purpose, posting with personality.</div>
          </div>

          <div className="hero-art" aria-label="Decorative creator-themed illustration">
            <div className="art-orbit orbit-one" />
            <div className="art-orbit orbit-two" />
            <div className="art-sticker sticker-top"><Sparkles size={18} /><span>good vibes<br />only</span></div>
            <div className="art-sticker sticker-side"><ShoppingBag size={18} /><span>daily<br />finds</span></div>
            <div className="phone-card glass-card">
              <div className="phone-notch" />
              <div className="phone-topline"><span>MY CREATOR ERA</span><span className="tiny-live"><i /> LIVE</span></div>
              <div className="phone-screen-art">
                <div className="screen-glow" />
                <div className="screen-monogram">M<span>.</span></div>
                <div className="screen-caption">A little creativity<br />goes a long way.</div>
                <div className="screen-play"><Play size={20} fill="currentColor" /></div>
              </div>
              <div className="phone-bottom"><span><Heart size={14} fill="currentColor" /> 2.8k</span><span><Video size={14} /> new post</span></div>
            </div>
            <div className="floating-pill pill-tiktok"><FaTiktok /><span>tiktok first</span></div>
            <div className="floating-pill pill-creator"><span className="creator-sparkle">✦</span><span>creator<br />mindset</span></div>
            <div className="art-caption">MADE WITH <span>♥</span> & A LITTLE MAGIC</div>
          </div>
        </section>

        <section className="quick-strip section-wrap" aria-label="Creator specialties">
          <div><span className="strip-icon"><Video size={18} /></span><span><b>Content Creator</b><small>Stories that connect</small></span></div>
          <div><span className="strip-icon"><ShoppingBag size={18} /></span><span><b>Shop Affiliate</b><small>Finds worth sharing</small></span></div>
          <div><span className="strip-icon"><Heart size={18} /></span><span><b>Online Personality</b><small>Real, warm, and relatable</small></span></div>
        </section>

        <section className="about-section section-wrap" id="about">
          <div className="section-kicker">A LITTLE INTRODUCTION</div>
          <div className="about-grid">
            <div>
              <h2>Not just content.<br /><em>A connection.</em></h2>
              <div className="about-portrait">
                <img src="/images/mariel-del-monte.jpg" alt="Mariel Del Monte" />
                <span>MEET MARIEL</span>
              </div>
            </div>
            <div className="about-copy glass-card">
              <p>Hi, I’m <strong>Mariel Del Monte</strong>, a 20-year-old creator from Infanta, Quezon Province. I love making everyday moments feel a little more special through relatable content, product finds, and lifestyle snippets.</p>
              <p>I’m currently studying at Laguna State Polytechnic University – Siniloan, Laguna. TikTok is my main creative space, where I share recommendations, experiment with ideas, and connect with my community.</p>
              <div className="signature">Let's make something lovely <span>♡</span></div>
            </div>
          </div>
        </section>

        <section className="social-section section-wrap" id="socials">
          <div className="section-heading">
            <div><div className="section-kicker">FIND ME ONLINE</div><h2>Let's be <em>social.</em></h2></div>
            <p>Different platforms, one creative corner of the internet.</p>
          </div>
          <div className="social-grid">
            {socialLinks.map(({ name, handle, subtitle, Icon, className, href }) => (
              <a className={`social-card ${className}`} href={href} target="_blank" rel="noreferrer" key={name}>
                <div className="social-icon-wrap"><Icon className="social-icon" /></div>
                <div className="social-text"><span>{subtitle}</span><b>{name}</b><small>{handle}</small></div>
                {name === 'TikTok' && <span className="main-channel">MAIN CHANNEL</span>}
                <ArrowUpRight className="social-arrow" size={18} />
              </a>
            ))}
          </div>
        </section>

        <section className="studio-section section-wrap" id="studio">
          <div className="studio-intro">
            <div className="section-kicker">BEHIND THE POSTS</div>
            <h2>My content <em>studio.</em></h2>
            <p>A little workspace for planning and keeping track of my content. Add a post, update its status, and keep your creator ideas in one place.</p>
            <div className="studio-tech"><span>REACT</span><span>PRISMA ORM</span><span>SQLITE DATABASE</span></div>
          </div>
          <ContentStudio />
        </section>

        <section className="contact-section section-wrap" id="contact">
          <div className="contact-card glass-card">
            <div className="contact-sparkle"><Sparkles size={24} /></div>
            <div className="section-kicker">HAVE A CREATIVE IDEA?</div>
            <h2>Let's create a little<br /><em>magic together.</em></h2>
            <p>Open to fun collaborations, product features, and creative projects that feel like a good fit.</p>
            <a className="button button-light" href="https://www.tiktok.com/@budolbymayels" target="_blank" rel="noreferrer">Connect on TikTok <ArrowUpRight size={17} /></a>
          </div>
        </section>
      </main>

      <footer className="site-footer section-wrap">
        <a className="brand footer-brand" href="#home"><span className="brand-mark">MC</span><span className="brand-copy">Mariel <b>Creatives.</b><small>CREATE • CONNECT • INSPIRE</small></span></a>
        <span>Made with <span className="footer-heart">♥</span> by Mariel Creatives</span>
        <a href="#home">Back to top ↑</a>
      </footer>
    </div>
  );
}

export default App;
