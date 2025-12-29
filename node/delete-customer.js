import { readFileSync } from "fs";
import { deleteSubscription, deleteUser } from "./functions.js";

const { stage: env } = JSON.parse(readFileSync("../env.json", "utf8"));

// Customer Deletion
// First manually delete customer from Stripe
const email = "602.sunday@gmail.com";
await deleteSubscription(email, env);
deleteUser(email, env);

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
