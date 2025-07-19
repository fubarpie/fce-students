const path = require("path");

module.exports = function(eleventyConfig) {
  // --- Collections ---
  // Create a collection of students, sorted by their name
  eleventyConfig.addCollection("students", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/students/*.md").sort((a, b) => {
      if (a.data.studentName < b.data.studentName) { return -1; }
      if (a.data.studentName > b.data.studentName) { return 1; }
      return 0;
    });
  });

  // --- Passthrough Copy ---
  // Copy the student images to the output directory
  eleventyConfig.addPassthroughCopy("public/uploads");

  // --- Path Prefix for GitHub Pages ---
  // This is important for your site to work correctly on a subdomain/subfolder.
  // Replace 'fce-students' with your actual repository name.
  const repoName = path.basename(__dirname);
  const pathPrefix = process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/';
  
  console.log(`Using pathPrefix: ${pathPrefix}`);

  return {
    // Control which files Eleventy processes
    templateFormats: [
      "md",
      "njk",
      "html"
    ],

    // Pre-process data files with Nunjucks
    dataTemplateEngine: "njk",
    
    // Pre-process Markdown files with Nunjucks
    markdownTemplateEngine: "njk",

    // Directory settings
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site" // This is the default, but good to be explicit
    },
    
    // Path prefix for deployment
    pathPrefix: pathPrefix
  };
};
