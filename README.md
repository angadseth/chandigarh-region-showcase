# Chandigarh Region Showcase

What the Chandigarh Region of the IIT Madras BS Degree did this tenure: 25 offline meetups across 15 cities, the region's nights and sessions, and the ten houses that made it happen.

**Live:** https://angadseth.github.io/chandigarh-region-showcase/

## What's inside

- **Hero** with a spotlit wordmark and a stage photo that flattens as you scroll
- **Meetups** grouped by date, filterable by kind, each opening a photo lightbox with a link to the original post
- **Spotlight** on *Chai, Baarish aur Baatcheet* Season 2: eight cities on one Sunday
- **Nights & Sessions**: Movie Night, Game Night and the full region programme
- **Map** of all fifteen meetup cities, drawn from Chandigarh outwards
- **Houses**: all ten crests with their Regional Coordinators
- **The Wall**: every photo, on a slow two-row marquee

## Editing content

Everything on the page comes from [`js/data.js`](js/data.js):

- Add a YouTube recording: push `{ title: "Game Night", url: "https://youtu.be/…" }` into `videos` and the Recordings block appears.
- Add a coordinator's photo: drop a WebP into `assets/people/` and set `photo` on that house.
- Add a meetup: add an entry to `meetups`, then run `python scripts/fetch_instagram.py <post-id>` to pull its photos.

## Stack

Plain HTML, CSS and JavaScript. No build step. [GSAP](https://gsap.com) + ScrollTrigger for motion, [Lenis](https://lenis.darkroom.engineering) for smooth scroll. Type is Instrument Serif, Geist and Geist Mono.

Run it locally with any static server:

```sh
python -m http.server 8800
```

---

Designed and built by **Angad Jangir**, IIT Madras.
