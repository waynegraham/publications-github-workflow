const { DateTime } = require("luxon");

const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');
const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const eleventyPluginHubspot = require('eleventy-plugin-hubspot');
const { IdAttributePlugin, HtmlBasePlugin } = require('@11ty/eleventy');


module.exports = function (eleventyConfig) {

  eleventyConfig.setTemplateFormats(['njk', 'js', 'md', 'html']);

  eleventyConfig.addBundle('css');
  eleventyConfig.addBundle('js');

   // Preprocessors
  eleventyConfig.addPreprocessor('drafts', '*', (data, content) => {
    if (data.draft && process.env.ELEVENTY_RUN_MODE === 'build') {
      return false;
    }
  });

  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy({ 'src/static': './static/' });
  eleventyConfig.addPassthroughCopy({ 'src/assets/': './assets/' });

  // Watch targets
  eleventyConfig.addWatchTarget('./src/styles/');

  eleventyConfig.addFilter("slug", function (value) {
    if (!value || typeof value !== "string") return "";
    return value
      .toLowerCase()
      .replace(/[^\w]+/g, "-")
      .replace(/^-+|-+$/g, "");
  });

  eleventyConfig.addFilter("date", (value, format = "yyyy") => {
    const date = value === "now" ? DateTime.now() : DateTime.fromISO(value);
    return date.isValid ? date.toFormat(format) : "Invalid date";
  });

  eleventyConfig.addFilter('readableDate', (dateObj, format, zone) => {
    // Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
    return DateTime.fromJSDate(dateObj, { zone: zone || 'utc' }).toFormat(format || 'dd LLL yyyy');
  });

  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    // dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });

  // Collections
  eleventyConfig.addCollection("podcasts", function (collectionApi) {
  return collectionApi
    .getFilteredByTag("podcasts")
    .filter(item => item.data.date)
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
});

  eleventyConfig.addCollection("reports", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/reports/*.md")
      .filter((item) => item.data.date)
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  eleventyConfig.addCollection("reportYears", (collectionApi) => {
    const reports = collectionApi.getFilteredByGlob("src/reports/*.md");
    const years = new Set();

    reports.forEach((item) => {
      const year = new Date(item.data.date).getFullYear();
      if (!isNaN(year)) {
        years.add(year);
      }
    });

    return [...years].sort((a, b) => b - a); // newest first
  });

  eleventyConfig.addCollection("reportTypes", (collectionApi) => {
    const reports = collectionApi.getFilteredByGlob("src/reports/*.md");
    const types = new Set();

    reports.forEach((item) => {
      if (item.data.resource_type) {
        types.add(item.data.resource_type);
      }
    });

    return [...types].sort();
  });

  eleventyConfig.addCollection("videos", function (collectionApi) {
  return collectionApi
    .getFilteredByTag("videos")
    .filter(item => item.data.date)
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
});

eleventyConfig.addCollection("recentVideos", function (collectionApi) {
  return collectionApi
    .getFilteredByTag("videos")
    .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
    .slice(0, 5);
});

 // Plugins
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ['avif', 'webp', 'jpeg'],
    // output image widths
    widths: ['auto'],

    // optional, attributes assigned on <img> nodes override these values
    htmlOptions: {
      imgAttributes: {
        loading: 'lazy',
        decoding: 'async',
      },
      pictureAttributes: {},
    },
  });

  //https://www.11ty.dev/docs/plugins/navigation/
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPlugin(eleventyPluginHubspot, {
    portalId: 20251227,
    loadingMode: 'lazy',
  });

  // https://www.11ty.dev/docs/plugins/id-attribute/
  eleventyConfig.addPlugin(IdAttributePlugin, {
    selector: 'h1,h2,h3,h4,h5,h6', // default

    // swaps html entities (like &amp;) to their counterparts before slugify-ing
    decodeEntities: true,

    // check for duplicate `id` attributes in application code?
    checkDuplicates: 'error', // `false` to disable

    // by default we use Eleventy’s built-in `slugify` filter:
    slugify: eleventyConfig.getFilter('slugify'),

    filter: function ({ page }) {
      if (page.inputPath.endsWith('test-skipped.html')) {
        return false; // skip
      }

      return true;
    },
  });

  // Return eleventy
  return {
    dir: {
      input: "src", // source folder
      includes: "_includes", // default for nunjucks/partials
      layouts: "_layouts", // default for nunjucks/layouts
      data: "_data", // data folder (optional)
      output: "_site", // build output (default)
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/publications-github-workflow",
  };

};
