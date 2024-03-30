import { putDC, updateDC, scanDC, deleteItem } from "./dynamo.js";
import { delUser, deleteGroup, removeUserFromGroup } from "./cognito.js";

const deleteItemsFromGroups = async (table, groups, included) => {
  const existing = await scanDC({
    TableName: table,
  });
  existing
    .filter(({ userGroup }) =>
      included ? groups.includes(userGroup) : !groups.includes(userGroup)
    )
    .forEach(({ id, userGroup }) =>
      deleteItem(
        {
          TableName: table,
          Key: { id },
        },
        `Deleting item ${id} from userGroup ${userGroup}.`
      )
    );
};

const addParam = async (table, param) => {
  const existing = await scanDC({
    TableName: table,
  });
  const [key, value] = Object.entries(param)[0];
  existing.forEach(({ id }) =>
    updateDC({
      TableName: table,
      Key: { id },
      ExpressionAttributeValues: { [`:${value}`]: value },
      UpdateExpression: `SET ${key} = :${value}`,
    })
  );
};

const copyAdminDataFromStagingToProd = (env) => {
  Object.entries(env.admin).forEach(async ([table, TableName]) => {
    const stagingTableItems = await scanDC({ TableName });
    stagingTableItems.forEach((Item) =>
      putDC(
        {
          TableName,
          Item,
        },
        `Copying ${table} ${Item.name || Item.id} from staging to prod`
      )
    );
  });
};

const copyTemplatesBetweenEnv = (fromEnv, toEnv) => {
  Object.entries(fromEnv.ops).forEach(async ([table, TableName]) => {
    const stagingTableItems = await scanDC({ TableName });
    stagingTableItems
      .filter(({ userGroup }) => ["Template", "Demo"].includes(userGroup))
      .forEach((Item) =>
        putDC(
          {
            TableName: toEnv.ops[table],
            Item,
          },
          `Copying ${table} ${Item[table] || Item.id} from ${fromEnv.name} to ${
            toEnv.name
          }.`
        )
      );
  });
};

const renameParameter = async (table, from, to) => {
  const existing = await scanDC({
    TableName: table,
  });
  existing
    // .filter(({ id }) => id === "35fcbe1f-cee8-41d2-939b-d333da0005db")
    .forEach(({ id, ...others }) => {
      if (others[from])
        updateDC(
          {
            TableName: table,
            Key: { id },
            ExpressionAttributeValues: { [`:${from}`]: others[from] },
            ExpressionAttributeNames: { [`#${from}`]: from },
            UpdateExpression: `SET ${to} = :${from} REMOVE #${from}`,
          },
          `table: ${table} id: ${id} renameParameter ${from} to ${to}`
        );
    });
};

const deleteSubscription = async (email, env) => {
  // first manually delete customer from Stripe
  // this function deletes membership, venues, and entries

  // UserProfile	email = user's email	Get attribute id
  let TableName = env.config.userProfile;
  const userProfileId = (
    await scanDC(
      {
        TableName,
      },
      `table: ${TableName} SCAN (for email ${email}).`
    )
  ).filter((a) => a.email === email)[0].id;

  // UserProfile	email = user's email	Remove attribute selectedVenueId
  const param = "selectedVenueId";
  updateDC(
    {
      TableName,
      Key: { id: userProfileId },
      ExpressionAttributeNames: { [`#${param}`]: param },
      UpdateExpression: `REMOVE #${param}`,
    },
    `table: ${TableName} id: ${userProfileId} parameter: ${param} REMOVE.`
  );

  // Operation	mainUser = UserProfile.id	Get attribute userGroup
  TableName = env.ops.operation;
  const venues = (
    await scanDC(
      {
        TableName,
      },
      `table: ${TableName} SCAN (for mainUser ${userProfileId}).`
    )
  ).filter((a) => a.mainUser === userProfileId);

  // Operation	mainUser = UserProfile.id	Delete items
  venues.forEach(({ id }) =>
    deleteItem(
      { TableName, Key: { id } },
      `table: ${TableName} id: ${id} DELETE.`
    )
  );

  // Ingredient	userGroup = Operation.userGroup	Delete items
  // Overhead	userGroup = Operation.userGroup	Delete items
  // Recipe	userGroup = Operation.userGroup	Delete items
  // RecipeIngredient	userGroup = Operation.userGroup	Delete items
  // Role	userGroup = Operation.userGroup	Delete items
  // Supplier	userGroup = Operation.userGroup	Delete items
  Object.values(env.ops).forEach(async (TableName) => {
    const items = (
      await scanDC(
        {
          TableName,
        },
        `table: ${TableName} SCAN (for userGroups).`
      )
    ).filter((a) =>
      venues.map(({ userGroup }) => userGroup).includes(a.userGroup)
    );
    items.forEach(({ id }) =>
      deleteItem(
        { TableName, Key: { id } },
        `table: ${TableName} id: ${id} DELETE.`
      )
    );
  });

  // Membership	ownerId = UserProfile.id	Delete items
  TableName = env.config.membership;
  const { id } = (
    await scanDC(
      {
        TableName,
      },
      `table: ${TableName} SCAN (for ownerId ${userProfileId}).`
    )
  ).filter(({ ownerId }) => ownerId === userProfileId)[0] || { id: undefined };

  deleteItem(
    { TableName, Key: { id } },
    `table: ${TableName} id: ${id} DELETE.`
  );

  // Group Memberships		Delete subscribed group (may not want to delete in PROD)
  const { UserPoolId, templateGroups } = env.config;
  venues.forEach(({ userGroup: GroupName }) =>
    deleteGroup({ GroupName, UserPoolId }, `userGroup: ${GroupName} DELETE.`)
  );

  // Group Memberships		Remove user from Template
  templateGroups.forEach((GroupName) =>
    removeUserFromGroup(
      { Username: userProfileId, GroupName, UserPoolId },
      `userGroup: ${GroupName} REMOVE USER ${userProfileId}.`
    )
  );
};

const deleteUser = async (email, env) => {
  // first run deleteSubscription if any previous subscriptions
  // this function deletes userprofile and cognito user

  // UserProfile	email = user's email
  const { userProfile: TableName } = env.config;
  const { id } = (
    await scanDC(
      {
        TableName,
      },
      `table: ${TableName} SCAN (for email ${email}).`
    )
  ).filter((a) => a.email === email)[0];

  // Delete UserProfile item
  deleteItem(
    { TableName, Key: { id } },
    `table: ${TableName} id: ${id} DELETE.`
  );

  // Delete User
  const { UserPoolId } = env.config;
  delUser({ Username: id, UserPoolId }, `user: ${id} DELETE.`);
};

export {
  deleteItemsFromGroups,
  addParam,
  copyAdminDataFromStagingToProd,
  copyTemplatesBetweenEnv,
  renameParameter,
  deleteSubscription,
  deleteUser,
};
