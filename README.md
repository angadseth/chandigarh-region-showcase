# Chandigarh Region Showcase

What the Chandigarh Region of the IIT Madras BS Degree did this tenure: 32 offline meetups across 19 cities, the region's nights and sessions, and the ten houses that made it happen.

**Live:** https://angadseth.github.io/chandigarh-region-showcase/

## What's inside

- **Cover**: a magazine masthead over Chandigarh's sector plan, with the region's coordinators standing in front of it
- **Reel**: the first-ever Sikar meetup, opening from a framed print to full bleed
- **Meetups** grouped by date, filterable by kind, each opening a photo lightbox with a link to the original post
- **Spotlight** on *Chai, Baarish aur Baatcheet* Season 2: eight cities on one Sunday
- **Nights & Sessions**: Movie Night, Game Night and the full region programme
- **Map** of all nineteen meetup cities, drawn from Chandigarh outwards
- **Houses**: Pichavaram featured, then all ten crests with their Regional Coordinators
- **The Wall**: every photo, on a slow two-row marquee

## Editing content

Everything on the page comes from [`js/data.js`](js/data.js):

- Add a YouTube recording: push `{ title: "Game Night", url: "https://youtu.be/…" }` into `videos` and the Recordings block appears.
- Add a coordinator's photo: drop a WebP into `assets/people/` and set `photo` on that house. Coordinators with a photo join the cover lineup automatically.
- Add a meetup: add an entry to `meetups`, then run `python scripts/fetch_instagram.py <post-id>` to pull its photos. A meetup with `photos: 0` shows as a "photos coming" card.

## Stack

Plain HTML, CSS and JavaScript. No build step. [GSAP](https://gsap.com) + ScrollTrigger for motion, [Lenis](https://lenis.darkroom.engineering) for smooth scroll. Type is Instrument Serif, Geist and Geist Mono.

Run it locally with any static server:

```sh
python -m http.server 8800
```

---

Designed and built by **Angad Jangir**, Regional Coordinator, Pichavaram House, IIT Madras · [Portfolio](https://angad-jangir.vercel.app) · [LinkedIn](https://www.linkedin.com/in/angad-jangir-23306231b) · [GitHub](https://github.com/angadseth)
