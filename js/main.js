/* Chandigarh Region Showcase — builds every section from window.CRS, then animates it. */
(() => {
  const D = window.CRS;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = (tag, attrs = {}, html = "") => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === false || v == null) continue;
      if (k === "class") n.className = v; else n.setAttribute(k, v === true ? "" : v);
    }
    if (html) n.innerHTML = html;
    return n;
  };
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parse = (iso) => { const [y, m, d] = iso.split("-").map(Number); return { y, m, d }; };
  const dd = (n) => String(n).padStart(2, "0");
  const dayName = (iso) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][new Date(iso + "T12:00:00").getDay()];
  const photo = (m, i, small = true) => `assets/meetups/${m.file || m.ig}-${i}${small ? "-s" : ""}.webp`;
  const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const word = (n) => { const w = n < 20 ? WORDS[n] : TENS[Math.floor(n / 10)] + (n % 10 ? "-" + WORDS[n % 10] : ""); return w[0].toUpperCase() + w.slice(1); };
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGsap = !!window.gsap && !!window.ScrollTrigger;
  if (reduced || !hasGsap) document.documentElement.classList.add("reduced");

  /* ---------- Static fills ---------- */
  $$("[data-tenure]").forEach((n) => (n.textContent = D.tenure));
  $$("[data-credit-name]").forEach((n) => (n.textContent = D.credit.name));
  $$("[data-credit-org]").forEach((n) => (n.textContent = D.credit.org));
  $$("[data-credit-role]").forEach((n) => (n.textContent = D.credit.role));
  $$("[data-credit-link]").forEach((n) => { n.href = D.credit.url; n.target = "_blank"; n.rel = "noopener"; });

  /* ---------- Seal ---------- */
  const seal = $("#seal");
  if (seal) {
    const dots = Array.from({ length: 10 }, (_, i) => {
      const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
      return `<circle cx="${(100 + Math.cos(a) * 62).toFixed(2)}" cy="${(100 + Math.sin(a) * 62).toFixed(2)}" r="2.6" fill="var(--gold)"/>`;
    }).join("");
    seal.innerHTML = `
      <svg viewBox="0 0 200 200" aria-label="Chandigarh Region emblem">
        <defs><path id="ringPath" d="M100,100 m-84,0 a84,84 0 1,1 168,0 a84,84 0 1,1 -168,0"/></defs>
        <g class="spin"><text class="ring-text"><textPath href="#ringPath">Chandigarh Region · IIT Madras BS Degree · Tenure ${D.tenure.replace(/\s/g, "")} ·</textPath></text></g>
        <circle cx="100" cy="100" r="96" fill="none" stroke="var(--line-2)"/>
        <circle cx="100" cy="100" r="72" fill="none" stroke="var(--gold)" stroke-width="1"/>
        ${dots}
        <g fill="none" stroke="var(--ivory)" stroke-width="1.3">
          <rect x="70" y="70" width="60" height="60"/><path d="M90 70v60M110 70v60M70 90h60M70 110h60"/>
        </g>
        <rect x="90" y="90" width="20" height="20" fill="var(--gold)"/>
      </svg>`;
  }

  /* ---------- Stats ---------- */
  const cityCount = {};
  D.meetups.forEach((m) => (cityCount[m.city] = (cityCount[m.city] || 0) + 1));
  const counts = { meetups: D.meetups.length, cities: Object.keys(cityCount).length };
  $$("[data-word]").forEach((n) => (n.textContent = word(counts[n.dataset.word])));
  const stats = [
    [D.meetups.length, "Offline meetups"],
    [Object.keys(cityCount).length, "Cities"],
    [D.states, "States & UTs"],
    [D.houses.length, "Houses"],
    [D.sessions.length, "Region sessions"]
  ];
  $("#stats").append(...stats.map(([n, l]) => h("div", { class: "stat" }, `<div class="stat__n" data-count="${n}">${n}</div><div class="stat__l">${l}</div>`)));

  /* ---------- Meetups: chips + timeline ---------- */
  const kinds = ["All", ...new Set(D.meetups.map((m) => m.kind))];
  const chips = $("#chips");
  kinds.forEach((k, i) => {
    const n = k === "All" ? D.meetups.length : D.meetups.filter((m) => m.kind === k).length;
    const b = h("button", { class: "chip" + (i ? "" : " is-on"), role: "tab", "aria-selected": i ? "false" : "true", "data-kind": k }, `${k}<sup>${n}</sup>`);
    chips.append(b);
  });

  const byDate = D.meetups.reduce((acc, m, i) => ((acc[m.date] ||= []).push(i), acc), {});
  const timeline = $("#timeline");
  for (const [date, idxs] of Object.entries(byDate)) {
    const { m, d } = parse(date);
    const isS2 = idxs.every((i) => D.meetups[i].s2);
    const day = h("div", { class: "day", "data-date": date });
    day.append(h("div", { class: "day__when" },
      `<div class="day__date">${dd(d)} ${MONTHS[m - 1]}<small>${dayName(date)} · ${idxs.length} meetup${idxs.length > 1 ? "s" : ""}</small></div>` +
      (isS2 ? `<span class="day__tag">Chai, Baarish aur Baatcheet · S2</span>` : "")));
    const cards = h("div", { class: "day__cards" });
    idxs.forEach((i) => {
      const mt = D.meetups[i];
      const top = mt.first ? `<span class="badge badge--gold">First ever</span>` : `<span class="badge">${mt.kind}</span>`;
      if (!mt.photos) {
        cards.append(h("div", { class: "mcard mcard--soon", "data-kind": mt.kind },
          `<div class="mcard__img"><div class="soon"><span class="soon__no">#${mt.no}</span><span class="soon__city">${mt.city}</span><span class="soon__txt">Photos on their way</span></div></div>
           <div class="mcard__meta"><div><div class="mcard__city">${mt.city}</div><div class="mcard__place">Student meetup${mt.no ? ` · #${mt.no}` : ""}</div></div></div>`));
        return;
      }
      const card = h("button", { class: "mcard", "data-i": i, "data-kind": mt.kind, "data-cursor": "Open", "aria-label": `${mt.city}, ${mt.place}. Open photos` },
        `<div class="mcard__img"><img src="${photo(mt, 1)}" alt="" loading="lazy" decoding="async" width="512" height="640"></div>
         <div class="mcard__top">${top}</div>
         <div class="mcard__meta"><div><div class="mcard__city">${mt.city}</div><div class="mcard__place">${mt.place}${mt.no ? ` · #${mt.no}` : ""}</div></div>
         <span class="mcard__count">${dd(mt.photos)}<span class="mcard__arrow">↗</span></span></div>`);
      cards.append(card);
    });
    day.append(cards);
    timeline.append(day);
  }

  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    $$(".chip", chips).forEach((c) => { c.classList.toggle("is-on", c === b); c.setAttribute("aria-selected", c === b); });
    const k = b.dataset.kind;
    $$(".mcard", timeline).forEach((c) => (c.hidden = k !== "All" && c.dataset.kind !== k));
    $$(".day", timeline).forEach((d) => (d.hidden = !$$(".mcard", d).some((c) => !c.hidden)));
    if (hasGsap && !reduced) {
      gsap.fromTo($$(".mcard:not([hidden])", timeline), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .7, stagger: .03, ease: "expo.out" });
      ScrollTrigger.refresh();
    }
  });

  /* ---------- Spotlight ---------- */
  const s2 = D.meetups.map((m, i) => [m, i]).filter(([m]) => m.s2);
  $("#spotCities").append(...s2.map(([m]) => h("span", {}, m.city)));
  $("#spotRail").append(...s2.flatMap(([m, i]) =>
    Array.from({ length: Math.min(2, m.photos) }, (_, k) =>
      h("button", { "data-i": i, "data-p": k + 1, "data-cursor": "View", "aria-label": `${m.city} photos` },
        `<img src="${photo(m, k + 1)}" alt="" loading="lazy" decoding="async"><span>${m.city}<small>${m.place.split(",")[0]}</small></span>`))));

  /* ---------- Programme / online / videos ---------- */
  $("#programCount").textContent = `${D.sessions.length} sessions`;
  $("#program").append(...D.sessions.map((s) => {
    const { m, d } = parse(s.date);
    return h("li", { class: "prow" },
      `<span class="prow__date">${dd(d)}.${dd(m)}.${String(parse(s.date).y).slice(2)}</span>
       <span><span class="prow__title">${s.title}</span><span class="prow__time">${s.time}</span></span>
       <span class="prow__sub">${s.sub}</span>
       <span class="prow__type${s.type === "Night" ? " is-night" : ""}">${s.type}</span>`);
  }));
  $("#online").append(...D.online.map((o) =>
    h("div", { class: "otile" }, `<div class="otile__tag">${o.tag}</div><h4>${o.title}</h4><p>${o.sub}</p><div class="otile__date">${o.date}</div>`)));

  const ytId = (u) => (u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [])[1];
  const vids = (D.videos || []).map((v) => ({ ...v, id: ytId(v.url) })).filter((v) => v.id);
  if (vids.length) {
    $("#videos").hidden = false;
    $("#videoGrid").append(...vids.map((v) => {
      const b = h("button", { class: "vid", "data-cursor": "Play", "aria-label": `Play ${v.title}` },
        `<img src="https://i.ytimg.com/vi/${v.id}/hqdefault.jpg" alt="" loading="lazy"><span class="vid__play"><i></i></span><span class="vid__title">${v.title}</span>`);
      b.addEventListener("click", () => {
        b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0" title="${v.title}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
      }, { once: true });
      return b;
    }));
  }

  /* ---------- Map ---------- */
  const svg = $("#mapSvg");
  const NS = "http://www.w3.org/2000/svg";
  const P = ([lat, lon]) => [97 + (lon - 72.5) * 42.7, 40 + (33.4 - lat) * 48];
  const labelSide = { Sirsa: "l", Bhilwara: "l", Udaipur: "l", Amritsar: "l", Hisar: "b", Indore: "l", Sikar: "l", Chandigarh: "l", Haldwani: "r" };
  // the Uttarakhand cluster is too tight to label in place: stack its names to the right with leader lines
  const stacked = { Dehradun: 140, Rishikesh: 166, Haridwar: 192, Roorkee: 218 };
  let mapMarkup = "";
  for (let lat = 22; lat <= 33; lat += 2) {
    const y = P([lat, 0])[1];
    mapMarkup += `<line class="grat" x1="20" x2="580" y1="${y}" y2="${y}"/><text class="grat-l" x="24" y="${y - 5}">${lat}°N</text>`;
  }
  for (let lon = 73; lon <= 82; lon += 2) {
    const x = P([0, lon])[0];
    mapMarkup += `<line class="grat" y1="20" y2="620" x1="${x}" x2="${x}"/><text class="grat-l" x="${x + 4}" y="632">${lon}°E</text>`;
  }
  const hub = P(D.cities.Chandigarh);
  const cityNames = Object.keys(D.cities);
  cityNames.forEach((c) => {
    if (c === "Chandigarh") return;
    const [x, y] = P(D.cities[c]);
    const mx = (hub[0] + x) / 2 + (y - hub[1]) * .12, my = (hub[1] + y) / 2 - (x - hub[0]) * .12;
    mapMarkup += `<path class="spoke" data-city="${c}" d="M${hub[0]},${hub[1]} Q${mx},${my} ${x},${y}"/>`;
  });
  cityNames.forEach((c) => {
    const [x, y] = P(D.cities[c]);
    const n = cityCount[c] || 0;
    const side = labelSide[c] || "r";
    let tx = side === "l" ? x - 12 : side === "b" ? x : x + 12;
    let ty = side === "b" ? y + 22 : y + 4;
    const anchor = side === "l" ? "end" : side === "b" ? "middle" : "start";
    let leader = "";
    if (stacked[c]) {
      tx = 430; ty = stacked[c];
      leader = `<path class="leader" d="M${x + 4},${y} L${404},${ty - 4} L${424},${ty - 4}"/>`;
    }
    mapMarkup += `<g class="node${c === "Chandigarh" ? " is-hub" : ""}" data-city="${c}">
      ${c === "Chandigarh" ? `<circle class="pulse" cx="${x}" cy="${y}" r="10"/>` : ""}
      <circle class="halo" cx="${x}" cy="${y}" r="${5 + n * 2.6}"/>
      ${leader}<circle class="core" cx="${x}" cy="${y}" r="3.2"/>
      <text x="${tx}" y="${ty}" text-anchor="${anchor}">${c}</text></g>`;
  });
  svg.innerHTML = mapMarkup;

  const mapList = $("#mapList");
  const ranked = cityNames.slice().sort((a, b) => (cityCount[b] || 0) - (cityCount[a] || 0) || a.localeCompare(b));
  ranked.forEach((c, i) => {
    mapList.append(h("li", { "data-city": c }, `<span class="i">${dd(i + 1)}</span><span class="c">${c}</span><span class="n">${cityCount[c]} meetup${cityCount[c] > 1 ? "s" : ""}</span>`));
  });
  const lightCity = (c, on) => {
    $$(`[data-city="${c}"]`).forEach((n) => n.classList.toggle("is-on", on));
    const halo = $(`.node[data-city="${c}"] .halo`, svg);
    if (halo) halo.setAttribute("r", on ? 5 + (cityCount[c] || 0) * 2.6 + 6 : 5 + (cityCount[c] || 0) * 2.6);
    const sp = $(`.spoke[data-city="${c}"]`, svg);
    if (sp) sp.style.stroke = on ? "var(--gold)" : "";
  };
  [mapList, svg].forEach((root) => {
    root.addEventListener("mouseover", (e) => { const t = e.target.closest("[data-city]"); if (t) lightCity(t.dataset.city, true); });
    root.addEventListener("mouseout", (e) => { const t = e.target.closest("[data-city]"); if (t) lightCity(t.dataset.city, false); });
  });

  /* ---------- Cover ---------- */
  const ICONS = {
    Portfolio: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z"/></svg>`,
    LinkedIn: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>`,
    GitHub: `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg>`
  };
  const linkRow = (cls) => `<div class="${cls}">${D.credit.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${t} ↗</a>`).join("")}</div>`;
  $$("[data-count-inline]").forEach((n) => (n.textContent = counts[n.dataset.countInline]));

  // The council: every coordinator with a cut-out, in house order, turning like a slow carousel.
  // The one in the middle stands in colour with their name ringed around their head and their
  // house crest floating beside them; the rest wait in black and white on either side.
  const cast = D.houses.filter((hs) => hs.photo);
  const council = $("#council");
  const figs = cast.map((hs, i) => {
    const fig = h("figure", { class: "rc", "data-rc": i, "aria-label": `${hs.rc}, ${hs.name} House` },
      `<img class="rc__img" src="${hs.photo}" alt="${hs.rc}, Regional Coordinator, ${hs.name} House"><span class="rc__name">${hs.rc.split(" ")[0]}</span>`);
    council.append(fig);
    return fig;
  });
  // the nameplate answers "Region" on the other side of the masthead, well clear of every face
  $(".mast").insertAdjacentHTML("beforeend", `
    <div class="plate" aria-live="polite">
      <img class="plate__crest" alt="" aria-hidden="true">
      <div class="plate__txt">
        <span class="plate__k"><i id="stageNo"></i><em id="stageHouse"></em></span>
        <b class="plate__name" id="stageRc"></b>
        <div class="plate__links">${D.credit.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener">${ICONS[t] || ""}${t}</a>`).join("")}</div>
        <div class="plate__nav">
          <button data-step="-1" aria-label="Previous coordinator">←</button>
          <span class="plate__bar"><i></i></span>
          <button data-step="1" aria-label="Next coordinator">→</button>
        </div>
      </div>
    </div>`);
  const plate = $(".plate"), floatCrest = $(".plate__crest"), plateLinks = $(".plate__links");
  const motionOK = hasGsap && !reduced;
  let active = 0, geo = null, timer = null, paused = false, started = false;

  // slot for a circular distance d (positive = to the left of centre, so Kaziranga waits on the lead's left)
  const slot = (d) => {
    const phone = innerWidth <= 600, a = Math.abs(d), s = Math.sign(d);
    const xs = phone ? [0, .36, .52] : [0, .25, .385, .48, .56];
    const sc = phone ? [1, .52, .4] : [1, .7, .57, .48, .42];
    const max = xs.length - 1, k = Math.min(a, max);
    return { x: -s * xs[k] * geo.W, scale: sc[k], opacity: a >= max ? 0 : a > 1 && a === max - 1 ? .7 : 1, z: 30 - a * 2 };
  };
  const dist = (i, at = active) => { const n = cast.length; let d = ((i - at) % n + n) % n; if (d > n / 2) d -= n; return d; };
  const measure = () => {
    const r = council.getBoundingClientRect();
    geo = { W: r.width, H: r.height };
    figs.forEach((f) => {
      const im = $(".rc__img", f), hs = cast[+f.dataset.rc];
      const [cx, cy, hr] = hs.head || [.5, .3, .22];
      const w = geo.H * (im.naturalWidth / im.naturalHeight || .8);
      f._w = w; f._head = { x: cx * w, y: cy * geo.H, r: hr * w };
      // keep each face, not each photo, on the centre line
      f._dx = (.5 - cx) * w;
      const nm = $(".rc__name", f);
      nm.style.left = `${cx * 100}%`;
      nm.style.top = `${(cy * geo.H - hr * w * 1.55) / geo.H * 100}%`;
    });
  };
  const place = (f, d, how) => {
    const s = slot(d), x = s.x + f._dx * s.scale;
    f.style.zIndex = s.z;
    f.classList.toggle("is-near", Math.abs(d) >= 1 && s.opacity > 0);
    const to = { x, xPercent: -50, scale: s.scale, opacity: s.opacity, transformOrigin: "50% 100%" };
    if (!motionOK || how === "set") {
      if (hasGsap) gsap.set(f, to);
      else Object.assign(f.style, { transform: `translateX(-50%) translateX(${x}px) scale(${s.scale})`, opacity: s.opacity });
    } else if (how === "jump") {
      // crossing behind the stage would look wrong: fade out, reappear on the far side
      gsap.timeline().to(f, { opacity: 0, duration: .4, ease: "power2.in" }).set(f, { ...to, opacity: 0 }).to(f, { opacity: s.opacity, duration: .8, ease: "power2.out" }, "+=.3");
    } else gsap.to(f, { ...to, duration: 1.4, ease: "expo.inOut" });
  };
  const dress = () => {
    const hs = cast[active];
    floatCrest.src = `assets/houses/${hs.id}.webp`;
    plateLinks.hidden = !hs.featured;
    $("#stageNo").textContent = `${dd(active + 1)} / ${dd(cast.length)}`;
    $("#stageHouse").textContent = `${hs.name} House`;
    $("#stageRc").innerHTML = [...hs.rc].map((c) => `<span class="chw"><span class="ch">${c === " " ? "&nbsp;" : c}</span></span>`).join("");
    $$("#crests a").forEach((a) => a.classList.toggle("is-on", a.dataset.house === hs.id));
  };
  const reveal = () => {
    dress();
    if (!motionOK) { plate.style.opacity = 1; return; }
    gsap.set(plate, { opacity: 1 });
    gsap.fromTo("#stageRc .ch", { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: .03, ease: "expo.out" });
    gsap.fromTo([".plate__k", plateLinks], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .9, stagger: .1, ease: "expo.out" });
    gsap.fromTo(floatCrest, { opacity: 0, y: 40, rotate: -30, scale: .5 }, { opacity: 1, y: 0, rotate: 0, scale: 1, duration: 1.4, ease: "expo.out" });
  };
  const conceal = () => {
    if (!motionOK) return;
    gsap.to(floatCrest, { opacity: 0, y: -30, rotate: 25, duration: .35, ease: "power2.in" });
    gsap.to("#stageRc .ch", { yPercent: -110, duration: .4, stagger: .012, ease: "power2.in" });
    gsap.to([".plate__k", plateLinks], { opacity: 0, duration: .3 });
  };
  const DWELL = 5;
  const tick = () => {
    if (timer) timer.kill();
    if (!motionOK || cast.length < 2) return;
    const bar = $(".plate__bar i");
    timer = gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DWELL, ease: "none", paused, onComplete: () => go(active + 1) });
  };
  const go = (to) => {
    const n = cast.length, next = ((to % n) + n) % n;
    if (next === active && started) return tick();
    const prev = active;
    figs[prev].classList.remove("is-active");
    figs[next].classList.add("is-active");
    conceal();
    active = next;
    figs.forEach((f, i) => {
      const d0 = dist(i, prev), d1 = dist(i, next);
      place(f, d1, Math.abs(d1 - d0) > 1 ? "jump" : "move");
    });
    motionOK ? gsap.delayedCall(1.05, reveal) : reveal();
    tick();
  };
  let stageReady;
  const startStage = () => stageReady.then(() => {
    started = true;
    figs[active].classList.add("is-active");
    reveal();
    tick();
  });
  stageReady = Promise.all($$(".rc__img", council).map((im) => (im.complete ? 1 : new Promise((r) => (im.onload = im.onerror = r))))).then(() => {
    measure();
    figs.forEach((f, i) => place(f, dist(i), "set"));
    figs[active].classList.add("is-active");
    dress();
  });
  if (!motionOK) startStage();
  addEventListener("resize", () => {
    if (!geo) return;
    measure();
    figs.forEach((f, i) => place(f, dist(i), "set"));
    dress();
  });
  plate.addEventListener("click", (e) => { const nav = e.target.closest("[data-step]"); if (nav) go(active + +nav.dataset.step); });
  council.addEventListener("click", (e) => {
    const f = e.target.closest(".rc");
    if (f && !f.classList.contains("is-active")) go(+f.dataset.rc);
  });
  council.addEventListener("pointerenter", () => { paused = true; timer && timer.pause(); });
  council.addEventListener("pointerleave", () => { paused = false; timer && timer.resume(); });
  let sx = null;
  council.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  council.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 40) go(active + (dx > 0 ? 1 : -1));
  });
  // hold the carousel while the cover is off screen or the tab is hidden
  new IntersectionObserver(([en]) => { if (!timer) return; en.isIntersecting && !paused ? timer.resume() : timer.pause(); }).observe(council);
  document.addEventListener("visibilitychange", () => { if (timer) document.hidden ? timer.pause() : !paused && timer.resume(); });

  $("#crests").append(...D.houses.map((hs) => {
    const i = cast.indexOf(hs);
    const a = h("a", { href: "#houses", "data-house": hs.id, title: `${hs.name} House · ${hs.rc}`, "aria-label": `${hs.name} House` }, `<img src="assets/houses/${hs.id}.webp" alt="" width="34" height="34">`);
    if (i >= 0) a.addEventListener("click", (e) => { e.preventDefault(); go(i); });
    return a;
  }));
  $$(".foot__credit").forEach((n) => n.insertAdjacentHTML("beforeend", linkRow("foot__links")));

  // Chandigarh's sector plan, drawn behind the masthead; Sector 17, the city centre, is lit
  const plan = $("#plan");
  if (plan) {
    let g = `<g transform="rotate(-9 800 450)">`;
    const cw = 210, ch = 150;
    for (let x = -420; x <= 2000; x += cw) g += `<path class="road${x === 800 ? " road--main" : ""}" d="M${x} -400 V1300"/>`;
    for (let y = -300; y <= 1200; y += ch) g += `<path class="road${y === 450 ? " road--main" : ""}" d="M-500 ${y} H2100"/>`;
    let n = 1;
    for (let y = -300; y < 1200; y += ch) for (let x = -420; x < 2000; x += cw) {
      if (x === 800 && y === 150) g += `<rect class="sector" x="${x + 10}" y="${y + 10}" width="${cw - 20}" height="${ch - 20}"/><text x="${x + 18}" y="${y + 28}" style="fill:rgba(214,179,111,.7)">SECTOR 17</text>`;
      else if ((x + y) % 3 === 0) g += `<text x="${x + 14}" y="${y + 24}">${String(n).padStart(2, "0")}</text>`;
      n++;
    }
    plan.innerHTML = g + "</g>";
  }

  /* ---------- Houses ---------- */
  const crest = (hs) => `assets/houses/${hs.id}.webp`;
  const iconLinks = `<div class="house__links">${D.credit.links.map(([t, u]) => `<a href="${u}" target="_blank" rel="noopener" aria-label="${t}" title="${t}">${ICONS[t] || t}</a>`).join("")}</div>`;
  $("#housesGrid").append(...D.houses.map((hs) => {
    const media = hs.photo
      ? `<div class="house__stage"><img class="house__ghost" src="${crest(hs)}" alt="" aria-hidden="true"><img class="house__person" src="${hs.photo}" alt="${hs.rc}" loading="lazy"><img class="house__badge" src="${crest(hs)}" alt="${hs.name} House crest"></div>`
      : `<div class="house__stage house__stage--crest"><img class="house__crest" src="${crest(hs)}" alt="${hs.name} House crest" loading="lazy" width="320" height="320"></div>`;
    return h("article", { class: "house" + (hs.photo ? " has-photo" : "") + (hs.featured ? " is-first" : ""), style: `--tint:${hs.tint || "#d6b36f"}` },
      `${media}<div class="house__body"><div class="house__name">${hs.name}</div><div class="house__role">Regional Coordinator</div><div class="house__rc">${hs.rc}</div>${hs.featured ? iconLinks : ""}</div>`);
  }));

  /* ---------- The Wall ---------- */
  const all = D.meetups.flatMap((m, i) => Array.from({ length: m.photos }, (_, k) => [i, k + 1]));
  const ours = all.filter(([i]) => D.meetups[i].host === "Pichavaram");
  const rest = all.filter(([i]) => D.meetups[i].host !== "Pichavaram");
  const mixed = rest.map((x, i) => [x, (i * 7919) % rest.length]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
  // three rows; Pichavaram's photos open every row, then the rest is dealt round-robin
  const wallRows = [[], [], []];
  [...ours, ...mixed].forEach((x, k) => wallRows[k % 3].push(x));
  const marquee = $("#marquee");
  wallRows.forEach((set, r) => {
    const row = h("div", { class: "mq-row", "data-dir": r % 2 ? "1" : "-1", "data-speed": [.7, .55, .85][r] });
    const make = ([i, k], n, dup) => {
      const m = D.meetups[i], { m: mo, d } = parse(m.date);
      return h("button", { class: n % 5 === 2 ? "is-wide" : "", "data-i": i, "data-p": k, "data-cursor": "View", tabindex: dup ? "-1" : "0", "aria-hidden": dup ? "true" : false, "aria-label": `${m.city} photo` },
        `<img src="${photo(m, k)}" alt="" loading="lazy" decoding="async"><span class="mq-cap"><b>${m.city}</b>${dd(d)} ${MONTHS[mo - 1]}</span>`);
    };
    row.append(...set.map((x, n) => make(x, n, false)), ...set.map((x, n) => make(x, n, true)));
    marquee.append(row);
  });
  const wallCount = $("#wallCount");
  if (wallCount) wallCount.textContent = all.length;

  /* ---------- Lightbox ---------- */
  const lb = $("#lb"), lbImg = $("#lbImg");
  let cur = { i: 0, p: 1 }, lastFocus = null;
  const lbShow = () => {
    const m = D.meetups[cur.i];
    const { y, m: mo, d } = parse(m.date);
    lbImg.src = photo(m, cur.p, false);
    lbImg.alt = `${m.place}, ${m.city}, photo ${cur.p}`;
    $("#lbDate").textContent = `${dd(d)} ${MONTHS[mo - 1]} ${y} · ${m.kind}${m.no ? " · Meetup #" + m.no : ""}`;
    $("#lbTitle").textContent = `${m.city} — ${m.place}`;
    $("#lbNote").textContent = m.note;
    $("#lbCount").textContent = `${dd(cur.p)} / ${dd(m.photos)}`;
    $("#lbIg").hidden = !m.ig;
    if (m.ig) $("#lbIg").href = `https://www.instagram.com/p/${m.ig}/`;
    if (hasGsap && !reduced) gsap.fromTo(lbImg, { opacity: 0, scale: .98 }, { opacity: 1, scale: 1, duration: .5, ease: "expo.out" });
  };
  const lbOpen = (i, p = 1) => {
    cur = { i: +i, p: +p };
    lastFocus = document.activeElement;
    lb.hidden = false;
    lenis && lenis.stop();
    document.body.style.overflow = "hidden";
    lbShow();
    $("#lbClose").focus();
  };
  const lbClose = () => {
    lb.hidden = true;
    lenis && lenis.start();
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  };
  const step = (dir) => {
    const N = D.meetups.length;
    cur.p += dir;
    if (cur.p > D.meetups[cur.i].photos) {
      do cur.i = (cur.i + 1) % N; while (!D.meetups[cur.i].photos);
      cur.p = 1;
    }
    if (cur.p < 1) {
      do cur.i = (cur.i - 1 + N) % N; while (!D.meetups[cur.i].photos);
      cur.p = D.meetups[cur.i].photos;
    }
    lbShow();
  };
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-i]");
    if (t && !t.closest(".lb")) lbOpen(t.dataset.i, t.dataset.p || 1);
  });
  $("#lbClose").addEventListener("click", lbClose);
  $("#lbPrev").addEventListener("click", () => step(-1));
  $("#lbNext").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb__fig")) lbClose(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") lbClose();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  let tx0 = null;
  lb.addEventListener("touchstart", (e) => (tx0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (tx0 == null) return;
    const dx = e.changedTouches[0].clientX - tx0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    tx0 = null;
  });

  /* ---------- Index menu + section rail ---------- */
  const menuBtn = $("#menuBtn"), menu = $("#menu");
  const setMenu = (open) => {
    document.documentElement.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.querySelector(".menu-btn__txt").textContent = open ? "Close" : "Index";
    menu.hidden = false;
    if (open) { lenis && lenis.stop(); } else { lenis && lenis.start(); }
  };
  menuBtn.addEventListener("click", () => setMenu(!document.documentElement.classList.contains("menu-open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.documentElement.classList.contains("menu-open")) setMenu(false); });

  const rail = $(".rail");
  const railLinks = $$("a[data-sec]", rail);
  const setActive = (id) => railLinks.forEach((a) => a.classList.toggle("is-active", a.dataset.sec === id));
  const secMap = { hero: "hero", reel: "hero", story: "story", meetups: "meetups", spotlight: "meetups", nights: "nights", map: "map", houses: "houses", gallery: "gallery" };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) setActive(secMap[en.target.id]); });
  }, { rootMargin: "-45% 0px -50% 0px" });
  Object.keys(secMap).forEach((id) => { const s = document.getElementById(id); s && io.observe(s); });

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (!reduced && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented) return;
    const target = document.querySelector(a.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: a.getAttribute("href") === "#hero" ? 0 : -20, duration: 1.6 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  });

  /* ---------- Header hide on scroll ---------- */
  const top = $("#top");
  let lastY = 0;
  const onScroll = (y) => {
    top.classList.toggle("is-hidden", y > innerHeight * .8 && y > lastY);
    top.classList.toggle("is-scrolled", y > 60);
    rail.classList.toggle("is-on", y > innerHeight * .6);
    lastY = y;
  };
  if (lenis) lenis.on("scroll", ({ scroll }) => onScroll(scroll));
  else addEventListener("scroll", () => onScroll(scrollY), { passive: true });

  /* ---------- Cursor ---------- */
  const cursor = $(".cursor");
  if (matchMedia("(pointer: fine)").matches && !reduced) {
    const label = $(".cursor__label", cursor);
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; cursor.classList.add("is-on"); }, { passive: true });
    document.addEventListener("pointerleave", () => cursor.classList.remove("is-on"));
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      cursor.classList.toggle("is-big", !!(t && t.dataset.cursor));
      label.textContent = t ? t.dataset.cursor : "";
    });
    const loop = () => {
      cx += (mx - cx) * .2; cy += (my - cy) * .2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Wall motion: always drifting, faster and skewed while you scroll ---------- */
  const rows = $$(".mq-row");
  if (!reduced) {
    const state = rows.map((r) => ({ r, x: 0, dir: +r.dataset.dir, base: +r.dataset.speed, speed: +r.dataset.speed, target: +r.dataset.speed }));
    rows.forEach((r, k) => {
      r.addEventListener("pointerenter", () => (state[k].target = .08));
      r.addEventListener("pointerleave", () => (state[k].target = state[k].base));
    });
    let boost = 0, skew = 0, visible = true;
    if (lenis) lenis.on("scroll", ({ velocity }) => (boost = Math.max(-6, Math.min(velocity * .35, 6))));
    new IntersectionObserver(([en]) => (visible = en.isIntersecting), { rootMargin: "200px" }).observe(marquee);
    const tick = () => {
      if (visible) {
        skew += (boost * .6 - skew) * .1;
        state.forEach((s) => {
          s.speed += (s.target - s.speed) * .08;
          const w = s.r.scrollWidth / 2;
          s.x += (s.speed + Math.abs(boost)) * s.dir;
          if (s.x <= -w) s.x += w;
          if (s.x >= 0) s.x -= w;
          s.r.style.transform = `translate3d(${s.x}px,0,0) skewX(${-skew * s.dir}deg)`;
        });
      }
      boost *= .92;
      requestAnimationFrame(tick);
    };
    state.forEach((s) => { if (s.dir > 0) s.x = -s.r.scrollWidth / 4; });
    tick();
  }

  /* ---------- Text splitting ---------- */
  $$("[data-split]").forEach((el) => {
    const txt = el.textContent;
    el.textContent = "";
    [...txt].forEach((c) => {
      const w = h("span", { class: "chw" });
      w.append(h("span", { class: "ch" }, c === " " ? "&nbsp;" : c));
      el.append(w);
    });
  });
  $$("[data-reveal]").forEach((el) => {
    const parts = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = parts.map((p) => `<span class="ln"><span>${p}</span></span>`).join("");
  });
  $$("[data-words]").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
  });

  /* ---------- Motion ---------- */
  const loader = $("#loader");
  if (reduced || !hasGsap) {
    loader && loader.remove();
    $$(".statement .w").forEach((w) => (w.style.opacity = 1));
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add("is-loading");
  lenis && lenis.stop();

  // Cover starting state: header parts fade in on their own (a transform on .top would trap fixed children)
  gsap.set(".mast__word .ch", { yPercent: 115 });
  gsap.set(".mast__region .ch", { yPercent: 115 });
  gsap.set([".cover__kicker", ".cover__bar"], { opacity: 0, y: 18 });
  gsap.set(".rc__img", { yPercent: 24, opacity: 0 });
  gsap.set(".cover__plan", { opacity: 0, scale: 1.08 });
  gsap.set([".brand", ".top__right"], { opacity: 0 });

  // The middle coordinator rises first, the rest follow outwards
  const rcs = $$(".rc");
  const intro = () => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    tl.to(".cover__plan", { opacity: 1, scale: 1, duration: 2.6, ease: "power2.out" }, 0)
      .to(".mast__word .ch", { yPercent: 0, duration: 1.5, stagger: .045 }, .1)
      .to(".mast__region .ch", { yPercent: 0, duration: 1.2, stagger: .05 }, .55)
      .to(".cover__kicker", { opacity: 1, y: 0, duration: 1.2 }, .4)
      .to(rcs.map((f) => $(".rc__img", f)), { yPercent: 0, opacity: 1, duration: 1.7, stagger: (i) => Math.abs(dist(i)) * .14 }, .6)
      .add(startStage, 1.7)
      .to([".brand", ".top__right"], { opacity: 1, duration: 1.2, stagger: .08, clearProps: "opacity" }, 1)
      .to(".cover__bar", { opacity: 1, y: 0, duration: 1.1 }, 1.3);
  };

  // Loader: count to 100 while the lead portrait and fonts settle
  const countEl = $("#loaderCount");
  const ready = Promise.all([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    stageReady
  ]);
  const prog = { v: 0 };
  gsap.to(".loader__seal circle", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" });
  gsap.to(prog, {
    v: 100, duration: 1.5, ease: "power2.inOut",
    onUpdate: () => (countEl.textContent = String(Math.round(prog.v)).padStart(3, "0")),
    onComplete: () => ready.then(() => {
      gsap.to(loader, {
        clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut",
        onComplete: () => { loader.remove(); document.body.classList.remove("is-loading"); lenis && lenis.start(); ScrollTrigger.refresh(); }
      });
      gsap.delayedCall(.45, intro);
    })
  });
  gsap.set(loader, { clipPath: "inset(0 0 0% 0)" });

  // Leaving the cover: the masthead drifts up behind the council, which sinks slightly (depth)
  const coverST = { trigger: "#hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to(".cover__head", { yPercent: -18, opacity: .35, ease: "none", scrollTrigger: coverST });
  gsap.to(".council", { y: 70, ease: "none", scrollTrigger: coverST });
  gsap.to(".cover__plan", { yPercent: 10, ease: "none", scrollTrigger: coverST });

  // The reel opens from a framed print to full bleed
  gsap.fromTo(".reel__frame", { clipPath: "inset(8% 16% 8% 16% round 28px)" }, {
    clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
    scrollTrigger: { trigger: "#reel", start: "top 85%", end: "center 55%", scrub: true }
  });
  gsap.fromTo(".reel__frame img", { yPercent: -12 }, {
    yPercent: 0, ease: "none", scrollTrigger: { trigger: "#reel", start: "top bottom", end: "bottom top", scrub: true }
  });

  // Statement lights up word by word
  gsap.to(".statement .w", {
    opacity: 1, stagger: .5, ease: "none",
    scrollTrigger: { trigger: ".statement", start: "top 80%", end: "bottom 45%", scrub: true }
  });

  // Count-up numbers
  $$("[data-count]").forEach((n) => {
    const end = +n.dataset.count, o = { v: 0 };
    n.textContent = "0";
    ScrollTrigger.create({
      trigger: n, start: "top 88%", once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: "expo.out", onUpdate: () => (n.textContent = Math.round(o.v)) })
    });
  });

  // Section titles rise line by line
  $$("[data-reveal]").forEach((el) => {
    gsap.from($$(".ln > span", el), {
      yPercent: 105, duration: 1.4, stagger: .1, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 85%" }
    });
  });
  $$(".sec-lede, .sec-head .eyebrow, .chips").forEach((el) => {
    gsap.from(el, { opacity: 0, y: 24, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%" } });
  });

  // Cards: unmask from below
  ScrollTrigger.batch(".mcard, .house, .otile, .prow, .night, .map__list li", {
    start: "top 92%",
    onEnter: (els) => gsap.fromTo(els, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: .06, ease: "expo.out", overwrite: true })
  });
  gsap.set(".mcard, .house, .otile, .prow, .night, .map__list li", { opacity: 0 });

  // Spotlight rail drifts sideways as the section passes
  const spotRail = $("#spotRail");
  gsap.fromTo(spotRail, { x: () => innerWidth * .15 }, {
    x: () => -(spotRail.scrollWidth - innerWidth * .85), ease: "none",
    scrollTrigger: { trigger: ".spot", start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
  });
  gsap.from(".spot__title span, .spot__title em", { yPercent: 60, opacity: 0, duration: 1.5, stagger: .12, ease: "expo.out", scrollTrigger: { trigger: ".spot__title", start: "top 85%" } });
  gsap.from(".spot__cities span", { opacity: 0, y: 12, duration: .9, stagger: .06, ease: "expo.out", scrollTrigger: { trigger: ".spot__cities", start: "top 90%" } });

  // Map draws itself
  const spokes = $$(".spoke", svg);
  spokes.forEach((p) => { const L = p.getTotalLength(); p.style.strokeDasharray = `${L}`; p.style.strokeDashoffset = `${L}`; });
  gsap.set($$(".node", svg), { opacity: 0, scale: .4, transformOrigin: "center", transformBox: "fill-box" });
  ScrollTrigger.create({
    trigger: svg, start: "top 75%", once: true,
    onEnter: () => {
      gsap.to($$(".node", svg), { opacity: 1, scale: 1, duration: 1, stagger: .05, ease: "expo.out" });
      gsap.to(spokes, {
        strokeDashoffset: 0, duration: 1.6, stagger: .05, ease: "power2.inOut",
        onComplete: () => spokes.forEach((p) => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; })
      });
    }
  });

  // Footer wordmark slides up
  gsap.from(".foot__mark", { yPercent: 40, opacity: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".foot", start: "top 85%" } });

  addEventListener("load", () => ScrollTrigger.refresh());
})();
