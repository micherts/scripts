import { deleteSubscription } from "./functions.js";
import { staging } from "./env.js";

deleteSubscription("micherts@me.com", staging); // first manually delete customer from Stripe

// Object.values(staging.ops).forEach((table) => updateData(table));
// addParam(staging.ops.operation, { operation: 0 });
// copyAdminDataFromStagingToProd();
// copyTemplatesFromStagingToProd();
// renameParameter(staging.ops.operation, "name", "operation");
// Object.values(staging.ops).forEach((table) =>
//   deleteItemsFromGroups(
//     table,
//     [
//       "Template",
//       "Demo",
//       "87dc1325-0931-4187-aeb0-703bb400dee8",
//       "46c09997-54c2-4f48-89a5-699970291943",
//     ],
//     false
//   )
// );
