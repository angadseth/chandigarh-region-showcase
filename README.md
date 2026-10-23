# Chandigarh Region Showcase

What the Chandigarh Region of the IIT Madras BS Degree did this tenure: 32 offline meetups across 19 cities, the region's nights and sessions, and the ten houses that made it happen.

**Live:** https://angadseth.github.io/chandigarh-region-showcase/

## What's inside

- **Cover**: a magazine masthead over Chandigarh's sector plan; the coordinators turn like a slow carousel, one in colour at the centre every five seconds, with their name and house crest on a nameplate beside the masthead
- **Reel**: landmarks of the cities the region met in, dissolving one into the next, opening from a framed print to full bleed
- **Meetups** grouped by date, filterable by kind, each opening a photo lightbox with a link to the original post
- **Spotlight** on *Chai, Baarish aur Baatcheet* Season 2: eight cities on one Sunday
- **Nights & Sessions**: Movie Night, Game Night and the full region programme
- **Map** of all nineteen meetup cities, drawn from Chandigarh outwards
- **Houses**: all ten crests with their Regional Coordinators, Pichavaram first; houses still waiting on a photo come last
- **The Wall**: every photo, on a slow two-row marquee

## Editing content

Everything on the page comes from [`js/data.js`](js/data.js):

- Add a YouTube recording: push `{ title: "Game Night", url: "https://youtu.be/…" }` into `videos` and the Recordings block appears.
- Add a coordinator's photo: `python scripts/cutout.py <photo> <house-id>` writes the cut-out to `assets/people/`; `python scripts/head.py` prints where the head is. Set `photo` and `head` on that house and they join the cover carousel.
- Change the reel's landmarks: edit the list in `scripts/fetch_monuments.py`, run it, and copy the credits it prints into `monuments`.
- Add a meetup: add an entry to `meetups`, then run `python scripts/fetch_instagram.py <post-id>` to pull its photos. A meetup with `photos: 0` shows as a "photos coming" card.

## Photo credits

Landmark photos in the reel are from Wikimedia Commons:

- [Open Hand Monument, Chandigarh](https://commons.wikimedia.org/wiki/File:Open_Hand_monument,_Chandigarh.jpg) by Raakesh Blokhra, CC BY-SA 2.0
- [Hawa Mahal, Jaipur](https://commons.wikimedia.org/wiki/File:East_facade_Hawa_Mahal_Jaipur_from_ground_level_(July_2022)_-_img_01.jpg) by Chainwit., CC BY-SA 4.0
- [Harmandir Sahib, Amritsar](https://commons.wikimedia.org/wiki/File:Hamandir_Sahib_(Golden_Temple).jpg) by Oleg Yunakov, CC BY-SA 3.0
- [City Palace, Udaipur](https://commons.wikimedia.org/wiki/File:City_Palace_Udaipur_Rajasthan_India.JPG) by Hirumon, CC BY 3.0
- [Albert Hall Museum, Jaipur](https://commons.wikimedia.org/wiki/File:Albert_Hall_(Museum).JPG) by chetan, CC BY-SA 3.0
- [Lakshman Jhula, Rishikesh](https://commons.wikimedia.org/wiki/File:Lakshman_Jhula_Bridge_-_Hrishikesh_-_Uttarakhand_001.jpg) by Snehrashmi, CC BY-SA 4.0
- [Jantar Mantar, Jaipur](https://commons.wikimedia.org/wiki/File:Doors_of_Jantar_Mantar.jpg) by Sudipta Maulik, CC BY-SA 4.0

## Stack

Plain HTML, CSS and JavaScript. No build step. [GSAP](https://gsap.com) + ScrollTrigger for motion, [Lenis](https://lenis.darkroom.engineering) for smooth scroll. Type is Instrument Serif, Geist and Geist Mono.

After changing CSS or JS, bump the `?v=` on their links in `index.html` so browsers fetch the new files.

Run it locally with any static server:

```sh
python -m http.server 8800
```

---

Designed and built by **Angad Jangir**, Regional Coordinator, Pichavaram House, IIT Madras · [Portfolio](https://angad-jangir.vercel.app) · [LinkedIn](https://www.linkedin.com/in/angad-jangir-23306231b) · [GitHub](https://github.com/angadseth)
