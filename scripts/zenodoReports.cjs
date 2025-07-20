const fs = require('fs');
const path = require('path');

// Zenodo API for CLIR community (adjust size as needed)
const apiURL = 'https://zenodo.org/api/records?q=communities:clir&size=10&sort=mostrecent';

// Paths
const jsonOutput = path.join(__dirname, '../src/_data/raw/zenodo.json');
const reportsDir = path.join(__dirname, '../src/reports');

// Utility to slugify titles
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

(async () => {
  try {
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error(`Failed to fetch Zenodo API: ${res.statusText}`);
    const data = await res.json();

    // Save raw API response
    fs.mkdirSync(path.dirname(jsonOutput), { recursive: true });
    fs.writeFileSync(jsonOutput, JSON.stringify(data, null, 2));
    console.log(`✓ Saved API response to ${jsonOutput}`);

    // Create markdown files
    fs.mkdirSync(reportsDir, { recursive: true });

    data.hits.hits.forEach((record) => {
      const id = record.id;
      const title = record.metadata.title || `zenodo-${id}`;
      const slug = slugify(title);
      const mdPath = path.join(reportsDir, `${slug}.md`);
      const authors = record.metadata.creators || [];

      const markdown = `---
title: "${title.replace(/"/g, "'")}"
date: "${record.metadata.publication_date || ''}"
layout: report
id: ${id}
doi: "${record.metadata.doi || ''}"
url: "${record.metadata.url || ''}"
authors:
${authors.map((author) => `  - "${author.name}"`).join('\n')}
resource_type: "${record.metadata.resource_type?.title || ''}"
thumbnail: "${record.links?.thumbnails?.["1200"] || ''}"
files: "${record.links?.files || ''}"
stats:
  downloads: ${record.stats?.downloads || 0}
  views: ${record.stats?.views || 0}
---
// TODO: strip HTML and put this in the header
${record.metadata.description || ''}
`;

      fs.writeFileSync(mdPath, markdown.trim());
      console.log(`✓ Wrote: ${slug}.md`);
    });
  } catch (err) {
    console.error(`❌ Error:`, err);
    process.exit(1);
  }
})();


// authors: "${record.metadata.creators?.map((author) => author.name).join(', ') || ''}"


// data.hits.hits.forEach((record) => {
//   const id = record.id;
//   const date = record.metadata.publication_date;
//   const description = record.metadata.description || "";
//   const doi = record.metadata.doi || "";
//   const url = record.metadata.doi_url || "";
//   const authors = record.metadata.creators || [];
//   const resource_type = record.metadata.resource_type?.title || "";
//   const thumbnail = record.links?.thumbnails?.["1200"] || "";
//   const files = record.links?.files || "";
//   const stats = record.stats || {};

//   const filename = `src/reports/${id}.md`;

//   const content = `---
// title: "${record.metadata.title}"
// date: "${date}"
// zenodo_id: ${id}
// doi: "${doi}"
// url: "${url}"
// resource_type: "${resource_type}"
// thumbnail: "${thumbnail}"
// files: "${files}"
// stats:
//   downloads: ${stats.downloads || 0}
//   views: ${stats.views || 0}
// authors:
// ${authors.map((author) => `  - "${author.name}"`).join("\n")}
// ---

// ${description}
// `;

//   fs.writeFileSync(filename, content);
// });
