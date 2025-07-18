const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // Passthrough copy for assets
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  eleventyConfig.addFilter("date", (value, format = "yyyy") => {
    const date = value === "now" ? DateTime.now() : DateTime.fromISO(value);
    return date.isValid ? date.toFormat(format) : "Invalid date";
  });

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
