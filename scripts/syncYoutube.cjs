const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');

const parser = new Parser();
const outputDir = path.join(__dirname, '../src/videos');
const feedUrl = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCTlqPVhBqGnyKsebb3mjA0Q';

(async () => {
  const feed = await parser.parseURL(feedUrl);

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  feed.items.forEach(item => {
    const slug = item.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const filePath = path.join(outputDir, `${slug}.md`);
    const videoId = item.id.split(':').pop(); // extract YouTube ID

    const content = `---
title: "${item.title.replace(/"/g, "'")}"
date: "${item.isoDate}"
layout: video
tags: ["videos"]
youtube_id: "${videoId}"
description: "${(item.contentSnippet || '').replace(/"/g, "'")}"
---

${item.content || ''}
`;

    fs.writeFileSync(filePath, content.trim());
    console.log(`✓ Wrote: ${slug}.md`);
  });
})();