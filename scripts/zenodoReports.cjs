const fs = require("fs");

const data = JSON.parse(fs.readFileSync("zenodo.json", "utf8"));

data.hits.hits.forEach((record) => {
  const id = record.id;
  const date = record.metadata.publication_date;
  const description = record.metadata.description || "";
  const doi = record.metadata.doi || "";
  const url = record.metadata.doi_url || "";
  const authors = record.metadata.creators || [];
  const resource_type = record.metadata.resource_type?.title || "";
  const thumbnail = record.links?.thumbnails?.["1200"] || "";
  const files = record.links?.files || "";
  const stats = record.stats || {};

  const filename = `src/reports/${id}.md`;

  const content = `---
title: "${record.metadata.title}"
date: "${date}"
zenodo_id: ${id}
doi: "${doi}"
url: "${url}"
resource_type: "${resource_type}"
thumbnail: "${thumbnail}"
files: "${files}"
stats:
  downloads: ${stats.downloads || 0}
  views: ${stats.views || 0}
authors:
${authors.map((author) => `  - "${author.name}"`).join("\n")}
---

${description}
`;

  fs.writeFileSync(filename, content);
});
