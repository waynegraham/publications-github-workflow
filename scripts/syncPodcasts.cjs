const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
const outputDir = path.join(__dirname, '../src/podcasts');

(async () => {
  const feed = await parser.parseURL('https://feeds.libsyn.com/229370/rss');

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  feed.items.forEach(item => {
    const slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const filePath = path.join(outputDir, `${slug}.md`);

    const content = `---
title: "${item.title.replace(/"/g, "'")}"
date: "${item.isoDate}"
layout: podcast
tags: ["podcasts"]
audio_url: "${item.enclosure?.url || ''}"
description: "${(item.contentSnippet || '').replace(/"/g, "'")}"
---

${item.content?.replace(/<script[^>]*>.*?<\/script>/gi, '') || ''}
`;

    fs.writeFileSync(filePath, content.trim());
    console.log(`✓ Wrote: ${slug}.md`);
  });
})();