const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

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
    templateFormats: ["md", "njk", "html"],
  };
};
