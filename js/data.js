/* Chandigarh Region Showcase — all content lives here.
   Edit this file to add videos, house photos or new meetups; the page builds itself from it. */
window.CRS = {
  tenure: "2024 — 26",
  credit: {
    name: "Angad Jangir", role: "Regional Coordinator · Pichavaram House", org: "IIT Madras", url: "https://angad-jangir.vercel.app",
    links: [
      ["Portfolio", "https://angad-jangir.vercel.app"],
      ["LinkedIn", "https://www.linkedin.com/in/angad-jangir-23306231b"],
      ["GitHub", "https://github.com/angadseth"]
    ]
  },

  // Region map: lat / lon for every meetup city
  cities: {
    Jammu: [32.73, 74.86], Amritsar: [31.63, 74.87], Chandigarh: [30.73, 76.78],
    Dehradun: [30.32, 78.03], Rishikesh: [30.09, 78.27], Haridwar: [29.95, 78.16], Roorkee: [29.87, 77.89],
    Haldwani: [29.22, 79.51], Sirsa: [29.53, 75.03], Hisar: [29.15, 75.72], Rohtak: [28.9, 76.61],
    Sikar: [27.61, 75.14], Jaipur: [26.91, 75.79], Kota: [25.21, 75.86], Bhilwara: [25.35, 74.63],
    Udaipur: [24.58, 73.71], Indore: [22.72, 75.86], Bhopal: [23.26, 77.41], Satna: [24.6, 80.83]
  },
  states: 7,

  // Meetups, by date; inside a day Pichavaram's come first, then Kaziranga's.
  // photos = files assets/meetups/<file or ig>-<n>.webp ; no = meetup number from the region tracker
  meetups: [
    { date: "2026-08-09", place: "Amar Mahal", city: "Jammu", kind: "Heritage", ig: "DcYhNLlCZP8", photos: 3, no: 713,
      note: "Faces finally met names, inside the palace grounds of Amar Mahal." },
    { date: "2026-08-09", place: "OHM Mall", city: "Sirsa", kind: "Mall", ig: "DcO34kmk2xY", photos: 3, no: 714,
      note: "Long conversations and new friends, all afternoon in Sirsa." },
    { date: "2026-08-09", place: "Third Space", city: "Udaipur", kind: "Sports", ig: "DcO45zUEzpH", photos: 4, no: 715,
      note: "Wall climbing, Othello and a lot of laughter at Third Space." },
    { date: "2026-08-09", place: "Mr Bean's Pizza", city: "Kota", kind: "Café", ig: "DcVJHNPkjoG", photos: 4, no: 719,
      note: "From assignments and deadlines to real laughs over pizza." },
    { date: "2026-08-16", place: "Manav Sangrahalaya", city: "Bhopal", kind: "Heritage", ig: "Dca5WJqDNra", photos: 4, no: 750,
      note: "A walk through the open-air museum of humankind on the Shamla hills." },
    { date: "2026-08-23", place: "Rock Garden", city: "Chandigarh", kind: "Heritage", ig: "Dcc_4bSCQAn", photos: 4, no: 753,
      note: "An unplugged afternoon picnic at Nek Chand's Rock Garden." },
    { date: "2026-08-23", place: "Firangi Eats", city: "Hisar", kind: "Café", ig: "DckuMTtkY9Y", photos: 4, no: 752,
      note: "Peer learning, networking and great food, with students from many houses." },
    { date: "2026-08-23", place: "Nahargarh Fort", city: "Jaipur", kind: "Heritage", ig: "Dcbc4nmEv61", photos: 3, no: 755,
      note: "Forts, culture and slow conversations high above the Pink City." },
    { date: "2026-08-25", place: "Koffee Smith", city: "Amritsar", kind: "Café", ig: "Dc0-SDGCfIY", photos: 4, no: 749,
      note: "Meeting the people behind the names, over coffee in Amritsar." },
    { date: "2026-09-13", place: "Exam Centre", city: "Udaipur", kind: "Exam Centre", ig: "DdUgflPk8Jj", photos: 3, no: 770,
      note: "The City of Lakes, the moment the end-term papers were handed in." },
    { date: "2026-09-13", place: "Exam Centre", city: "Satna", kind: "Exam Centre", ig: "Dda0SSXIL42", photos: 3, no: 792,
      note: "Satna's own get-together, straight out of the exam hall." },
    { date: "2026-09-13", place: "Exam Centre", city: "Bhopal", kind: "Exam Centre", ig: "DejiXRZjs-C", photos: 4, no: 766,
      note: "From the exam hall to the pickleball court, then on to DB Mall." },
    { date: "2026-09-13", place: "Spartans Cafeteria", city: "Haldwani", kind: "Exam Centre", ig: "Ddd9ekgCQB1", photos: 4, no: 789,
      note: "On hold for almost two years. It finally happened." },
    { date: "2026-09-20", place: "Jantar Mantar", city: "Jaipur", kind: "Heritage", ig: "DdnzFxjj2nl", photos: 4, no: 765, s2: true, host: "Pichavaram",
      note: "Strangers turned familiar among the stone instruments of Jantar Mantar." },
    { date: "2026-09-20", place: "Oxford Street, Zirakpur", city: "Chandigarh", kind: "Mall", ig: "Ddo-pW2ku9T", photos: 4, no: 773, s2: true,
      note: "One table, dozens of conversations, plenty of chai." },
    { date: "2026-09-20", place: "PLA Shopping Complex", city: "Hisar", kind: "Mall", ig: "Dd0vGxcEVWM", photos: 4, no: 768, s2: true,
      note: "Hot chai, good food and a drizzle of rain." },
    { date: "2026-09-20", place: "Seven Wonders Park", city: "Kota", kind: "Heritage", ig: "Ddt3oGaEvWF", photos: 3, no: 772, s2: true,
      note: "A cup of chai, a little rain, and strangers became friends." },
    { date: "2026-09-20", place: "Bite on Budget", city: "Rohtak", kind: "Café", ig: "Dd0wwDvEbJm", photos: 3, no: 788, s2: true,
      note: "Warm chai, pleasant weather and conversations that would not end." },
    { date: "2026-09-20", place: "Reliance Mall", city: "Bhilwara", kind: "Mall", ig: "DeERptwk26x", photos: 3, no: 767, s2: true, first: true,
      note: "The IITM BS community in Bhilwara, for the very first time." },
    { date: "2026-09-20", place: "Malhar Mall", city: "Indore", kind: "Mall", ig: "Ddv8TGaD4Av", photos: 4, no: 827, s2: true,
      note: "Indore's September gathering, in the heart of the city." },
    { date: "2026-09-20", place: "Hungry Oven Café", city: "Haridwar", kind: "Café", ig: "DdrXyU2Ez33", photos: 3, no: 771, s2: true,
      note: "A much-needed screen break, with great food." },
    { date: "2026-09-27", place: "Pahlwan's Food Mall", city: "Jammu", kind: "Café", ig: "DeTKF-ikoB2", photos: 3, no: 769,
      note: "Meet. Connect. Grow. Jammu, round two." },
    { date: "2026-09-27", place: "Amber Fort", city: "Jaipur", kind: "Heritage", ig: "Dd1bq2HnQfk", photos: 4, no: 816,
      note: "Amber Fort, Sagar Lake and Jagat Shiromani temple, all in one day." },
    { date: "2026-09-27", place: "OM Fast Food", city: "Haridwar", kind: "Café", ig: "Dd9xcw0FAxW", photos: 4, no: 839,
      note: "It was meant to be a quick meetup. It became a whole photo dump." },
    { date: "2026-09-27", place: "Maheshwar Fort", city: "Indore", kind: "Heritage", ig: "Dd_1lurHU93", photos: 4, no: 817,
      note: "Maheshwar Fort and the Narmada ghats: the Indore Escape." },
    { date: "2026-10-02", place: "Roorkee Edition", city: "Roorkee", kind: "Café", ig: "DeT5iQXki-R", photos: 2, no: 824,
      note: "Chai, Baarish aur Baatcheet reached Roorkee: hours of talk over chai and pizza." },
    { date: "2026-10-04", place: "Rani Sati Mandir", city: "Sikar", kind: "Heritage", ig: "DeOjwLvjxKM", photos: 8, no: 842, first: true, host: "Pichavaram",
      note: "The first IITM BS meetup Sikar has ever had: a temple, a stepwell, a museum, and a lot of pizza." },
    { date: "2026-10-04", place: "FRI Campus", city: "Dehradun", kind: "Heritage", ig: "DeYjDgYEkKy", photos: 3, no: 787,
      note: "Red-brick arches, a long lunch and a lot of selfies in Dehradun." },
    { date: "2026-10-06", place: "Lakshman Jhula", city: "Rishikesh", kind: "Heritage", ig: "Deb-NRiHWOx", photos: 4, no: 838,
      note: "A girls-only getaway: mountain views, riverside evenings and new friends." },
    { date: "2026-10-10", place: "Albert Hall Museum", city: "Jaipur", kind: "Heritage", file: "albert-hall", photos: 1, host: "Pichavaram",
      note: "A photowalk around Albert Hall Museum with the Iris Society: cameras out, all afternoon." },
    { date: "2026-10-16", place: "Meetup #847", city: "Indore", kind: "Café", photos: 0, no: 847,
      note: "Photos on their way." },
    { date: "2026-10-17", place: "Meetup #851", city: "Jaipur", kind: "Café", photos: 0, no: 851,
      note: "Photos on their way." }
  ],

  sessions: [
    { date: "2026-07-26", time: "6:00 – 8:00 PM", title: "Regional Orientation", sub: "Welcome to the May term", type: "Region" },
    { date: "2026-08-14", time: "8:00 – 10:00 PM", title: "Quiz 2 Revision", sub: "Doubts cleared before Quiz 2", type: "Academic" },
    { date: "2026-08-28", time: "9:00 – 11:30 PM", title: "Movie Night", sub: "Popcorn, a big screen, and the whole region", type: "Night" },
    { date: "2026-08-29", time: "9:00 – 11:30 PM", title: "Game Night", sub: "Rounds, rivalries and late-night laughter", type: "Night" },
    { date: "2026-08-31", time: "8:00 – 10:00 PM", title: "August Monthly Session", sub: "Region updates and open floor", type: "Region" },
    { date: "2026-09-10", time: "8:00 – 10:00 PM", title: "End-Term Revision", sub: "One last push before the finals", type: "Academic" },
    { date: "2026-09-22", time: "7:30 – 9:30 PM", title: "Term Feedback", sub: "What worked, and what comes next", type: "Region" }
  ],

  online: [
    { date: "08 Aug", title: "BGMI Tournament", sub: "Squads, brackets and match nights", tag: "eSports" },
    { date: "08 Aug", title: "Mehfil", sub: "An evening of poetry and shayari", tag: "Cultural" },
    { date: "09 Aug", title: "ABCD", sub: "Anybody Can Debate", tag: "Debate" },
    { date: "24–27 Sep", title: "Saavan '26", sub: "The region at the IITM BS fest", tag: "Fest" }
  ],

  // Add YouTube links here: { title: "Game Night", url: "https://youtu.be/..." }
  videos: [],

  // Order is the order on the page. photo = transparent cut-out in assets/people/; tint = backdrop colour.
  houses: [
    { id: "pichavaram", name: "Pichavaram", rc: "Angad Jangir", photo: "assets/people/angad.webp", head: [0.367, 0.325, 0.33], tint: "#c9a24e", featured: true,
      line: "Designed and built this showcase. Hosted the region's first-ever Sikar meetup, Jantar Mantar and the Albert Hall photowalk." },
    { id: "kaziranga", name: "Kaziranga", rc: "Abhimanyu Kumar Patel", photo: "assets/people/abhimanyu.webp", head: [0.374, 0.293, 0.19], tint: "#2a7a5c" },
    { id: "sundarbans", name: "Sundarbans", rc: "Prashansa Uniyal", photo: null, tint: "#c8873a" },
    { id: "nallamala", name: "Nallamala", rc: "Akshi", photo: null, tint: "#8a5a7a" },
    { id: "bandipur", name: "Bandipur", rc: "Jiyaa", photo: "assets/people/bandipur.webp", head: [0.503, 0.4, 0.17], tint: "#3b7fc4" },
    { id: "kanha", name: "Kanha", rc: "Manisha", photo: null, tint: "#c47a4a" },
    { id: "namdapha", name: "Namdapha", rc: "Himanshu", photo: "assets/people/himanshu.webp", head: [0.491, 0.293, 0.234], tint: "#7b3fe0" },
    { id: "corbett", name: "Corbett", rc: "Khush Agrawal", photo: "assets/people/corbett.webp", head: [0.535, 0.296, 0.206], tint: "#c39a2e" },
    { id: "wayanad", name: "Wayanad", rc: "Sagar Rathore", photo: null, tint: "#2f95b8" },
    { id: "saranda", name: "Saranda", rc: "Vishal Salvi", photo: "assets/people/saranda.webp", head: [0.457, 0.31, 0.2], tint: "#a88a4a" }
  ]
};
