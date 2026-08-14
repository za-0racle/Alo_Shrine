import fs from "node:fs";

const domain = "https://aloshrine.ink";
const pages = {
  "index.html": ["Khaleed Adedokun | Tech Educator, Data Analyst & Digital Solutions", "Khaleed Adedokun is a Nigerian Tech Educator and Data Analyst building digital solutions and hands-on learning experiences across data, coding, robotics and technology.", "/"],
  "about.html": ["About Khaleed Adedokun | Tech Educator & Data Analyst", "Learn about Khaleed Adedokun, a Tech Educator and Data Analyst working across digital solutions, data, coding, robotics, IoT and practical tech education.", "/about.html"],
  "experience.html": ["Khaleed Adedokun | Experience & Professional Journey", "Explore Khaleed Adedokun’s experience across data analysis, tech education, IT administration and digital skills training in Nigeria.", "/experience.html"],
  "skills.html": ["Khaleed Adedokun | Tech, Data & Digital Skills", "Explore Khaleed Adedokun’s practical skills across data analytics, coding, networking, renewable energy and digital tools.", "/skills.html"],
  "projects.html": ["Khaleed Adedokun | Data, Code, Robotics & IoT Projects", "Explore practical data, coding, Arduino, robotics, IoT, education and digital platform projects by Khaleed O. Adedokun.", "/projects.html"],
  "oracle-tek.html": ["Oracle TEK Global Solutions | Digital & Technology Services", "Oracle TEK Global Solutions provides website development, digital solutions, data analytics, technology training, design and business support services.", "/oracle-tek.html"],
  "education.html": ["Tech Education | Coding, Robotics, IoT & Data", "Hands-on tech education in coding, robotics, IoT, Arduino, data analytics, Excel, Power BI and AI literacy for learners in Nigeria.", "/education.html"],
  "data-analytics.html": ["Data Analytics | Power BI, Excel, SQL & Python", "Data analytics in Nigeria using Excel, Power BI, DAX, SQL and Python to clean, analyze, visualize and communicate useful insight.", "/data-analytics.html"],
  "writing.html": ["Writing | Khaleed O. Adedokun", "Published writing by Khaleed O. Adedokun on public issues, livelihoods, technology, education and development.", "/writing.html"],
  "contact.html": ["Contact Khaleed Adedokun | Oracle TEK Global Solutions", "Contact Khaleed O. Adedokun about data analytics, tech education, digital projects or Oracle TEK Global Solutions services.", "/contact.html"],
};

const graph = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", "@id": `${domain}/#person`, name: "Khaleed Adedokun Oluwatobiloba", alternateName: "Khaleed O. Adedokun", url: `${domain}/`, image: `${domain}/images/profile/khaleed-adedokun.jpg`, jobTitle: "Tech Educator", knowsAbout: ["Data Analytics", "Coding", "Robotics", "Internet of Things", "Technology Education"], sameAs: ["https://www.linkedin.com/in/adedokun-khaleed-5baab4170/", "https://x.com/OAkhaleed/"] },
    { "@type": "Organization", "@id": `${domain}/#oracle-tek`, name: "Oracle TEK Global Solutions", url: `${domain}/oracle-tek.html`, founder: { "@id": `${domain}/#person` } },
    { "@type": "WebSite", "@id": `${domain}/#website`, name: "Khaleed O. Adedokun", url: `${domain}/`, publisher: { "@id": `${domain}/#person` }, about: [{ "@id": `${domain}/#person` }, { "@id": `${domain}/#oracle-tek` }] },
  ],
};

for (const [file, [title, description, path]] of Object.entries(pages)) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(/<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/, `<meta name="description" content="${description}" />`);
  html = html.replace(/\s*<meta\s+property="og:[\s\S]*?\/>/g, "");
  html = html.replace(/\s*<meta\s+name="twitter:[\s\S]*?\/>/g, "");
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  const url = `${domain}${path}`;
  const social = `\n    <meta property="og:type" content="website" />\n    <meta property="og:title" content="${title}" />\n    <meta property="og:description" content="${description}" />\n    <meta property="og:url" content="${url}" />\n    <meta property="og:image" content="${domain}/images/seo/og-image.jpg" />\n    <meta property="og:site_name" content="Khaleed O. Adedokun" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${title}" />\n    <meta name="twitter:description" content="${description}" />\n    <meta name="twitter:image" content="${domain}/images/seo/og-image.jpg" />\n    <!-- Add Google Search Console verification meta tag here when available. -->`;
  html = html.replace(/(<link rel="canonical"[^>]*>)/, `$1${social}`);
  if (file === "index.html") html = html.replace("</head>", `    <script type="application/ld+json">${JSON.stringify(graph)}</script>\n  </head>`);
  fs.writeFileSync(file, html);
}
