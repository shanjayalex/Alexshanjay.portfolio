// ─────────────────────────────────────────────────────────────
// All site content lives here. Components never hard-code text,
// links or video IDs. To add a video, paste its YouTube ID (or the
// full youtu.be / youtube.com link) into `videos` or `shorts`.
// Anything marked [EDIT] still needs a real detail before launch.
// ─────────────────────────────────────────────────────────────

export const site = {
  url: "https://www.alexshanjay.live/",
  title: "Alex Shanjay — Video Editor & Graphic Designer | AX.Visuals, Sri Lanka",
  description:
    "Alex Shanjay is a video editor and graphic designer from Jaffna, Sri Lanka, and founder of AX.Visuals. Cinematic edits, Shorts & Reels, motion graphics, colour grading and social design.",
  ogImage: "/og.jpg",
  updated: "2026",
  lastmod: "2026-10-02", // sitemap date — bump when content changes
  locale: "en_LK",
  geo: { region: "LK-41", placename: "Jaffna" },
  // Summary shown to AI answer engines (rendered in About + JSON-LD).
  summary:
    "Alex Shanjay is a video editor and graphic designer based in Jaffna, Sri Lanka, and the founder of AX.Visuals.",
  summaryMore:
    "He creates cinematic edits, Instagram Reels and YouTube Shorts, motion graphics, colour grading and social-media design for restaurants, hotels, salons, retail brands, product businesses and creators — islandwide in Sri Lanka and remotely worldwide.",
  knowsAbout: ["Video editing", "Instagram Reels", "YouTube Shorts", "Motion graphics", "Colour grading", "Graphic design", "Social media content"],
};

export const profile = {
  name: "Alex Shanjay",
  fullName: "Alexmathanraj Shanjay",
  title: "Video Editor & Graphic Designer",
  role: "Founder, AX.Visuals",
  location: "Jaffna, Sri Lanka",
  locationLong: "Manipay, Jaffna, Sri Lanka",
  availability: "Available for remote editing worldwide.",
  email: "shanjayalex09@gmail.com",
  phone: "+94 76 401 5423",
  whatsapp: "https://wa.me/94764015423",
  photo: "/images/photo.png",
  bio: "Creative video editor and graphic designer with a strong background in software engineering. I turn raw footage and rough ideas into polished, story-driven visuals — motion graphics, colour grading, branding, and content that actually gets watched.",
  timezone: "Asia/Colombo",
};

// `href: null` hides the link until it's filled in.
export const socials = [
  { label: "Instagram", handle: "@shanjay.visuals", href: "https://www.instagram.com/shanjay.visuals" },
  { label: "YouTube", handle: "@AlexShan-f1t", href: "https://www.youtube.com/@AlexShan-f1t" },
  { label: "LinkedIn", handle: "Alex Shanjay", href: "https://www.linkedin.com/in/alex-shanjay-10501430b" },
  { label: "Behance", handle: "Alex Shanjay", href: null }, // [EDIT] real Behance profile URL
];

export const navLinks = [
  { label: "Videos", href: "#videos" },
  { label: "Shorts", href: "#shorts" },
  { label: "Design", href: "#design" },
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Words used by the recurring typographic header on each section.
export const sections = {
  hero: { meta: ["Built to Inspire", "Updated 2026"], ghost: "Edited with Heart", script: "refine", title: "Portfolio", tag: "Video & Design" },
  reel: { script: "2026", title: "Showreel", tag: "Play the reel" },
  videos: { meta: ["Long-form", "Episodes"], ghost: "Edited with Heart", script: "motion", title: "Videos", tag: "16:9 · Edits" },
  shorts: { meta: ["Vertical", "9:16"], ghost: "Made for the scroll", script: "stories", title: "Shorts", tag: "Shorts & Reels" },
  design: { meta: ["Print & Social", "1:1"], ghost: "Built with Heart", script: "crafted", title: "Design", tag: "Graphic Work" },
  about: { meta: ["The Editor", "Since 2023"], ghost: "Built with Heart", script: "hello", title: "About", tag: "Skills & Tools" },
  journey: { meta: ["Experience", "Education"], ghost: "Step by step", script: "path", title: "Journey", tag: "2022 — 2026" },
  services: { meta: ["What I do", "Rates in LKR"], ghost: "Built with Heart", script: "offer", title: "Services", tag: "Edit · Motion · Design" },
  faq: { meta: ["Questions", "Answers"], ghost: "Good to know", script: "asked", title: "FAQ", tag: "Before you book" },
  contact: { meta: ["Hire Me", "Open for work"], ghost: "Edited with Heart", script: "together", lines: ["Let's make", "something"] },
};

export const showreel = {
  id: "VfRRBIF4I6g", // [EDIT] swap for a new reel if you cut one
  title: "Showreel 2026",
};

// Titles below come from the YouTube upload names — [EDIT] polish if you like.
export const videos = [
  { id: "oLNeoaWaiGk", title: "Cinematic Reel", category: "Cinematic", year: 2026, featured: true },
  { id: "mU3a-WvqPUw", title: "Nallur — Cinematic Reel", category: "Colour Grading", year: 2026 },
  { id: "WOBtJHS2HF4", title: "Cinematic Fight", category: "Action & VFX", year: 2026 },
  { id: "_zKvcEZlW2I", title: "Love Reel", category: "Storytelling", year: 2026 },
  { id: "O1MLFrXW_3Y", title: "Nallur — Festival Cut", category: "Cinematic", year: 2026 },
  { id: "VnaE8Qpd1GI", title: "Birthday Reel — Vol. 01", category: "Event Edit", year: 2026 },
  { id: "-jZy4vw_PzM", title: "Birthday Reel — Vol. 02", category: "Event Edit", year: 2026 },
  { id: "QYIsp8kohJc", title: "Birthday Reel — Vol. 03", category: "Event Edit", year: 2026 },
];

export const shorts = [
  { id: "k8ilFbrGgGQ", title: "Product Ad — 01", category: "Social Ad", year: 2026 },
  { id: "vpLkwCO7nB8", title: "Product Ad — 02", category: "Social Ad", year: 2026 },
  { id: "FE2bpUpP7DA", title: "Product Ad — 03", category: "Social Ad", year: 2026 },
  { id: "wvOW2gVi9sk", title: "Product Ad — 04", category: "Social Ad", year: 2026 },
  { id: "DbFmiYm_jmk", title: "Product Ad — 05", category: "Social Ad", year: 2026 },
  { id: "vKySIb66TRs", title: "Restaurant Ad", category: "Restaurant", year: 2026 },
];

// Older work, shown behind "View older work".
export const archive = [
  { id: "DAAUznDyUCI", title: "3D Lyrics Edit", category: "3D Modeling & Animation" },
  { id: "edIdbprvCqk", title: "Brand Campaign Edit", category: "Video Editing" },
  { id: "81nFr4PUqV4", title: "Restaurant Promo — The Coconut Island", category: "Social Content" },
  { id: "ds1bUCDzdPU", title: "Brand Reel — Chroma Global", category: "Motion Graphics" },
  { id: "qj3VsmlQFlI", title: "Social Reel", category: "Motion Graphics" },
  { id: "1ZUUz93QlVs", title: "Social Reel", category: "Color Grading" },
  { id: "64OkUl-1k3s", title: "Social Reel", category: "Visual Effects" },
  { id: "vlrc5nGsHw4", title: "Social Reel", category: "Storytelling" },
  { id: "EyiSXQfPhu4", title: "Food & Restaurant Content", category: "Social Content" },
  { id: "gOilug_Zn8I", title: "Restaurant Edit", category: "Social Content" },
  { id: "GZD6bOdMoQI", title: "Promotional Video", category: "Video Editing" },
  { id: "yBrnS6HTHUQ", title: "Gym Edit", category: "Motion Graphics" },
];

export const designFilters = ["All", "Social Posts", "Branding", "Restaurant", "Posters"];

// [EDIT] Export each design as a 1080×1080 WebP into /public/design/ and set
// `image` (e.g. "/design/01-ax-launch.webp"). While `image` is null a
// typographic placeholder poster is shown instead.
export const designs = [
  {
    id: "ax-instagram",
    title: "AX.Visuals — Instagram post",
    category: "Social Posts",
    image: null, // "/design/01-ax-instagram.webp"
    href: "https://www.instagram.com/p/Dd9xJcnTEEn/",
    caption: "Launch post for the AX.Visuals Instagram feed.",
  },
  {
    id: "coconut-island-promo",
    title: "The Coconut Island — Weekend promo",
    category: "Restaurant",
    image: null, // "/design/02-coconut-promo.webp"
    caption: "Promo poster for The Coconut Island restaurant.",
  },
  {
    id: "brand-identity",
    title: "Brand identity system",
    category: "Branding",
    image: null, // "/design/03-brand-identity.webp"
    caption: "Logo, colour and type system for a local brand.",
  },
  {
    id: "event-poster",
    title: "Event poster",
    category: "Posters",
    image: null, // "/design/04-event-poster.webp"
    caption: "Event poster with bold display type.",
  },
  {
    id: "coconut-island-menu",
    title: "The Coconut Island — Menu post",
    category: "Restaurant",
    image: null, // "/design/05-coconut-menu.webp"
    caption: "Menu highlight post for social.",
  },
  {
    id: "social-carousel",
    title: "Social carousel",
    category: "Social Posts",
    image: null, // "/design/06-social-carousel.webp"
    caption: "Carousel post series for a brand's Instagram.",
  },
];

export const studio = {
  name: "AX.Visuals",
  headline: "video production for businesses.",
  subline: "Reels, photos and brand films for restaurants, hotels, products and brands. Available islandwide 🇱🇰",
  services: ["Social Content Reels", "Product & Food Shoots", "Brand Films"],
  pricing: "Packages from Rs. 25,000",
  url: "https://axvisuals-five.vercel.app/",
  instagram: null, // [EDIT] AX.Visuals Instagram URL — the button appears once set
  founded: "2026", // [EDIT] confirm founding year
  script: "studio",
  logo: "/brand/ax-visuals-logo.png",
  alternateName: "AX Visuals Jaffna",
  description:
    "Content studio in Jaffna, Sri Lanka creating Reels, photos, video edits and social-media design for businesses. Available islandwide.",
  priceRange: "Rs. 4,000 – Rs. 125,000",
};

export const skills = [
  { label: "Video Editing", value: 95 },
  { label: "Visual Storytelling", value: 92 },
  { label: "Motion Graphics", value: 90 },
  { label: "Graphic Design", value: 88 },
  { label: "Visual Effects", value: 85 },
  { label: "Illustration", value: 80 },
];

export const tools = [
  "After Effects",
  "Premiere Pro",
  "DaVinci Resolve",
  "Photoshop",
  "Illustrator",
  "Blender",
  "Cinema 4D",
  "Mocha Pro",
  "Figma",
];

export const journey = [
  {
    year: "2026",
    role: "Founder",
    org: "AX.Visuals",
    kind: "Studio",
    text: "Video production studio for businesses across Sri Lanka.",
  },
  {
    year: "2026",
    role: "Video Editor",
    org: "Chroma Global",
    kind: "Experience",
    text: "Promotional and social media videos with motion graphics, colour grading and VFX, on tight turnarounds.",
  },
  {
    year: "2025",
    role: "Graphic Designer",
    org: "The Coconut Island",
    kind: "Experience",
    text: "Social posts, promo banners, food & restaurant videos and reels, consistent brand identity.",
  },
  {
    year: "2024–26",
    role: "HND in Software Engineering",
    org: "ESOFT Metro Campus",
    kind: "Education",
  },
  {
    year: "2023–24",
    role: "Diploma in IT",
    org: "ESOFT Metro Campus",
    kind: "Education",
  },
  {
    year: "2022–23",
    role: "G.C.E O/L",
    org: "Manipay Hindu College",
    kind: "Education",
  },
];

export const services = [
  { title: "Video editing", text: "Cinematic edits, brand films, YouTube videos and ad edits." },
  { title: "Reels & Shorts", text: "Vertical edits with hooks, captions, music and sound design." },
  { title: "Motion graphics", text: "Animated titles, logo animations and text animation." },
  { title: "Colour grading", text: "Cinematic colour correction for film and social content." },
  { title: "Graphic & social design", text: "Posts, posters, thumbnails and brand graphics." },
];

// Prices in Sri Lankan rupees. Remove `rates`, `packages`, the price FAQ and
// `studio.priceRange` if you'd rather not publish prices.
export const rates = {
  reelFrom: "Rs. 4,000",
  packagesFrom: "Rs. 25,000",
  packagesNote: "2 Reels + 15 photos",
};

// Listed in the structured data and llms.txt (not shown as cards on the page).
export const packages = [
  { name: "Starter Content", price: 25000, description: "2-hour shoot, 2 Reels, 15 edited photos" },
  { name: "Social Content", price: 40000, description: "3-hour shoot, 4 Reels, 25 edited photos" },
  { name: "Premium Brand", price: 60000, description: "5-hour shoot, 6 Reels, 40 edited photos" },
  { name: "Full Content Day", price: 85000, description: "8-hour shoot, 8–10 Reels, up to 60 edited photos" },
  { name: "Basic Reel editing", price: 4000, description: "Starting price per Reel edit" },
];

// Shown in the FAQ section and mirrored into FAQPage JSON-LD — keep them identical.
export const faq = [
  {
    q: "Who is Alex Shanjay?",
    a: "Alex Shanjay is a video editor and graphic designer from Jaffna, Sri Lanka, and the founder of AX.Visuals. He specialises in cinematic edits, Shorts and Reels, motion graphics, colour grading and social-media design.",
  },
  {
    q: "Who is a good video editor in Jaffna?",
    a: "Alex Shanjay of AX.Visuals is a Jaffna-based video editor who creates Reels, Shorts, cinematic edits and colour-graded content for businesses and creators, with shoots available islandwide in Sri Lanka.",
  },
  {
    q: "How much does Reel editing cost in Sri Lanka with AX.Visuals?",
    a: "Basic Reel editing starts from Rs. 4,000 and premium Reel editing is Rs. 6,000–8,000+. Shoot-and-edit content packages start at Rs. 25,000 for 2 Reels and 15 edited photos.",
  },
  {
    q: "Does Alex Shanjay work with clients outside Jaffna?",
    a: "Yes. Video editing and design work is done remotely for clients anywhere, and shoots are available islandwide in Sri Lanka. Travel charges may apply outside the local area.",
  },
  {
    q: "How long does delivery take?",
    a: "Edited photos are delivered in 3–5 working days and Reels in 5–7 working days. Express delivery is available for an extra 25–40%.",
  },
  {
    q: "How do I hire Alex Shanjay?",
    a: "Send your brief, deadline and budget on WhatsApp at +94 76 401 5423 or by email to shanjayalex09@gmail.com. A 50% advance confirms a booking.",
  },
];
