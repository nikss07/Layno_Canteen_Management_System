// ============================================================
// ============================================================
// FILE: src/components/LandingPage.jsx
// PURPOSE: Public food landing page — hero, nav, CTA
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Facebook, Instagram } from 'lucide-react';

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
  </svg>
);
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);
const IconTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconMenu = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="22" height="22">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const GridPattern = () => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.35, pointerEvents:'none' }}>
    <defs>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c8a882" strokeWidth="0.6"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)"/>
  </svg>
);

const OrangeSlice = ({ style }) => (
  <svg viewBox="0 0 60 60" width="52" height="52" style={{ ...style, position:'absolute', opacity:0.9 }}>
    <circle cx="30" cy="30" r="28" fill="#f97316" opacity="0.15" stroke="#f97316" strokeWidth="2"/>
    <circle cx="30" cy="30" r="20" fill="none" stroke="#f97316" strokeWidth="1.5"/>
    <line x1="30" y1="2" x2="30" y2="58" stroke="#f97316" strokeWidth="1.5"/>
    <line x1="2" y1="30" x2="58" y2="30" stroke="#f97316" strokeWidth="1.5"/>
    <line x1="8" y1="10" x2="52" y2="50" stroke="#f97316" strokeWidth="1.5"/>
    <line x1="52" y1="10" x2="8" y2="50" stroke="#f97316" strokeWidth="1.5"/>
    <circle cx="30" cy="30" r="5" fill="#f97316" opacity="0.4"/>
  </svg>
);

const ConcentricCircles = ({ style }) => (
  <svg viewBox="0 0 100 100" width="90" height="90" style={{ ...style, position:'absolute', opacity:0.55 }}>
    {[48,38,28,18,8].map((r,i) => (
      <circle key={i} cx="50" cy="50" r={r} fill="none" stroke="#f97316" strokeWidth="2"/>
    ))}
  </svg>
);

const Dash = ({ style, angle = 0 }) => (
  <div style={{
    position:'absolute', width:28, height:4, borderRadius:2,
    background:'#f97316', transform:`rotate(${angle}deg)`, opacity:0.7, ...style
  }}/>
);

const Dot = ({ style }) => (
  <div style={{ position:'absolute', width:8, height:8, borderRadius:'50%', background:'#2d2d2d', ...style }}/>
);

export default function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]     = useState(false);
  const [search, setSearch]         = useState('');
  const [visible, setVisible]       = useState(false);
  const [galleryItems, setGalleryItems] = useState([]);
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);

    fetch('http://localhost:8000/api/menu-items', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const items = (data.data || data).filter(i => i.image);
        setGalleryItems(items);
      })
      .catch(() => {});

    return () => clearTimeout(timer);
  }, []);

  const navLinks = ['Home','Gallery','Location','Contacts','About'];

  const S = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(rgba(253, 244, 237, 0.95), rgba(253, 244, 237, 0.95))',
      fontFamily: "'Inter', -apple-system, sans-serif",
      overflowX: 'hidden',
      color: '#2d2d2d',
    },
    nav: {
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 40px', position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(253,244,237,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(249,115,22,0.1)',
    },
    navLeft: { display:'flex', alignItems:'center', gap:10 },
    hamburger: {
      background:'none', border:'none', cursor:'pointer', color:'#2d2d2d',
      padding:6, borderRadius:8, display:'flex', alignItems:'center',
    },
    navLinks: {
      display:'flex', alignItems:'center', gap:32, listStyle:'none', margin:0, padding:0,
    },
    navLink: {
      fontWeight:600, fontSize:15, color:'#2d2d2d', textDecoration:'none',
      cursor:'pointer', transition:'color 0.2s', padding:'4px 0', borderBottom:'2px solid transparent',
    },
    navLinkActive: { color:'#f97316', borderBottom:'2px solid #f97316' },
    searchBox: {
      display:'flex', alignItems:'center', gap:8,
      background:'#f97316', borderRadius:50, padding:'8px 16px', color:'#fff', cursor:'text',
    },
    searchInput: {
      background:'none', border:'none', outline:'none', color:'#fff', fontSize:14, fontWeight:500, width:90,
    },
    hero: {
      position:'relative', minHeight:'calc(100vh - 65px)',
      display:'flex', alignItems:'center', padding:'0 40px', overflow:'hidden',
    },
    left: {
      flex:'0 0 45%', maxWidth:480, zIndex:10, position:'relative',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-40px)',
      transition: 'opacity 0.7s ease, transform 0.7s ease',
    },
    headingScript: {
      fontFamily:"'Georgia', 'Times New Roman', serif",
      fontSize:'clamp(52px, 7vw, 88px)', fontWeight:700,
      lineHeight:1, color:'#2d2d2d', margin:0, fontStyle:'italic', letterSpacing:'-2px',
    },
    headingBold: {
      fontFamily:"'Inter', sans-serif",
      fontSize:'clamp(60px, 8vw, 100px)', fontWeight:900,
      lineHeight:0.9, color:'#2d2d2d', margin:'0 0 20px', letterSpacing:'-3px', display:'block',
    },
    description: {
      fontSize:20, lineHeight:1.7, color:'#6b6b6b', fontWeight:500, maxWidth:380, marginBottom:22,
    },
    btnOrder: {
      display:'inline-flex', alignItems:'center', gap:8,
      background:'#f97316', color:'#fff', border:'none', cursor:'pointer',
      padding:'14px 32px', borderRadius:50, fontSize:15, fontWeight:800,
      letterSpacing:0.5, textTransform:'uppercase',
      boxShadow:'0 8px 28px rgba(249,115,22,0.4)',
      transition:'transform 0.2s, box-shadow 0.2s', marginBottom:28,
    },
    socials: { display:'flex', alignItems:'center', gap:14 },
    socialIcon: {
      width:36, height:36, borderRadius:'50%', display:'flex',
      alignItems:'center', justifyContent:'center',
      background:'rgba(249,115,22,0.1)', color:'#f97316',
      cursor:'pointer', transition:'all 0.2s', border:'1.5px solid rgba(249,115,22,0.2)',
    },
    right: {
      flex:'0 0 55%', display:'flex', alignItems:'center',
      justifyContent:'center', position:'relative', zIndex:10,
      opacity: visible ? 1 : 0,
      transform: visible ? 'scale(1)' : 'scale(0.9)',
      transition: 'opacity 0.8s ease 0.15s, transform 0.8s ease 0.15s',
    },
    imageRing: {
      width:'clamp(340px, 42vw, 560px)', height:'clamp(340px, 42vw, 560px)',
      borderRadius:'50%', overflow:'hidden', position:'relative',
      border:'6px solid #f97316',
      boxShadow:'0 0 0 12px rgba(249,115,22,0.12), 0 24px 80px rgba(249,115,22,0.3)',
    },
    foodImg: { width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.6s ease' },
    offerBadge: {
      position:'absolute', bottom:'12%', left:'-4%',
      width:110, height:110, borderRadius:'50%',
      background:'linear-gradient(135deg, #f97316, #ea580c)',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      color:'#fff', boxShadow:'0 8px 32px rgba(249,115,22,0.6)',
      zIndex:20, cursor:'default', userSelect:'none',
      animation: 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) both', animationDelay:'0.6s',
    },
    offerSmall: { fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1 },
    offerBig:   { fontSize:28, fontWeight:900, lineHeight:1 },
    offerOff:   { fontSize:13, fontWeight:800, textTransform:'uppercase' },
    blobTopLeft: {
      position:'absolute', top:-20, left:-20, width:190, height:190,
      borderRadius:'50% 70% 60% 40% / 60% 40% 70% 50%',
      background:'linear-gradient(135deg, #f97316, #fb923c)', opacity:0.9, zIndex:1,
    },
    blobBottomLeft: {
      position:'absolute', bottom:20, left:60, width:160, height:120,
      borderRadius:'70% 30% 50% 60% / 40% 60% 50% 70%',
      background:'linear-gradient(135deg, #f97316, #fb923c)', opacity:0.9, zIndex:5,
    },
    checker: {
      position:'absolute', top:20, left:20,
      display:'grid', gridTemplateColumns:'repeat(5, 10px)',
      gap:4, zIndex:3, opacity:0.6,
    },
  };

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin:0; }
        .nav-link:hover { color: #f97316 !important; }
        .btn-order:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 14px 36px rgba(249,115,22,0.55) !important; }
        .social-icon:hover { background: #f97316 !important; color: #fff !important; transform: translateY(-3px) scale(1.1); }
        .food-img-ring:hover img { transform: scale(1.06); }
        .search-input::placeholder { color: rgba(255,255,255,0.75); }
        @keyframes badgePop {
          from { opacity:0; transform:scale(0.4) rotate(-20deg); }
          to   { opacity:1; transform:scale(1) rotate(0deg); }
        }
        @keyframes floatY {
          0%,100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        .float-anim { animation: floatY 4s ease-in-out infinite; }
        .gallery-item { transition: transform 0.3s; }
        .gallery-item:hover { transform: scale(1.04); }
        .contact-card { transition: transform 0.2s; }
        .contact-card:hover { transform: translateY(-4px); }
        .mobile-menu {
          position: fixed; top:65px; left:0; right:0;
          background: #fff; border-bottom: 2px solid #f97316;
          z-index: 99; padding: 20px 30px;
          display: flex; flex-direction: column; gap: 16px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
        }
        .mobile-menu a { font-size:17px; font-weight:700; color:#2d2d2d; text-decoration:none; padding:8px 0; border-bottom: 1px solid #f5e6da; }
        .mobile-menu a:hover { color:#f97316; }
        @media (max-width: 900px) {
          .desktop-nav { display:none !important; }
          .desktop-search { display:none !important; }
          .hero-grid { flex-direction: column !important; padding: 30px 24px !important; }
          .hero-left { flex: unset !important; max-width:100% !important; }
          .hero-right { flex: unset !important; margin-top:30px; }
          .image-ring { width:280px !important; height:280px !important; }
          .offer-badge { width:86px !important; height:86px !important; left:-5% !important; }
          .offer-big { font-size:20px !important; }
        }
      `}</style>

      {/* ════ NAVBAR ════ */}
      <nav style={S.nav}>
        <div style={S.navLeft}>
          <button style={S.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
            <IconMenu />
          </button>
        </div>
        <ul style={S.navLinks} className="desktop-nav">
          {navLinks.map((link, i) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className="nav-link"
                style={{ ...S.navLink, ...(i === 0 ? S.navLinkActive : {}) }}>
                {link}
              </a>
            </li>
          ))}
        </ul>
        <div style={{ display:'flex', alignItems:'center', gap:10 }} className="desktop-search">
          <div style={S.searchBox}>
            <input style={S.searchInput} className="search-input" placeholder="Search..."
              value={search} onChange={(e) => setSearch(e.target.value)} />
            <IconSearch />
          </div>
          <button onClick={() => navigate('/login')}
            style={{ background:'none', border:'2px solid #f97316', color:'#f97316', borderRadius:50,
              padding:'8px 22px', fontWeight:800, fontSize:14, cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={(e) => { e.target.style.background='#f97316'; e.target.style.color='#fff'; }}
            onMouseLeave={(e) => { e.target.style.background='none'; e.target.style.color='#f97316'; }}>
            Sign In
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{link}</a>
          ))}
        </div>
      )}

      {/* ════ HERO ════ */}
      <section id="home" ref={heroRef} style={S.hero} className="hero-grid">
        <GridPattern />
        <div style={S.blobTopLeft} />
        <div style={S.checker}>
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} style={{ width:10, height:10, background: i % 2 === 0 ? 'rgba(255,255,255,0.5)' : 'transparent' }} />
          ))}
        </div>
        <div style={S.blobBottomLeft} />
        <OrangeSlice style={{ top:'18%', left:'36%' }} />
        <OrangeSlice style={{ bottom:'22%', left:'38%', width:38, height:38 }} />
        <OrangeSlice style={{ top:'12%', right:'4%', width:44, height:44 }} />
        <ConcentricCircles style={{ top:'20%', right:'8%' }} />
        <ConcentricCircles style={{ bottom:'10%', left:'28%', width:64, height:64 }} />
        <Dash style={{ top:'60%', left:'44%' }} angle={-45} />
        <Dash style={{ bottom:'30%', left:'55%', width:20 }} angle={45} />
        <Dash style={{ top:'30%', left:'55%', width:16 }} angle={-30} />
        <Dot style={{ top:'35%', left:'22%' }} />
        <Dot style={{ bottom:'40%', right:'10%', width:5, height:5 }} />
        <Dot style={{ top:'65%', right:'25%', background:'#f97316' }} />

        <div style={S.left} className="hero-left">
          <h1 style={S.headingScript}>JKM</h1>
          <span style={S.headingBold}>CANTEEN</span>
          <p style={S.description}>Serving Happiness in Every Meal.</p>
          <button style={S.btnOrder} className="btn-order" onClick={() => navigate('/login')}>
            Order Now →
          </button>
          <div style={S.socials}>
            {[<IconFacebook />, <IconInstagram />, <IconTwitter />].map((Icon, i) => (
              <div key={i} style={S.socialIcon} className="social-icon">{Icon}</div>
            ))}
          </div>
        </div>

        <div style={S.right} className="hero-right">
          <div style={{ position:'relative', display:'inline-block' }}>
            <div style={S.imageRing} className="food-img-ring image-ring float-anim">
              <img src="/Filipino favorites.jpg" alt="JKM Canteen Special Spread" style={S.foodImg} className="food-img" />
            </div>
            <div style={S.offerBadge} className="offer-badge">
              <span style={S.offerSmall}>Special Offer</span>
              <span style={S.offerBig} className="offer-big">50%</span>
              <span style={S.offerOff}>OFF</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════ GALLERY ════ */}
      <section id="gallery" style={{ padding:'80px 40px', background:'#fff' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:42, fontWeight:900, color:'#2d2d2d', margin:0 }}>
            Our <span style={{ color:'#f97316' }}>Gallery</span>
          </h2>
          <p style={{ color:'#6b6b6b', fontSize:16, marginTop:12 }}>A taste of what we serve every day</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px, 1fr))', gap:20, maxWidth:1100, margin:'0 auto' }}>
          {[
           "/storage/menu-images/3Kq7NGDOxv4evGLayeqMZi49hOHqq29Sg0NX5UFm.jpg",
           "/storage/menu-images/N77f6Y0dK2tK7EqGvaZx3QqojU5ITkYBmhPRmefg.jpg",
           "/storage/menu-images/lmaDInrR4TLmjTtHKNPMZGN4sCaFnOWDxcc77VNO.jpg",
           "/storage/menu-images/o5jAMbFpfC70rk7AyklDvzfczAaiFccV71npuura.jpg",
           "/storage/menu-images/1PO8Ee6SYQVgcKoK3yx2qhLOW3ecqp40iWBjoc8O.jpg",
           "/storage/menu-images/ZeYcxrXKKGeVzOHmJMaZKZWqDSyy067whwPnegFZ.jpg",
            ].map((img, i) => (
  <div key={i} className="gallery-item"
    style={{ borderRadius:16, overflow:'hidden', aspectRatio:'1', boxShadow:'0 4px 20px rgba(0,0,0,0.1)' }}>
    <img src={`http://localhost:8000${img}`} alt={`Food ${i+1}`}
      style={{ width:'100%', height:'100%', objectFit:'cover' }} />
  </div>
))}
        </div>
      </section>

      {/* ════ LOCATION ════ */}
      <section id="location" style={{ padding:'80px 40px', background:'#fdf4ed' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:42, fontWeight:900, color:'#2d2d2d', margin:0 }}>
            Our <span style={{ color:'#f97316' }}>Location</span>
          </h2>
          <p style={{ color:'#6b6b6b', fontSize:16, marginTop:12 }}>Come visit us anytime!</p>
        </div>
        <div style={{ display:'flex', gap:40, maxWidth:1100, margin:'0 auto', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ flex:'1', minWidth:280 }}>
            <div style={{ background:'#fff', borderRadius:20, padding:32,
              boxShadow:'0 4px 24px rgba(249,115,22,0.1)', border:'1px solid rgba(249,115,22,0.15)' }}>
              <h3 style={{ fontSize:22, fontWeight:800, color:'#2d2d2d', marginTop:0 }}>📍 JKM Canteen</h3>
              <p style={{ color:'#6b6b6b', lineHeight:1.8, fontSize:15 }}>
                CQGV+G9P, Visayan Village<br/>
                Tagum City, Davao del Norte<br/>
                Philippines 8100
              </p>
              <hr style={{ border:'none', borderTop:'1px solid #f5e6da', margin:'20px 0' }}/>
              <p style={{ color:'#6b6b6b', fontSize:15, lineHeight:1.8 }}>
                🕐 <strong>Mon–Sat:</strong> 6:00 AM – 8:00 PM<br/>
              </p>
            </div>
          </div>
          <div style={{ flex:'2', minWidth:300, borderRadius:20, overflow:'hidden',
            boxShadow:'0 4px 24px rgba(0,0,0,0.1)', minHeight:320 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3932.1!2d125.8474!3d7.4478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32f8f0c1e1234567%3A0xabcdef1234567890!2sVisayan%20Village%2C%20Tagum%2C%20Davao%20del%20Norte!5e0!3m2!1sen!2sph!4v1710000000000"
              width="100%" height="320" style={{ border:0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ════ CONTACTS ════ */}
      <section id="contacts" style={{ padding:'80px 40px', background:'#fff' }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <h2 style={{ fontSize:42, fontWeight:900, color:'#2d2d2d', margin:0 }}>
            Contact <span style={{ color:'#f97316' }}>Us</span>
          </h2>
          <p style={{ color:'#6b6b6b', fontSize:16, marginTop:12 }}>We'd love to hear from you!</p>
        </div>
        <div style={{ display:'flex', gap:24, maxWidth:900, margin:'0 auto', flexWrap:'wrap', justifyContent:'center' }}>
          {[
           { icon: <Phone size={36} color="#f97316" />, label:'Phone', value:'+63 912 345 6789' },
           { icon: <Mail size={36} color="#f97316" />, label:'Email', value:'jkmcanteen@gmail.com' },
           { icon: <Facebook size={36} color="#f97316" />, label:'Facebook', value:'fb.com/JKMCanteen' },
           { icon: <Instagram size={36} color="#f97316" />, label:'Instagram', value:'@jkmcanteen' },
           ].map((c, i) => (
          <div key={i} className="contact-card"
           style={{ background:'#fdf4ed', borderRadius:20, padding:'28px 32px',
            textAlign:'center', flex:'1', minWidth:180,
             border:'1px solid rgba(249,115,22,0.15)',
             boxShadow:'0 4px 20px rgba(249,115,22,0.08)',
             transition:'transform 0.2s' }}>
        <div style={{ display:'flex', justifyContent:'center', marginBottom:12 }}>{c.icon}</div>
           <p style={{ fontWeight:800, color:'#2d2d2d', margin:'0 0 4px', fontSize:14, textTransform:'uppercase', letterSpacing:1 }}>{c.label}</p>
           <p style={{ color:'#f97316', fontWeight:700, margin:0, fontSize:13, wordBreak:'break-all' }}>{c.value}</p>
       </div>
          ))}
        </div>
      </section>

      {/* ════ ABOUT ════ */}
      <section id="about" style={{ padding:'80px 40px', background:'#fdf4ed' }}>
        <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', gap:60, flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ flex:'1', minWidth:280 }}>
            <img src="/Filipino favorites.jpg" alt="About JKM Canteen"
              style={{ width:'100%', borderRadius:24, boxShadow:'0 12px 48px rgba(249,115,22,0.2)', objectFit:'cover', maxHeight:400 }} />
          </div>
          <div style={{ flex:'1', minWidth:280 }}>
            <h2 style={{ fontSize:42, fontWeight:900, color:'#2d2d2d', margin:'0 0 20px' }}>
              About <span style={{ color:'#f97316' }}>JKM Canteen</span>
            </h2>
            <p style={{ color:'#6b6b6b', fontSize:16, lineHeight:1.8, marginBottom:16 }}>
              Established in 2023, JKM Canteen has been proudly serving delicious, home-cooked Filipino meals to students, teachers, and staff. We believe that good food brings people together.
            </p>
            <p style={{ color:'#6b6b6b', fontSize:16, lineHeight:1.8, marginBottom:24 }}>
              From hearty rice meals to refreshing beverages and sweet desserts, everything we serve is made with love and the freshest ingredients. Our mission is simple — to make every meal feel like home.
            </p>
            <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
              {[['500+','Happy Customers'], ['30+','Menu Items'], ['3','Years of Service']].map(([num, label]) => (
                <div key={label} style={{ textAlign:'center' }}>
                  <p style={{ fontSize:32, fontWeight:900, color:'#f97316', margin:0 }}>{num}</p>
                  <p style={{ fontSize:13, color:'#6b6b6b', margin:0, fontWeight:600 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════ FOOTER ════ */}
      <footer style={{ background:'#2d2d2d', color:'#fff', textAlign:'center', padding:'24px 40px', fontSize:14 }}>
        <p style={{ margin:0, color:'rgba(255,255,255,0.5)' }}>© 2026 JKM Canteen Management System · Made with ❤️ in the Philippines</p>
      </footer>

    </div>
  );
}