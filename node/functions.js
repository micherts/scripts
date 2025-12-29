import { putDC, updateDC, scanDC, deleteItem } from "./dynamo.js";
import { delUser, deleteGroup, removeUserFromGroup } from "./cognito.js";

export const deleteItemsFromGroups = async (table, groups, included) => {
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

export const addParam = async (table, param) => {
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

export const copyAdminDataFromStagingToProd = (env) => {
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

export const copyTemplatesBetweenEnv = (fromEnv, toEnv) => {
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
          `Copying ${table} ${Item[table] || Item.id} from ${fromEnv.name} to ${toEnv.name
          }.`
        )
      );
  });
};

export const renameParameter = async (table, from, to) => {
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

export const deleteSubscription = async (email, env) => {
  // first manually delete customer from Stripe
  // this function deletes membership, venues, and entries

  console.log(`Delete Subscriptions for ${email}.`);
  // UserProfile	email = user's email	Get attribute id
  let TableName = env.dynamo.tables.config.userProfile;
  const userProfiles = (
    await scanDC(
      {
        TableName,
      },
      `table: ${TableName} SCAN (for email ${email}).`
    )
  ).filter((a) => a.email === email);

  userProfiles.forEach(async ({ id: userProfileId }) => {
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
    TableName = env.dynamo.tables.ops.operation;
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
    Object.values(env.dynamo.tables.ops).forEach(async (TableName) => {
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
    TableName = env.dynamo.tables.config.membership;
    const memberships = (
      await scanDC(
        {
          TableName,
        },
        `table: ${TableName} SCAN (for ownerId ${userProfileId}).`
      )
    ).filter(({ ownerId }) => ownerId === userProfileId) || [{
      id: undefined,
    }];

    memberships.forEach(({ id }) => deleteItem(
      { TableName, Key: { id } },
      `table: ${TableName} id: ${id} DELETE.`
    ));

    // Group Memberships		Delete subscribed group (may not want to delete in PROD)
    const { userPoolId: UserPoolId, templateGroups } = env.cognito;
    venues.forEach(({ userGroup: GroupName }) =>
      deleteGroup({ GroupName, UserPoolId }, `userGroup: ${GroupName} DELETE.`)
    );

    // Group Memberships		Remove user from Template
    await Promise.all(
      templateGroups.map((GroupName) =>
        removeUserFromGroup(
          { Username: userProfileId, GroupName, UserPoolId },
          `userGroup: ${GroupName} REMOVE USER ${userProfileId}.`
        )
      )
    );
  });
};

export const deleteUser = async (email, env) => {
  // first run deleteSubscription if any previous subscriptions
  // this function deletes userprofile and cognito user

  console.log(`Delete User ${email}.`);
  // UserProfile	email = user's email
  const { userProfile: TableName } = env.dynamo.tables.config;
  const userProfiles = (
    await scanDC(
      {
        TableName,
      },
      `table: ${TableName} SCAN (for email ${email}).`
    )
  ).filter((a) => a.email === email);

  userProfiles.forEach(({ id }) => {
    // Delete UserProfile item
    deleteItem(
      { TableName, Key: { id } },
      `table: ${TableName} id: ${id} DELETE.`
    );
  });

  // Delete User
  userProfiles
    .map(({ id }) => id)
    .filter((a, i, self) => i === self.indexOf(a))
    .forEach((id) => {
      const { userPoolId: UserPoolId } = env.cognito;
      delUser({ Username: id, UserPoolId }, `user: ${id} DELETE.`);
    });
};

export const updateRecipeCategory = async (env) => {
  const TableName = env.dynamo.tables.ops.recipe;
  const recipes = await scanDC({ TableName });
  // recipes.slice(0, 1).forEach(({ id }) => {
  recipes.forEach(({ id }) => {
    console.log("Updating recipe id:", id);
    updateDC({
      TableName,
      Key: { id },
      ExpressionAttributeValues: { ":category": "food" },
      UpdateExpression: "SET category = :category",
    })
  }
  );
};
