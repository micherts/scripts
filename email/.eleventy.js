module.exports = function (eleventyConfig) {
  // eleventyConfig.addTemplateFormats("txt");
  // eleventyConfig.addExtension("txt", {
  //   outputFileExtension: "txt",
  //   compile: async (inputContent) => {
  //     // Replace any instances of cloud with butt
  //     let output = inputContent.replace(/cloud/gi, "butt");

  //     return async () => {
  //       return output;
  //     };
  //   },
  // });
  eleventyConfig.addPassthroughCopy("./src/*.txt");
  return {
    dir: {
      input: "src",
      output: "out",
    },
  };
};
