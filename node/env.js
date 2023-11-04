const region = "ap-southeast-2";

const prod = {
  name: "prod",
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
  config: {
    userProfile: "",
    membership: "",
    UserPoolId: "ap-southeast-2_QPtG5bltS",
    demoVenues: ["135b82d6-a833-41bb-892c-f2d84c71030a"],
    templateGroups: ["Template"],
  },
};

const staging = {
  name: "staging",
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
  config: {
    userProfile: "UserProfile-lipwzvjrj5e5dgus2mtiogdk5i-staging",
    membership: "Membership-lipwzvjrj5e5dgus2mtiogdk5i-staging",
    UserPoolId: "ap-southeast-2_aNghcOUvd",
    demoVenues: ["135b82d6-a833-41bb-892c-f2d84c71030a"],
    templateGroups: ["Template"],
  },
};

export { region, prod, staging };
