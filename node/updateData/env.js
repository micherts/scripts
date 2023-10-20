// environment
const region = { region: "ap-southeast-2" };

const env = {
  // prod: {
  //   operation: "Operation-n4gpkhbth5etrojcbgkmegsqfe-prod",
  //   ingredient: "Ingredient-n4gpkhbth5etrojcbgkmegsqfe-prod",
  //   overhead: "Overhead-n4gpkhbth5etrojcbgkmegsqfe-prod",
  //   recipe: "Recipe-n4gpkhbth5etrojcbgkmegsqfe-prod",
  //   recipeIngredient: "RecipeIngredient-n4gpkhbth5etrojcbgkmegsqfe-prod",
  //   role: "Role-n4gpkhbth5etrojcbgkmegsqfe-prod",
  //   supplier: "Supplier-n4gpkhbth5etrojcbgkmegsqfe-prod",
  // },
  prod: {
    admin: {
      area: "Area-tluzsirwdndxlipyq2k5solz5y-prod",
      category: "Category-tluzsirwdndxlipyq2k5solz5y-prod",
      period: "Period-tluzsirwdndxlipyq2k5solz5y-prod",
      store: "Store-tluzsirwdndxlipyq2k5solz5y-prod",
      unit: "Unit-tluzsirwdndxlipyq2k5solz5y-prod",
    },
    ops: {
      operation: "Operation-tluzsirwdndxlipyq2k5solz5y-prod",
      ingredient: "Ingredient-tluzsirwdndxlipyq2k5solz5y-prod",
      overhead: "Overhead-tluzsirwdndxlipyq2k5solz5y-prod",
      recipe: "Recipe-tluzsirwdndxlipyq2k5solz5y-prod",
      recipeIngredient: "RecipeIngredient-tluzsirwdndxlipyq2k5solz5y-prod",
      role: "Role-tluzsirwdndxlipyq2k5solz5y-prod",
      supplier: "Supplier-tluzsirwdndxlipyq2k5solz5y-prod",
    },
  },
  staging: {
    admin: {
      area: "Area-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      category: "Category-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      period: "Period-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      store: "Store-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      unit: "Unit-lipwzvjrj5e5dgus2mtiogdk5i-staging",
    },
    ops: {
      operation: "Operation-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      ingredient: "Ingredient-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      overhead: "Overhead-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      recipe: "Recipe-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      recipeIngredient: "RecipeIngredient-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      role: "Role-lipwzvjrj5e5dgus2mtiogdk5i-staging",
      supplier: "Supplier-lipwzvjrj5e5dgus2mtiogdk5i-staging",
    },
  },
};

export default env;
