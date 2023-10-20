import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { getReasonPhrase } from "http-status-codes";
import env from "./env.js";

const { prod, staging } = env;

const client = new DynamoDBClient({});
const dc = DynamoDBDocumentClient.from(client);

const cl = (a, b) => (a ? console.log(a, b || "") : null);

const getExpression = (obj, type) => ({
  ExpressionAttributeValues: Object.assign(
    {},
    ...Object.entries(obj)
      .filter(([k]) => k !== "id")
      .map(([k, v]) => {
        const key = `:${k}`;
        return { [key]: v };
      })
  ),
  ...(type === "update" && {
    UpdateExpression: [
      "set ",
      Object.keys(obj)
        .filter((k) => k !== "id")
        .map((k) => `${k} = :${k}`)
        .join(", "),
    ].join(""),
  }),
  ...(type === "query" && {
    KeyConditionExpression: Object.keys(obj)
      .slice(0, 1)
      .map((k) => `${k} = :${k}`)
      .join(""),
  }),
  ...(type === "query" &&
    Object.keys(obj).length > 1 && {
      FilterExpression: Object.keys(obj)
        .slice(1)
        .map((k) => `${k} = :${k}`)
        .join(" AND "),
    }),
});

const getDC = async (params, log) => {
  // params = {TableName, Key: {}}
  cl(log);
  try {
    const {
      $metadata: { httpStatusCode },
      Item,
    } = await dc.send(new GetCommand(params));
    cl(log, getReasonPhrase(httpStatusCode));
    // console.log("get item output: ", { Item });
    return Item;
  } catch (err) {
    cl(err);
    return null;
  }
};

const putDC = async (params, log) => {
  // params = {TableName, Item: {}}
  cl(log);
  const {
    $metadata: { httpStatusCode },
  } = await dc.send(new PutCommand(params));
  cl(log, getReasonPhrase(httpStatusCode));
  return params.Item;
};

const deleteDC = async (params, log) => {
  // params = {TableName, Key: {}}
  cl(log);
  const {
    $metadata: { httpStatusCode },
  } = await dc.send(new DeleteCommand(params));
  cl(log, getReasonPhrase(httpStatusCode));
};

const updateDC = async (params, log) => {
  // params = {TableName, Key: {}, UpdateExpression, ExpressionAttributeValues: {}}
  cl(log);
  const {
    $metadata: { httpStatusCode },
    Attributes,
  } = await dc.send(new UpdateCommand({ ...params, ReturnValues: "ALL_NEW" }));
  cl(log, getReasonPhrase(httpStatusCode));
  return Attributes;
};

const queryDC = async (params, log) => {
  // params = {TableName, KeyConditionExpression, ExpressionAttributeValues: {}}
  cl(log);
  const {
    $metadata: { httpStatusCode },
    Items,
  } = await dc.send(new QueryCommand({ ...params }));
  cl(log, getReasonPhrase(httpStatusCode));
  // console.log("query output: ", { Items });
  return Items;
};

const scanDC = async (params, log) => {
  // params = {TableName}
  cl(log);
  const {
    $metadata: { httpStatusCode },
    Items,
  } = await dc.send(new ScanCommand(params));
  cl(log, getReasonPhrase(httpStatusCode));
  return Items;
};

const changeParameterName = async (table, from, to) => {
  const existing = await scanDC({
    TableName: table,
  });
  existing.forEach(({ id, ...others }) => {
    if (others[from])
      updateDC({
        TableName: table,
        Key: { id },
        ExpressionAttributeValues: { [`:${from}`]: from },
        ExpressionAttributeNames: { [`#${from}`]: from },
        UpdateExpression: `SET ${to} = :${from} REMOVE #${from}`,
      });
  });
};

const deleteItemsFromGroups = async (table, groups) => {
  const existing = await scanDC({
    TableName: table,
  });
  existing
    .filter(({ userGroup }) => groups.includes(userGroup))
    .forEach(({ id, userGroup }) =>
      deleteDC(
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
  existing.forEach(({ id, ...others }) =>
    updateDC({
      TableName: table,
      Key: { id },
      ExpressionAttributeValues: { [`:${value}`]: value },
      UpdateExpression: `SET ${key} = :${value}`,
    })
  );
};

const copyAdminDataFromStagingToProd = () => {
  Object.entries(staging.admin).forEach(async ([table, TableName]) => {
    const stagingTableItems = await scanDC({ TableName });
    stagingTableItems.forEach((Item) =>
      putDC(
        {
          TableName: prod.admin[table],
          Item,
        },
        `Copying ${table} ${Item.name || Item.id} from staging to prod`
      )
    );
  });
};

const copyTemplatesFromStagingToProd = () => {
  Object.entries(staging.ops).forEach(async ([table, TableName]) => {
    const stagingTableItems = await scanDC({ TableName });
    stagingTableItems
      .filter(({ userGroup }) => ["Template", "Demo"].includes(userGroup))
      .forEach((Item) =>
        putDC(
          {
            TableName: prod.ops[table],
            Item,
          },
          `Copying ${table} ${Item[table] || Item.id} from staging to prod`
        )
      );
  });
};

// Object.values(staging).forEach((table) => updateData(table));
// addItem(staging.role, { hours: 0 });
// copyAdminDataFromStagingToProd();
copyTemplatesFromStagingToProd();
