module.exports = {
  eleventyComputed: {
    permalink: data => {
      const pageNum = data.pagination.pageNumber;
      return pageNum === 0 ? 'podcasts/index.html' : `podcasts/${pageNum}/index.html`;
    }
  }
};