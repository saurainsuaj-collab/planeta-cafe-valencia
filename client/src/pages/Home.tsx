import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  Coffee,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Quote,
  Star,
  X,
} from "lucide-react";

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Carrer+de+Trafalgar+38%2C+Valencia";
const phoneUrl = "tel:+34622085301";

const heroImage =
  "/manus-storage/planeta-cafe-hero_cbf66634.jpg";
const detailImage =
  "/manus-storage/planeta-cafe-detail_3d93bcc8.jpg";

const reviews = [
  {
    quote:
      "El mejor café de la zona sin duda. Si sabes que un flat white no es simplemente un café con leche más pequeño, este es tu sitio. Trato inmejorable y calidad constante.",
    name: "Cliente habitual",
  },
  {
    quote:
      "Un clásico de Valencia que nunca falla. Llevo años viniendo y la atención y los desayunos siguen siendo de 10. Te hacen sentir como en casa desde el primer día.",
    name: "María G.",
  },
];

function Wordmark() {
  return (
    <a href="#inicio" className="wordmark" aria-label="Planeta Café, inicio">
      <span className="wordmark-orbit" aria-hidden="true">
        <span />
      </span>
      <span>
        <strong>Planeta</strong>
        <em>Café</em>
      </span>
    </a>
  );
}

function StarRow({ small = false }: { small?: boolean }) {
  return (
    <span className={small ? "star-row star-row-small" : "star-row"} aria-label="5 de 5 estrellas">
      {[0, 1, 2, 3, 4].map((star) => (
        <Star key={star} fill="currentColor" strokeWidth={1.5} />
      ))}
    </span>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="section-eyebrow">{children}</p>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell" id="inicio">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <Wordmark />
          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
            <a href="#carta" onClick={closeMenu}>Carta</a>
            <a href="#esencia" onClick={closeMenu}>Nuestra esencia</a>
            <a href="#ubicacion" onClick={closeMenu}>Dónde estamos</a>
            <a className="nav-phone" href={phoneUrl} onClick={closeMenu}>
              <Phone size={15} strokeWidth={2.2} />
              <span>+34 622 08 53 01</span>
            </a>
          </nav>
          <a href={mapsUrl} target="_blank" rel="noreferrer" className="button button-dark header-cta">
            Cómo llegar <ArrowUpRight size={16} />
          </a>
          <button
            className="menu-toggle"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-image" style={{ backgroundImage: `url(${heroImage})` }} aria-hidden="true" />
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-content container">
            <div className="hero-copy">
              <p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Specialty coffee · Valencia</p>
              <h1 id="hero-title">Mucho más que un café: <i>tu nuevo rincón favorito.</i></h1>
              <p className="hero-subtitle">
                20 años tostando momentos, sirviendo desayunos inolvidables y cuidando cada <em>flat white</em> en el corazón de Valencia.
              </p>
              <div className="hero-actions">
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="button button-accent">
                  Ven a vernos <ArrowUpRight size={17} />
                </a>
                <a href="#carta" className="text-link text-link-light">
                  Descubre la carta <ArrowDownRight size={16} />
                </a>
              </div>
              <div className="hero-proof">
                <div className="proof-avatar" aria-hidden="true">P</div>
                <div>
                  <div className="proof-line"><StarRow small /> <strong>4.9</strong> <span>en Google</span></div>
                  <p>Más de 200 personas han dejado su huella</p>
                </div>
              </div>
            </div>
            <div className="hero-note" aria-hidden="true">
              <span>Hecho para parar</span>
              <span className="hero-note-line" />
              <span>y disfrutar</span>
            </div>
          </div>
          <a href="#resenas" className="scroll-cue" aria-label="Ver reseñas">
            <span>Scroll to savor</span><ChevronDown size={17} />
          </a>
        </section>

        <section className="review-strip" id="resenas" aria-label="Valoración de clientes">
          <div className="container review-strip-inner">
            <div className="review-score">
              <span className="review-score-number">4.9</span>
              <div><StarRow /><span className="review-score-label">Valoración media en Google</span></div>
            </div>
            <div className="review-divider" />
            <p className="review-pullquote">“Un clásico de Valencia que nunca falla.”</p>
            <a className="text-link" href="#opiniones">Leer las opiniones <ArrowUpRight size={16} /></a>
          </div>
        </section>

        <section className="story-section section-pad" id="esencia">
          <div className="container story-grid">
            <div className="story-stamp" aria-hidden="true">
              <span>Desde</span>
              <strong>2004</strong>
              <span>Camins al Grau · VLC</span>
            </div>
            <div className="story-intro">
              <SectionEyebrow>01 — Nuestra esencia</SectionEyebrow>
              <h2>Hay pausas que <i>saben</i> quedarse.</h2>
            </div>
            <div className="story-body">
              <p className="lead-copy">Abrimos nuestras puertas con una premisa clara: ofrecer un café excepcional y un espacio donde pararse a disfrutar del momento de verdad.</p>
              <p>Dos décadas después, seguimos manteniendo intacta esa ilusión en nuestra casa de la calle Trafalgar. Seleccionamos el mejor grano, cuidamos cada detalle y ponemos algo de nosotros en cada taza.</p>
              <a href="#ubicacion" className="text-link">Conoce nuestro rincón <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </section>

        <section className="values-section section-pad-small">
          <div className="container values-grid">
            <div className="value-item"><span className="value-index">01</span><Coffee size={22} /><div><h3>Cultura cafetera real</h3><p>Maestría en cada extracción y amor por el buen café.</p></div></div>
            <div className="value-item"><span className="value-index">02</span><span className="value-mark">✳</span><div><h3>Ambiente acogedor</h3><p>Tu punto de encuentro para trabajar, desconectar o charlar.</p></div></div>
            <div className="value-item"><span className="value-index">03</span><span className="value-mark value-sun">◌</span><div><h3>Raíces en Valencia</h3><p>Un negocio de toda la vida, con la mirada puesta en hoy.</p></div></div>
          </div>
        </section>

        <section className="menu-section section-pad" id="carta">
          <div className="container">
            <div className="menu-heading">
              <div><SectionEyebrow>02 — La carta</SectionEyebrow><h2>Para amantes del buen<br /><i>comer y beber.</i></h2></div>
              <p>Lo sencillo, cuando se hace con cariño, se convierte en algo extraordinario.</p>
            </div>
            <div className="menu-cards">
              <article className="menu-card menu-card-featured">
                <div className="menu-card-image" style={{ backgroundImage: `url(${detailImage})` }} />
                <div className="menu-card-content"><span className="card-number">01</span><h3>Café de<br /><i>especialidad</i></h3><p>Desde un espresso impecable hasta nuestro característico flat white.</p><span className="card-arrow"><ArrowUpRight size={19} /></span></div>
              </article>
              <article className="menu-card menu-card-cream"><span className="card-number">02</span><div className="card-icon coffee-icon"><Coffee size={31} /></div><h3>Desayunos<br /><i>que motivan</i></h3><p>Tostadas cuidadas, opciones variadas y producto fresco cada mañana.</p><span className="card-arrow"><ArrowUpRight size={19} /></span></article>
              <article className="menu-card menu-card-sage"><span className="card-number">03</span><div className="card-icon sun-icon">◌</div><h3>Tu espacio,<br /><i>tu momento</i></h3><p>Un local cómodo y luminoso, con un equipo joven listo para recibirte.</p><span className="card-arrow"><ArrowUpRight size={19} /></span></article>
            </div>
          </div>
        </section>

        <section className="opinions-section section-pad" id="opiniones">
          <div className="container opinions-layout">
            <div className="opinions-heading"><SectionEyebrow>03 — Lo que dicen</SectionEyebrow><h2>Palabras que<br /><i>nos alegran</i> el día.</h2><p>La mejor parte de estos 20 años siempre ha sido compartirlos contigo.</p></div>
            <div className="quotes-grid">
              {reviews.map((review, index) => <article className="quote-card" key={review.name}><Quote className="quote-mark" size={29} fill="currentColor" /><blockquote>“{review.quote}”</blockquote><div className="quote-meta"><StarRow small /><span>— {review.name}</span></div><span className="quote-index">0{index + 1}</span></article>)}
            </div>
          </div>
        </section>

        <section className="location-section section-pad" id="ubicacion">
          <div className="container location-grid">
            <div className="location-copy"><SectionEyebrow>04 — Ven a visitarnos</SectionEyebrow><h2>Nos encuentras<br /><i>en tu camino.</i></h2><p>Carrer de Trafalgar, 38<br />Camins al Grau, 46023 València</p><a href={mapsUrl} target="_blank" rel="noreferrer" className="button button-dark">Abrir en Google Maps <ArrowUpRight size={17} /></a></div>
            <div className="location-card"><div className="map-pattern" aria-hidden="true"><span className="map-road road-one" /><span className="map-road road-two" /><span className="map-road road-three" /><span className="map-block block-one" /><span className="map-block block-two" /><span className="map-block block-three" /><span className="map-block block-four" /><span className="map-pin"><MapPin size={24} fill="currentColor" /></span></div><div className="location-card-bottom"><div><span className="location-label">Hoy, abierto hasta</span><strong>20:45 <span>·</span> Ven con calma</strong></div><a href={phoneUrl} aria-label="Llamar a Planeta Café"><Phone size={18} /></a></div></div>
          </div>
        </section>

        <section className="hours-section">
          <div className="container hours-inner"><div className="hours-title"><Clock3 size={22} /><span>Horarios</span></div><div className="hours-list"><div><span>Lun — Vie</span><strong>7:30 — 20:45</strong></div><div><span>Sábado</span><strong>8:00 — 20:00</strong></div><div><span>Domingo</span><strong>9:00 — 14:00</strong></div></div><a href={phoneUrl} className="phone-link"><Phone size={16} /> +34 622 08 53 01</a></div>
        </section>

        <section className="final-cta"><div className="container final-cta-inner"><div><p className="eyebrow eyebrow-light"><span className="eyebrow-dot" /> Te esperamos</p><h2>Tu próxima pausa<br /><i>empieza aquí.</i></h2></div><a href={mapsUrl} target="_blank" rel="noreferrer" className="button button-accent button-large">Cómo llegar <ArrowUpRight size={19} /></a></div></section>
      </main>

      <footer className="site-footer"><div className="container footer-grid"><div><Wordmark /><p className="footer-note">Café de especialidad,<br />desayunos y buenos momentos.</p></div><div className="footer-column"><span className="footer-label">Visítanos</span><a href={mapsUrl} target="_blank" rel="noreferrer">Carrer de Trafalgar, 38</a><a href={mapsUrl} target="_blank" rel="noreferrer">Camins al Grau, València</a></div><div className="footer-column"><span className="footer-label">Hablemos</span><a href={phoneUrl}>+34 622 08 53 01</a><a href="mailto:hola@planetacafe.es">hola@planetacafe.es</a></div><div className="footer-social"><a href="#inicio" aria-label="Instagram"><Instagram size={20} /></a><a href={mapsUrl} target="_blank" rel="noreferrer" aria-label="Ubicación"><MapPin size={20} /></a></div></div><div className="container footer-bottom"><span>© 2024 Planeta Café</span><span>Hecho con cariño en València</span><a href="#inicio">Volver arriba ↑</a></div></footer>

      <a className="mobile-sticky-cta" href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={17} /> Cómo llegar</a>
    </div>
  );
}
