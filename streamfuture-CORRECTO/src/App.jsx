import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── TMDB ─────────────────────────────────────────────────────────────────────
const TMDB_KEY = "8265bd1679663a7ea12ac168da84d2e8";
const tmdb = async (path) => {
  const sep = path.includes("?") ? "&" : "?";
  const r = await fetch(`https://api.themoviedb.org/3${path}${sep}api_key=${TMDB_KEY}&language=es-ES`);
  return r.json();
};
const img = (p, s = "w500") => p ? `https://image.tmdb.org/t/p/${s}${p}` : null;
const imgW = (p, s = "w780") => p ? `https://image.tmdb.org/t/p/${s}${p}` : null;

// ─── CANALES TV EN VIVO ───────────────────────────────────────────────────────
const CHANNELS = [
  { id: "ecdf",      name: "ECDF",        logo: "📡", cat: "Noticias",     color: "#c0392b" },
  { id: "ecdfhd",   name: "ECDF FHD",     logo: "📡", cat: "Noticias",     color: "#c0392b" },
  { id: "nba",      name: "NBA Eventos",  logo: "🏀", cat: "Deportes",     color: "#1d428a" },
  { id: "a3s",      name: "A3S",          logo: "📺", cat: "Entretenimiento", color: "#e67e22" },
  { id: "aehd",     name: "A&E HD",       logo: "🎬", cat: "Documentales", color: "#8e44ad" },
  { id: "aefhd",    name: "A&E FHD",      logo: "🎬", cat: "Documentales", color: "#8e44ad" },
  { id: "nasa",     name: "NASA TV",      logo: "🚀", cat: "Ciencia",      color: "#2980b9" },
  { id: "dw",       name: "DW Español",   logo: "🌍", cat: "Noticias",     color: "#c0392b" },
  { id: "france24", name: "France 24",    logo: "🗼", cat: "Noticias",     color: "#003189" },
  { id: "euronews", name: "Euronews",     logo: "📰", cat: "Noticias",     color: "#0057a8" },
  { id: "trt",      name: "TRT World",    logo: "🌐", cat: "Internacional", color: "#d62828" },
  { id: "cgtn",     name: "CGTN Español", logo: "🐉", cat: "Internacional", color: "#e63946" },
  { id: "skyews",   name: "Sky News",     logo: "☁️", cat: "Noticias",     color: "#e74c3c" },
  { id: "hispantv", name: "HispanTV",     logo: "📺", cat: "Internacional", color: "#2ecc71" },
  { id: "beinspt",  name: "beIN Sports",  logo: "⚽", cat: "Deportes",     color: "#e67e22" },
  { id: "discovery",name: "Discovery",    logo: "🔭", cat: "Documentales", color: "#f39c12" },
  { id: "history",  name: "History",      logo: "🏛️", cat: "Documentales", color: "#8B6914" },
  { id: "natgeo",   name: "Nat Geo",      logo: "🌿", cat: "Documentales", color: "#f1c40f" },
  { id: "cartoon",  name: "Cartoon Net.", logo: "🎨", cat: "Kids",         color: "#3498db" },
  { id: "disney",   name: "Disney Ch.",   logo: "✨", cat: "Kids",         color: "#0063e5" },
];

const CHANNEL_STREAM_URLS = {
  nasa:     "https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8",
  dw:       "https://www.youtube.com/embed/live_stream?channel=UCW4YgJ7oNB3oBtCM0YPKBAQ",
  france24: "https://www.youtube.com/embed/l8PMl8tIbkA",
  euronews: "https://www.youtube.com/embed/live_stream?channel=UCW4YgJ7oNB3oBtCM0YPKBAQ",
  trt:      "https://www.youtube.com/embed/live_stream?channel=UC7K4OU7T4XiS-T5rBqMRKyA",
  cgtn:     "https://www.youtube.com/embed/live_stream?channel=UCYyyfxYFyFGQc4HHxjN4Y8Q",
  skyews:   "https://www.youtube.com/embed/9Auq9mYxFEE",
  hispantv: "https://www.youtube.com/embed/live_stream?channel=UCbbHV8pr-2By8afFBOVKKtA",
};

const GENRE_MAP = {
  movies: [
    { id: 28,    name: "Acción" },
    { id: 35,    name: "Comedia" },
    { id: 18,    name: "Drama" },
    { id: 27,    name: "Terror" },
    { id: 878,   name: "Ciencia Ficción" },
    { id: 10749, name: "Romance" },
    { id: 53,    name: "Thriller" },
    { id: 16,    name: "Animación" },
    { id: 99,    name: "Documental" },
    { id: 14,    name: "Fantasía" },
    { id: 80,    name: "Crimen" },
    { id: 12,    name: "Aventura" },
  ],
  series: [
    { id: 18,  name: "Drama" },
    { id: 35,  name: "Comedia" },
    { id: 10759, name: "Acción" },
    { id: 9648, name: "Misterio" },
    { id: 80,  name: "Crimen" },
    { id: 10765, name: "Sci-Fi" },
    { id: 10768, name: "Bélico" },
    { id: 10762, name: "Kids" },
    { id: 16,  name: "Animación" },
    { id: 10766, name: "Telenovela" },
  ],
};

// ─── CONSTANTES DE DISEÑO ─────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "tv",          label: "TV",          icon: "📺" },
  { id: "destacados",  label: "DESTACADOS",  icon: "👍" },
  { id: "pelicula",    label: "PELÍCULA",    icon: "🎬" },
  { id: "series",      label: "SERIES",      icon: "📽️" },
  { id: "kids",        label: "KIDS",        icon: "🧒" },
  { id: "anime",       label: "ANIME",       icon: "⚔️" },
  { id: "explorar",    label: "EXPLORAR",    icon: "🔍" },
];

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function StreamFutureAI() {
  const [section, setSection]       = useState("destacados");
  const [featuredRow, setFeaturedRow] = useState([]);
  const [contentRows, setContentRows] = useState([]);
  const [heroIdx, setHeroIdx]       = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [playingChannel, setPlayingChannel] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ]       = useState("");
  const [searchRes, setSearchRes]   = useState([]);
  const [aiMsg, setAiMsg]           = useState("");
  const [aiThinking, setAiThinking] = useState(false);
  const [favs, setFavs]             = useState(() => JSON.parse(localStorage.getItem("sf2_favs")||"[]"));
  const [movieGenre, setMovieGenre] = useState(28);
  const [seriesGenre, setSeriesGenre] = useState(18);
  const [moviePage, setMoviePage]   = useState(1);
  const [notification, setNotif]    = useState(null);
  const [channelFilter, setChannelFilter] = useState("Todos");
  const heroTimer = useRef(null);
  const searchRef = useRef(null);

  const notify = (msg, type="ok") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 2800);
  };

  const toggleFav = (item) => {
    const ex = favs.find(f => f.id === item.id);
    const next = ex ? favs.filter(f => f.id !== item.id) : [...favs, item];
    setFavs(next);
    localStorage.setItem("sf2_favs", JSON.stringify(next));
    notify(ex ? "Eliminado de Mi Lista" : "⭐ Añadido a Mi Lista");
  };
  const isFav = id => favs.some(f => f.id === id);

  // ── Cargar datos según sección ─────────────────────────────────────────────
  useEffect(() => {
    setContentRows([]);
    setFeaturedRow([]);
    setHeroIdx(0);

    if (section === "destacados") loadDestacados();
    else if (section === "pelicula") loadMovies();
    else if (section === "series") loadSeries();
    else if (section === "kids") loadKids();
    else if (section === "anime") loadAnime();
    else if (section === "explorar") loadExplorar();
    else if (section === "tv") {} // TV maneja su propio estado
  // eslint-disable-next-line
  }, [section, movieGenre, seriesGenre, moviePage]);

  // Auto-avance del hero
  useEffect(() => {
    if (featuredRow.length < 2) return;
    heroTimer.current = setInterval(() => setHeroIdx(i => (i + 1) % Math.min(featuredRow.length, 4)), 6000);
    return () => clearInterval(heroTimer.current);
  }, [featuredRow]);

  const loadDestacados = async () => {
    const [tr, top, pop] = await Promise.all([
      tmdb("/trending/all/week?"),
      tmdb("/movie/top_rated?"),
      tmdb("/tv/popular?"),
    ]);
    setFeaturedRow((tr.results||[]).slice(0,4));
    setContentRows([
      { title: "🔥 Tendencias",            items: (tr.results||[]).slice(4,12) },
      { title: "⭐ Mejor Calificadas",      items: (top.results||[]).slice(0,8) },
      { title: "📺 Series Populares",       items: (pop.results||[]).slice(0,8).map(x=>({...x,media_type:"tv"})) },
    ]);
  };

  const loadMovies = async () => {
    const [feat, page] = await Promise.all([
      tmdb("/movie/popular?"),
      tmdb(`/discover/movie?with_genres=${movieGenre}&sort_by=popularity.desc&page=${moviePage}`),
    ]);
    setFeaturedRow((feat.results||[]).slice(0,4));
    setContentRows([
      { title: "Resultados", items: page.results||[], isMain: true },
    ]);
  };

  const loadSeries = async () => {
    const [feat, page] = await Promise.all([
      tmdb("/tv/popular?"),
      tmdb(`/discover/tv?with_genres=${seriesGenre}&sort_by=popularity.desc&`),
    ]);
    setFeaturedRow((feat.results||[]).slice(0,4).map(x=>({...x,media_type:"tv"})));
    setContentRows([
      { title: "Resultados", items: (page.results||[]).map(x=>({...x,media_type:"tv"})), isMain: true },
    ]);
  };

  const loadKids = async () => {
    const [anim, fam] = await Promise.all([
      tmdb("/discover/movie?with_genres=16&certification_country=US&certification.lte=G&sort_by=popularity.desc&"),
      tmdb("/discover/tv?with_genres=10762&sort_by=popularity.desc&"),
    ]);
    setFeaturedRow((anim.results||[]).slice(0,4));
    setContentRows([
      { title: "🎨 Animación", items: (anim.results||[]).slice(0,8) },
      { title: "📺 Series Infantiles", items: (fam.results||[]).slice(0,8).map(x=>({...x,media_type:"tv"})) },
    ]);
  };

  const loadAnime = async () => {
    const [act, adv] = await Promise.all([
      tmdb("/discover/tv?with_genres=16&sort_by=popularity.desc&with_origin_country=JP&"),
      tmdb("/discover/movie?with_genres=16&sort_by=popularity.desc&with_origin_country=JP&"),
    ]);
    const all = (act.results||[]).slice(0,4).map(x=>({...x,media_type:"tv"}));
    setFeaturedRow(all);
    setContentRows([
      { title: "⚔️ Anime Series",   items: (act.results||[]).slice(0,8).map(x=>({...x,media_type:"tv"})) },
      { title: "🎌 Anime Películas", items: (adv.results||[]).slice(0,8) },
    ]);
  };

  const loadExplorar = async () => {
    const [nr, up] = await Promise.all([
      tmdb("/movie/now_playing?"),
      tmdb("/movie/upcoming?"),
    ]);
    setFeaturedRow((nr.results||[]).slice(0,4));
    setContentRows([
      { title: "🎭 En Cartelera", items: (nr.results||[]).slice(0,8) },
      { title: "📅 Próximos Estrenos", items: (up.results||[]).slice(0,8) },
    ]);
  };

  // ── Búsqueda con IA ────────────────────────────────────────────────────────
  const doSearch = useCallback(async () => {
    if (!searchQ.trim()) return;
    setAiThinking(true); setAiMsg(""); setSearchRes([]);
    try {
      const [tmdbR, aiR] = await Promise.all([
        tmdb(`/search/multi?query=${encodeURIComponent(searchQ)}&`),
        fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6", max_tokens: 1000,
            messages: [{ role: "user", content:
              `Eres el asistente de búsqueda de StreamFuture AI. El usuario busca: "${searchQ}". 
Analiza la intención y recomienda qué tipo de contenido buscar. 
Responde en 2 oraciones en español, tono futurista y directo.` }]
          })
        }).then(r=>r.json()),
      ]);
      setSearchRes((tmdbR.results||[]).slice(0,12));
      setAiMsg(aiR.content?.[0]?.text || "");
    } catch { setAiMsg("Búsqueda completada."); }
    setAiThinking(false);
  }, [searchQ]);

  const hero = featuredRow[heroIdx];

  // ─── CSS ──────────────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;background:#0a0a0a;color:#fff;font-family:'Inter',sans-serif;overflow:hidden;}
    ::-webkit-scrollbar{width:3px;height:3px;}
    ::-webkit-scrollbar-thumb{background:#333;border-radius:2px;}
    ::-webkit-scrollbar-track{background:transparent;}

    @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    @keyframes heroFade{from{opacity:0}to{opacity:1}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
    @keyframes spin{to{transform:rotate(360deg)}}

    .sf-root{display:flex;height:100vh;width:100vw;overflow:hidden;background:#0a0a0a;}

    /* ── SIDEBAR ── */
    .sidebar{
      width:180px;flex-shrink:0;
      background:rgba(12,12,12,0.98);
      border-right:1px solid #1a1a1a;
      display:flex;flex-direction:column;
      padding:20px 0;
      z-index:50;
    }
    .sidebar-logo{
      padding:0 20px 24px;
      font-family:'Bebas Neue',sans-serif;
      font-size:22px;letter-spacing:3px;
      background:linear-gradient(135deg,#e50914,#ff6b35);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    }
    .nav-item{
      display:flex;align-items:center;gap:10px;
      padding:11px 20px;cursor:pointer;
      font-size:13px;font-weight:600;letter-spacing:0.8px;
      color:#888;transition:all 0.15s;border-left:3px solid transparent;
    }
    .nav-item:hover{color:#fff;background:rgba(255,255,255,0.05);}
    .nav-item.active{color:#fff;border-left-color:#e50914;background:rgba(229,9,20,0.08);}
    .nav-item .nav-icon{font-size:15px;width:20px;text-align:center;}
    .sidebar-divider{height:1px;background:#1a1a1a;margin:12px 20px;}

    /* ── MAIN CONTENT ── */
    .main{flex:1;overflow-y:auto;overflow-x:hidden;position:relative;}

    /* ── TV LAYOUT ── */
    .tv-layout{display:flex;height:100%;gap:0;}
    .tv-player-area{flex:1;display:flex;flex-direction:column;}
    .tv-channels-panel{
      width:280px;flex-shrink:0;
      background:#0d0d0d;border-left:1px solid #1a1a1a;
      overflow-y:auto;
    }

    /* ── HERO ── */
    .hero-area{position:relative;height:55vh;min-height:320px;overflow:hidden;flex-shrink:0;}
    .hero-bg{position:absolute;inset:0;background-size:cover;background-position:center top;transition:opacity 0.8s;}
    .hero-overlay{
      position:absolute;inset:0;
      background:linear-gradient(to right,rgba(10,10,10,0.98) 0%,rgba(10,10,10,0.7) 40%,rgba(10,10,10,0.1) 100%),
                 linear-gradient(to top,rgba(10,10,10,1) 0%,transparent 50%);
    }
    .hero-content{position:absolute;bottom:0;left:0;right:0;padding:28px 32px;animation:fadeIn 0.5s ease;}
    .hero-eyebrow{
      font-size:10px;font-weight:700;letter-spacing:2px;
      background:#e50914;color:#fff;
      display:inline-block;padding:3px 10px;border-radius:3px;margin-bottom:10px;
    }
    .hero-title{
      font-family:'Bebas Neue',sans-serif;
      font-size:clamp(32px,5vw,60px);
      line-height:0.95;letter-spacing:1px;margin-bottom:10px;
    }
    .hero-meta{display:flex;gap:12px;align-items:center;margin-bottom:14px;flex-wrap:wrap;}
    .hero-meta span{font-size:12px;color:#aaa;}
    .hero-meta .rating{color:#f5c518;font-weight:700;}
    .hero-desc{
      font-size:13px;color:#bbb;line-height:1.6;max-width:480px;
      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
      margin-bottom:16px;
    }
    .hero-btns{display:flex;gap:10px;flex-wrap:wrap;}
    .btn-play{
      background:#e50914;color:#fff;border:none;
      padding:10px 24px;border-radius:5px;font-weight:700;
      font-size:13px;cursor:pointer;transition:all 0.15s;letter-spacing:0.5px;
      display:flex;align-items:center;gap:7px;
    }
    .btn-play:hover{background:#ff1a1a;transform:translateY(-1px);}
    .btn-outline{
      background:rgba(255,255,255,0.12);color:#fff;
      border:1px solid rgba(255,255,255,0.25);
      padding:10px 18px;border-radius:5px;font-weight:600;
      font-size:13px;cursor:pointer;transition:all 0.15s;
      display:flex;align-items:center;gap:7px;
    }
    .btn-outline:hover{background:rgba(255,255,255,0.2);}
    .hero-dots{display:flex;gap:6px;margin-top:14px;}
    .hero-dot{width:24px;height:3px;border-radius:2px;background:#444;cursor:pointer;transition:all 0.2s;}
    .hero-dot.active{background:#e50914;width:36px;}

    /* ── FEATURED GRID (2 grandes + 2 small) ── */
    .featured-grid{
      display:grid;
      grid-template-columns:1fr 1fr;
      grid-template-rows:1fr 1fr;
      gap:3px;height:55vh;min-height:320px;
    }
    .featured-cell{
      position:relative;overflow:hidden;cursor:pointer;
      background:#111;
    }
    .featured-cell:first-child{grid-row:1/3;}
    .featured-img{width:100%;height:100%;object-fit:cover;transition:transform 0.3s;display:block;}
    .featured-cell:hover .featured-img{transform:scale(1.04);}
    .featured-overlay{
      position:absolute;inset:0;
      background:linear-gradient(to top,rgba(0,0,0,0.85) 0%,transparent 60%);
    }
    .featured-info{position:absolute;bottom:0;left:0;right:0;padding:12px 14px;}
    .featured-title{font-size:14px;font-weight:700;line-height:1.2;margin-bottom:4px;}
    .featured-sub{font-size:11px;color:#aaa;}

    /* ── CONTENT ROWS ── */
    .content-area{padding:20px 24px 40px;}
    .row-section{margin-bottom:28px;animation:fadeIn 0.4s ease;}
    .row-title{
      font-size:13px;font-weight:700;letter-spacing:0.5px;
      color:#fff;margin-bottom:12px;display:flex;align-items:center;gap:8px;
    }
    .row-title::after{content:'';flex:1;height:1px;background:#1a1a1a;margin-left:10px;}
    .cards-scroll{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
      gap:10px;
    }
    .cards-scroll.main-grid{grid-template-columns:repeat(auto-fill,minmax(160px,1fr));}

    /* ── CARD ── */
    .card{
      position:relative;border-radius:6px;overflow:hidden;
      cursor:pointer;background:#111;
      transition:transform 0.2s,box-shadow 0.2s;
      border:1px solid transparent;
    }
    .card:hover{transform:scale(1.04);box-shadow:0 8px 30px rgba(0,0,0,0.7);border-color:#333;}
    .card-poster{width:100%;aspect-ratio:2/3;object-fit:cover;display:block;background:#1a1a1a;}
    .card-poster-placeholder{
      width:100%;aspect-ratio:2/3;
      background:linear-gradient(135deg,#1a1a1a,#222);
      display:flex;align-items:center;justify-content:center;font-size:36px;
    }
    .card-info{padding:8px 8px 10px;}
    .card-title{font-size:12px;font-weight:600;line-height:1.3;
      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
      margin-bottom:3px;}
    .card-year{font-size:11px;color:#666;}
    .card-rating{
      position:absolute;top:6px;left:6px;
      background:rgba(0,0,0,0.8);color:#f5c518;
      font-size:10px;font-weight:700;padding:2px 6px;border-radius:3px;
    }
    .card-fav-btn{
      position:absolute;top:6px;right:6px;
      background:rgba(0,0,0,0.75);border:none;
      width:26px;height:26px;border-radius:4px;cursor:pointer;
      font-size:13px;display:flex;align-items:center;justify-content:center;
      transition:all 0.15s;color:#aaa;
    }
    .card-fav-btn:hover,.card-fav-btn.active{color:#f5c518;background:rgba(0,0,0,0.9);}
    .card-type-badge{
      position:absolute;bottom:46px;left:6px;
      background:rgba(229,9,20,0.9);color:#fff;
      font-size:9px;font-weight:700;padding:2px 6px;border-radius:3px;letter-spacing:0.5px;
    }

    /* ── GENRE PILLS ── */
    .genre-strip{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px;}
    .genre-pill{
      padding:5px 14px;border-radius:20px;font-size:12px;font-weight:600;
      cursor:pointer;transition:all 0.15s;border:1px solid #2a2a2a;background:#141414;color:#888;
    }
    .genre-pill:hover{color:#fff;border-color:#555;}
    .genre-pill.active{background:#e50914;border-color:#e50914;color:#fff;}

    /* ── TV CHANNEL CARDS ── */
    .ch-list-header{
      padding:14px 16px 8px;
      font-size:11px;font-weight:700;letter-spacing:1.5px;color:#555;
      border-bottom:1px solid #1a1a1a;
    }
    .ch-filter-strip{
      display:flex;gap:0;overflow-x:auto;border-bottom:1px solid #1a1a1a;
    }
    .ch-filter-btn{
      padding:8px 14px;font-size:11px;font-weight:600;
      cursor:pointer;color:#555;border:none;background:transparent;
      border-bottom:2px solid transparent;white-space:nowrap;transition:all 0.15s;
    }
    .ch-filter-btn:hover{color:#fff;}
    .ch-filter-btn.active{color:#e50914;border-bottom-color:#e50914;}
    .ch-item{
      display:flex;align-items:center;gap:12px;
      padding:10px 16px;cursor:pointer;transition:background 0.15s;
      border-bottom:1px solid #141414;
    }
    .ch-item:hover{background:rgba(255,255,255,0.04);}
    .ch-item.active{background:rgba(229,9,20,0.08);border-left:2px solid #e50914;}
    .ch-logo{
      width:46px;height:34px;border-radius:5px;
      display:flex;align-items:center;justify-content:center;
      font-size:16px;font-weight:900;font-size:11px;
      color:#fff;flex-shrink:0;letter-spacing:0.5px;
      background:#1a1a1a;border:1px solid #2a2a2a;
    }
    .ch-info{flex:1;min-width:0;}
    .ch-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
    .ch-cat{font-size:11px;color:#666;margin-top:2px;}
    .live-pill{
      display:inline-flex;align-items:center;gap:4px;
      background:#e50914;color:#fff;font-size:9px;font-weight:700;
      padding:2px 7px;border-radius:3px;letter-spacing:1px;
    }
    .live-dot{width:5px;height:5px;background:#fff;border-radius:50%;animation:pulse 1.5s infinite;}

    /* ── TV PLAYER ── */
    .tv-player-box{
      flex:1;position:relative;background:#000;
      display:flex;flex-direction:column;
    }
    .tv-no-signal{
      flex:1;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:16px;color:#444;
    }
    .tv-no-signal-icon{font-size:64px;}
    .tv-now-playing{
      padding:14px 20px;background:#0d0d0d;border-top:1px solid #1a1a1a;
      display:flex;align-items:center;gap:14px;
    }
    .tv-channel-logo-big{
      width:52px;height:40px;border-radius:6px;
      background:#1a1a1a;border:1px solid #2a2a2a;
      display:flex;align-items:center;justify-content:center;font-size:20px;
    }

    /* ── MODAL DETALLE ── */
    .modal-backdrop{
      position:fixed;inset:0;background:rgba(0,0,0,0.9);
      backdrop-filter:blur(10px);z-index:200;
      display:flex;align-items:center;justify-content:center;
      animation:fadeIn 0.2s ease;padding:20px;
    }
    .modal-box{
      width:min(860px,95vw);max-height:90vh;
      background:#141414;border-radius:10px;overflow:hidden;
      display:flex;flex-direction:column;border:1px solid #2a2a2a;
    }
    .modal-backdrop-img{
      position:relative;height:280px;overflow:hidden;flex-shrink:0;
    }
    .modal-backdrop-img img{width:100%;height:100%;object-fit:cover;display:block;}
    .modal-backdrop-img::after{
      content:'';position:absolute;inset:0;
      background:linear-gradient(to top,#141414 0%,rgba(20,20,20,0.4) 100%);
    }
    .modal-close{
      position:absolute;top:14px;right:14px;z-index:10;
      background:rgba(0,0,0,0.7);border:1px solid #333;
      color:#fff;width:32px;height:32px;border-radius:6px;
      cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;
    }
    .modal-body{padding:0 28px 28px;overflow-y:auto;flex:1;}
    .modal-title{
      font-family:'Bebas Neue',sans-serif;font-size:36px;
      letter-spacing:1px;margin-bottom:8px;
    }
    .modal-meta{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;}
    .modal-meta span{font-size:12px;color:#888;}
    .modal-meta .hl{color:#f5c518;font-weight:700;}
    .modal-genres{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;}
    .modal-genre-tag{
      background:#1e1e1e;border:1px solid #2a2a2a;
      padding:3px 10px;border-radius:3px;font-size:11px;color:#aaa;
    }
    .modal-overview{font-size:14px;color:#bbb;line-height:1.8;margin-bottom:20px;}
    .modal-actions{display:flex;gap:10px;flex-wrap:wrap;}

    /* ── SEARCH ── */
    .search-overlay{
      position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:150;
      display:flex;flex-direction:column;animation:fadeIn 0.2s ease;
    }
    .search-header{
      padding:20px 28px;border-bottom:1px solid #1a1a1a;
      display:flex;gap:14px;align-items:center;
    }
    .search-input{
      flex:1;background:#1a1a1a;border:1px solid #2a2a2a;color:#fff;
      padding:12px 18px;border-radius:6px;font-size:16px;outline:none;
      font-family:'Inter',sans-serif;
    }
    .search-input:focus{border-color:#e50914;}
    .search-btn{
      background:#e50914;color:#fff;border:none;
      padding:12px 22px;border-radius:6px;font-weight:700;
      font-size:13px;cursor:pointer;transition:background 0.15s;
    }
    .search-btn:hover{background:#ff1a1a;}
    .close-btn{
      background:#1a1a1a;border:1px solid #2a2a2a;color:#fff;
      padding:12px 16px;border-radius:6px;cursor:pointer;font-size:16px;
    }
    .ai-answer{
      margin:18px 28px;padding:16px 20px;
      background:rgba(229,9,20,0.08);border:1px solid rgba(229,9,20,0.25);
      border-radius:8px;font-size:14px;color:#ddd;line-height:1.7;
      display:flex;gap:14px;align-items:flex-start;
    }
    .ai-icon{font-size:22px;flex-shrink:0;}
    .search-results-grid{
      padding:0 28px 32px;flex:1;overflow-y:auto;
      display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;
    }
    .thinking-dots{display:flex;gap:5px;align-items:center;}
    .thinking-dot{width:7px;height:7px;border-radius:50%;background:#e50914;animation:pulse 1s infinite;}
    .thinking-dot:nth-child(2){animation-delay:0.2s;}
    .thinking-dot:nth-child(3){animation-delay:0.4s;}

    /* ── PAGINATION ── */
    .pagination{display:flex;gap:8px;justify-content:center;margin-top:24px;}
    .pg-btn{
      background:#1a1a1a;border:1px solid #2a2a2a;color:#fff;
      padding:8px 20px;border-radius:5px;cursor:pointer;
      font-size:13px;font-weight:600;transition:all 0.15s;
    }
    .pg-btn:hover:not(:disabled){background:#2a2a2a;}
    .pg-btn:disabled{opacity:0.35;cursor:not-allowed;}
    .pg-cur{
      background:#e50914;border:1px solid #e50914;color:#fff;
      padding:8px 16px;border-radius:5px;font-size:13px;font-weight:700;
    }

    /* ── NOTIF ── */
    .notif{
      position:fixed;bottom:28px;right:28px;z-index:999;
      background:#1a1a1a;border:1px solid #333;
      padding:12px 20px;border-radius:6px;
      font-size:13px;font-weight:600;color:#fff;
      animation:fadeIn 0.3s ease;
      box-shadow:0 8px 32px rgba(0,0,0,0.7);
    }

    /* ── EMPTY ── */
    .empty-state{
      padding:64px 20px;text-align:center;color:#444;
    }
    .empty-icon{font-size:56px;margin-bottom:16px;}
    .empty-title{font-size:18px;font-weight:700;margin-bottom:6px;color:#666;}
    .empty-sub{font-size:13px;}

    /* ── TOP BAR ── */
    .topbar{
      position:sticky;top:0;z-index:40;
      background:rgba(10,10,10,0.95);backdrop-filter:blur(20px);
      border-bottom:1px solid #1a1a1a;
      display:flex;align-items:center;justify-content:flex-end;
      padding:10px 24px;gap:10px;
    }
    .topbar-icon{
      width:36px;height:36px;border-radius:50%;
      background:#1a1a1a;border:1px solid #2a2a2a;
      display:flex;align-items:center;justify-content:center;
      cursor:pointer;font-size:15px;transition:all 0.15s;color:#aaa;
    }
    .topbar-icon:hover{background:#2a2a2a;color:#fff;}

    @media(max-width:900px){
      .sidebar{width:56px;}
      .nav-item span:not(.nav-icon){display:none;}
      .sidebar-logo{font-size:14px;padding:0 8px 20px;letter-spacing:1px;}
      .tv-channels-panel{width:220px;}
    }
    @media(max-width:600px){
      .sidebar{width:48px;}
      .featured-grid{height:45vh;}
      .hero-area{height:45vh;}
      .modal-backdrop-img{height:200px;}
      .modal-title{font-size:26px;}
    }
  `;

  // ─── COMPONENTS ──────────────────────────────────────────────────────────

  const Card = ({ item, onClick }) => {
    const title = item.title || item.name || "Sin título";
    const year  = (item.release_date || item.first_air_date || "").slice(0,4);
    const type  = item.media_type === "tv" ? "SERIE" : null;
    return (
      <div className="card" onClick={() => onClick(item)}>
        {item.poster_path
          ? <img className="card-poster" src={img(item.poster_path)} alt={title} loading="lazy"/>
          : <div className="card-poster-placeholder">{type ? "📺" : "🎬"}</div>
        }
        {item.vote_average > 0 && (
          <div className="card-rating">⭐ {item.vote_average.toFixed(1)}</div>
        )}
        {type && <div className="card-type-badge">{type}</div>}
        <button className={`card-fav-btn ${isFav(item.id) ? "active" : ""}`}
          onClick={e => { e.stopPropagation(); toggleFav(item); }}>
          {isFav(item.id) ? "★" : "☆"}
        </button>
        <div className="card-info">
          <div className="card-title">{title}</div>
          {year && <div className="card-year">{year}</div>}
        </div>
      </div>
    );
  };

  const FeaturedGrid = () => {
    if (!featuredRow.length) return null;
    const items = [...featuredRow].slice(0, 4);
    while (items.length < 4) items.push(null);
    return (
      <div className="featured-grid">
        {items.map((item, i) => item ? (
          <div key={item.id} className="featured-cell" onClick={() => setSelectedItem(item)}
            style={{ gridRow: i === 0 ? "1/3" : "auto" }}>
            {imgW(item.backdrop_path || item.poster_path)
              ? <img className="featured-img"
                  src={imgW(i === 0 ? (item.backdrop_path || item.poster_path) : item.poster_path, i===0?"w780":"w500")}
                  alt={item.title||item.name} loading="lazy"/>
              : <div style={{width:"100%",height:"100%",background:"#111",display:"flex",alignItems:"center",justifyContent:"center",fontSize:48}}>🎬</div>
            }
            <div className="featured-overlay"/>
            <div className="featured-info">
              <div className="featured-title">{item.title||item.name}</div>
              <div className="featured-sub">
                {(item.release_date||item.first_air_date||"").slice(0,4)}
                {item.vote_average > 0 && ` · ⭐ ${item.vote_average.toFixed(1)}`}
              </div>
            </div>
          </div>
        ) : (
          <div key={i} style={{background:"#111"}}/>
        ))}
      </div>
    );
  };

  const ContentRows = () => (
    <div className="content-area">
      {contentRows.map((row, ri) => (
        <div key={ri} className="row-section">
          <div className="row-title">{row.title}</div>
          <div className={`cards-scroll ${row.isMain ? "main-grid" : ""}`}>
            {row.items.map(item => (
              <Card key={item.id} item={item} onClick={setSelectedItem}/>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // ─── TV SECTION ────────────────────────────────────────────────────────────
  const TvSection = () => {
    const filteredCh = channelFilter === "Todos"
      ? CHANNELS
      : CHANNELS.filter(c => c.cat === channelFilter);
    const cats = ["Todos", "Noticias", "Deportes", "Documentales", "Kids", "Internacional", "Entretenimiento", "Ciencia"];
    const streamUrl = playingChannel ? (CHANNEL_STREAM_URLS[playingChannel.id] || null) : null;

    return (
      <div className="tv-layout">
        {/* Player area */}
        <div className="tv-player-area">
          <div className="tv-player-box" style={{minHeight: 0}}>
            {playingChannel ? (
              <>
                {streamUrl && streamUrl.includes("youtube") ? (
                  <iframe src={streamUrl} style={{flex:1,border:"none",width:"100%",minHeight:"60%",background:"#000"}}
                    allow="autoplay;encrypted-media" allowFullScreen title={playingChannel.name}/>
                ) : streamUrl ? (
                  <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,background:"#000",padding:32}}>
                    <div style={{fontSize:48}}>{playingChannel.logo}</div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>{playingChannel.name}</div>
                    <div className="live-pill"><span className="live-dot"/>EN VIVO</div>
                    <p style={{color:"#555",fontSize:13,textAlign:"center",maxWidth:360}}>
                      Este canal usa stream HLS nativo. Ábrelo en VLC o tu player preferido:
                    </p>
                    <a href={streamUrl} target="_blank" rel="noreferrer"
                      style={{background:"#e50914",color:"#fff",padding:"10px 22px",borderRadius:5,
                        fontWeight:700,fontSize:13,textDecoration:"none",letterSpacing:0.5}}>
                      🔗 Abrir stream M3U8
                    </a>
                  </div>
                ) : (
                  <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16,background:"#000",padding:32}}>
                    <div style={{fontSize:64}}>{playingChannel.logo}</div>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,letterSpacing:2}}>{playingChannel.name}</div>
                    <div className="live-pill"><span className="live-dot"/>EN VIVO</div>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(playingChannel.name+" en vivo")}`}
                      target="_blank" rel="noreferrer"
                      style={{background:"#e50914",color:"#fff",padding:"10px 22px",borderRadius:5,
                        fontWeight:700,fontSize:13,textDecoration:"none"}}>
                      ▶ Buscar en YouTube
                    </a>
                  </div>
                )}
                <div className="tv-now-playing">
                  <div className="tv-channel-logo-big">{playingChannel.logo}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{playingChannel.name}</div>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <div className="live-pill"><span className="live-dot"/>EN VIVO</div>
                      <span style={{color:"#555",fontSize:11}}>{playingChannel.cat}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="tv-no-signal">
                <div className="tv-no-signal-icon">📺</div>
                <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,letterSpacing:2,color:"#333"}}>SELECCIONA UN CANAL</div>
                <div style={{fontSize:13,color:"#333",textAlign:"center",maxWidth:300}}>
                  Elige un canal de la lista de la derecha para comenzar a ver
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Channels panel */}
        <div className="tv-channels-panel">
          <div className="ch-list-header">CANALES ({filteredCh.length})</div>
          <div className="ch-filter-strip">
            {cats.map(c => (
              <button key={c} className={`ch-filter-btn ${channelFilter===c?"active":""}`}
                onClick={() => setChannelFilter(c)}>{c}</button>
            ))}
          </div>
          {filteredCh.map(ch => (
            <div key={ch.id} className={`ch-item ${playingChannel?.id===ch.id?"active":""}`}
              onClick={() => setPlayingChannel(ch)}>
              <div className="ch-logo" style={{background:ch.color+"22",borderColor:ch.color+"44"}}>
                <span style={{color:ch.color}}>{ch.logo}</span>
              </div>
              <div className="ch-info">
                <div className="ch-name">{ch.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                  <div className="live-pill" style={{fontSize:"8px",padding:"1px 5px"}}>
                    <span className="live-dot"/>VIVO
                  </div>
                  <div className="ch-cat">{ch.cat}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── DETAIL MODAL ──────────────────────────────────────────────────────────
  const DetailModal = ({ item }) => {
    const [det, setDet] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [showTrailer, setShowTrailer] = useState(false);
    const type = item.media_type === "tv" ? "tv" : "movie";

    useEffect(() => {
      tmdb(`/${type}/${item.id}?`).then(setDet);
      tmdb(`/${type}/${item.id}/videos?`).then(d => {
        const t = (d.results||[]).find(v => v.type==="Trailer" && v.site==="YouTube");
        if(t) setTrailer(t.key);
      });
    }, [item.id, type]);

    const title = item.title || item.name;
    const back  = item.backdrop_path ? imgW(item.backdrop_path,"original") : null;

    return (
      <div className="modal-backdrop" onClick={() => setSelectedItem(null)}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
          <div className="modal-backdrop-img">
            {showTrailer && trailer
              ? <iframe src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
                  style={{width:"100%",height:"100%",border:"none"}}
                  allow="autoplay;encrypted-media" allowFullScreen title="Trailer"/>
              : back
                ? <img src={back} alt={title}/>
                : <div style={{width:"100%",height:"100%",background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:64}}>{type==="tv"?"📺":"🎬"}</div>
            }
            <button className="modal-close" onClick={() => setSelectedItem(null)}>✕</button>
          </div>

          <div className="modal-body">
            <div style={{display:"flex",gap:20,flexWrap:"wrap",paddingTop:4}}>
              {item.poster_path && (
                <img src={img(item.poster_path,"w154")} alt={title}
                  style={{width:90,borderRadius:6,flexShrink:0,alignSelf:"flex-start",marginTop:-40,position:"relative",zIndex:1,border:"2px solid #2a2a2a"}}/>
              )}
              <div style={{flex:1,minWidth:180}}>
                <div className="modal-title">{title}</div>
                <div className="modal-meta">
                  <span>{(item.release_date||item.first_air_date||"").slice(0,4)}</span>
                  {item.vote_average>0 && <span className="hl">⭐ {item.vote_average.toFixed(1)}</span>}
                  {det?.runtime && <span>{det.runtime} min</span>}
                  {det?.number_of_seasons && <span>{det.number_of_seasons} temporadas</span>}
                  {det?.status && <span style={{textTransform:"capitalize"}}>{det.status}</span>}
                </div>
                {det?.genres?.length > 0 && (
                  <div className="modal-genres">
                    {det.genres.map(g => <span key={g.id} className="modal-genre-tag">{g.name}</span>)}
                  </div>
                )}
              </div>
            </div>
            <p className="modal-overview">{item.overview || "Sin sinopsis disponible en español."}</p>
            <div className="modal-actions">
              {trailer && (
                <button className="btn-play" onClick={() => setShowTrailer(!showTrailer)}>
                  {showTrailer ? "⏹" : "▶"} {showTrailer ? "Cerrar" : "Ver Trailer"}
                </button>
              )}
              <button className="btn-outline" onClick={() => { toggleFav(item); }}>
                {isFav(item.id) ? "★ En Mi Lista" : "☆ Mi Lista"}
              </button>
              <button className="btn-outline" onClick={() => {
                window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(title+" pelicula completa español")}`, "_blank");
              }}>
                🔴 YouTube
              </button>
            </div>
            {det?.production_companies?.length > 0 && (
              <div style={{marginTop:20,paddingTop:16,borderTop:"1px solid #1e1e1e"}}>
                <div style={{fontSize:11,color:"#555",letterSpacing:1,marginBottom:6}}>PRODUCTORAS</div>
                <div style={{fontSize:13,color:"#777"}}>{det.production_companies.map(p=>p.name).join(" · ")}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ─── SEARCH OVERLAY ────────────────────────────────────────────────────────
  const SearchOverlay = () => (
    <div className="search-overlay">
      <div className="search-header">
        <input ref={searchRef} className="search-input" type="text"
          placeholder="Buscar películas, series, actores..." autoFocus
          value={searchQ} onChange={e => setSearchQ(e.target.value)}
          onKeyDown={e => e.key==="Enter" && doSearch()}/>
        <button className="search-btn" onClick={doSearch}>
          {aiThinking ? <span>⟳</span> : "✦ Buscar con IA"}
        </button>
        <button className="close-btn" onClick={() => { setSearchOpen(false); setSearchQ(""); setSearchRes([]); setAiMsg(""); }}>✕</button>
      </div>

      {(aiThinking || aiMsg) && (
        <div className="ai-answer">
          <div className="ai-icon">✦</div>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:"#e50914",marginBottom:6}}>ANÁLISIS IA</div>
            {aiThinking
              ? <div className="thinking-dots">
                  <div className="thinking-dot"/><div className="thinking-dot"/><div className="thinking-dot"/>
                  <span style={{marginLeft:8,color:"#555",fontSize:13}}>Analizando búsqueda...</span>
                </div>
              : <div>{aiMsg}</div>
            }
          </div>
        </div>
      )}

      <div className="search-results-grid">
        {searchRes.map(item => (
          <Card key={item.id} item={item} onClick={it => { setSelectedItem(it); setSearchOpen(false); }}/>
        ))}
        {!aiThinking && searchRes.length === 0 && searchQ && (
          <div style={{gridColumn:"1/-1"}}>
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-title">Sin resultados</div>
              <div className="empty-sub">Intenta con otro término o usa la IA</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="sf-root">
      <style>{css}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">▷ STREAM<br/>FUTURE</div>
        <div className="sidebar-divider"/>
        {NAV_ITEMS.map(n => (
          <div key={n.id}
            className={`nav-item ${section===n.id?"active":""}`}
            onClick={() => setSection(n.id)}>
            <span className="nav-icon">{n.icon}</span>
            <span>{n.label}</span>
          </div>
        ))}
        <div className="sidebar-divider"/>
        <div className="nav-item" onClick={() => setSection("favoritos")}
          style={section==="favoritos" ? {color:"#fff",borderLeft:"3px solid #e50914",background:"rgba(229,9,20,0.08)"} : {}}>
          <span className="nav-icon">⭐</span>
          <span>MI LISTA</span>
        </div>
      </aside>

      {/* MAIN */}
      <div className="main">
        {/* TOP BAR */}
        <div className="topbar">
          <div className="topbar-icon" onClick={() => setSearchOpen(true)} title="Buscar">🔍</div>
          <div className="topbar-icon" title="Filtros">⚙️</div>
          <div className="topbar-icon" title="Perfil">👤</div>
          <div className="topbar-icon" title="Notificaciones">🔔</div>
        </div>

        {/* ── TV ── */}
        {section === "tv" && <TvSection/>}

        {/* ── DESTACADOS ── */}
        {section === "destacados" && (
          <>
            <FeaturedGrid/>
            <ContentRows/>
          </>
        )}

        {/* ── PELÍCULAS ── */}
        {section === "pelicula" && (
          <div className="content-area">
            <FeaturedGrid/>
            <div style={{marginTop:20}}>
              <div className="genre-strip">
                {GENRE_MAP.movies.map(g => (
                  <div key={g.id} className={`genre-pill ${movieGenre===g.id?"active":""}`}
                    onClick={() => { setMovieGenre(g.id); setMoviePage(1); }}>
                    {g.name}
                  </div>
                ))}
              </div>
              <div className="row-title">
                {GENRE_MAP.movies.find(g=>g.id===movieGenre)?.name || "Películas"}
              </div>
              <div className="cards-scroll main-grid">
                {contentRows[0]?.items.map(item => (
                  <Card key={item.id} item={item} onClick={setSelectedItem}/>
                ))}
              </div>
              <div className="pagination">
                <button className="pg-btn" disabled={moviePage===1}
                  onClick={() => setMoviePage(p => Math.max(1,p-1))}>← Anterior</button>
                <div className="pg-cur">Pág {moviePage}</div>
                <button className="pg-btn" onClick={() => setMoviePage(p => p+1)}>Siguiente →</button>
              </div>
            </div>
          </div>
        )}

        {/* ── SERIES ── */}
        {section === "series" && (
          <div className="content-area">
            <FeaturedGrid/>
            <div style={{marginTop:20}}>
              <div className="genre-strip">
                {GENRE_MAP.series.map(g => (
                  <div key={g.id} className={`genre-pill ${seriesGenre===g.id?"active":""}`}
                    onClick={() => setSeriesGenre(g.id)}>
                    {g.name}
                  </div>
                ))}
              </div>
              <div className="row-title">
                {GENRE_MAP.series.find(g=>g.id===seriesGenre)?.name || "Series"}
              </div>
              <div className="cards-scroll main-grid">
                {contentRows[0]?.items.map(item => (
                  <Card key={item.id} item={item} onClick={setSelectedItem}/>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── KIDS ── */}
        {section === "kids" && (
          <>
            <FeaturedGrid/>
            <ContentRows/>
          </>
        )}

        {/* ── ANIME ── */}
        {section === "anime" && (
          <>
            <FeaturedGrid/>
            <ContentRows/>
          </>
        )}

        {/* ── EXPLORAR ── */}
        {section === "explorar" && (
          <>
            <FeaturedGrid/>
            <ContentRows/>
          </>
        )}

        {/* ── MI LISTA ── */}
        {section === "favoritos" && (
          <div className="content-area">
            <div className="row-title">⭐ MI LISTA</div>
            {favs.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">☆</div>
                <div className="empty-title">Tu lista está vacía</div>
                <div className="empty-sub">Toca ☆ en cualquier título para guardarlo aquí</div>
              </div>
            ) : (
              <div className="cards-scroll main-grid">
                {favs.map(item => <Card key={item.id} item={item} onClick={setSelectedItem}/>)}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALES */}
      {selectedItem && <DetailModal item={selectedItem}/>}
      {searchOpen && <SearchOverlay/>}

      {/* NOTIFICACIÓN */}
      {notification && <div className="notif">{notification.msg}</div>}
    </div>
  );
}
