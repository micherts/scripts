import { getReasonPhrase } from "http-status-codes";
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
import { readFileSync } from "fs";
const { region } = JSON.parse(readFileSync("../env.json", "utf8"));


const client = new DynamoDBClient({ region });
const dc = DynamoDBDocumentClient.from(client);

const cl = (a, b) => (a ? console.log(a, b || "") : null);

const verifyParams = (func, params) => {
  const invalid = Object.entries(params).reduce(
    (acc, [k, v]) => (v ? acc : [...acc, k]),
    []
  );
  invalid.forEach((a) =>
    console.log(`${func}: parameter "${a}" is undefined.`)
  );
  return invalid;
};

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

const deleteItem = (params, log) =>
  verifyParams("deleteItem", params).length ? null : deleteDC(params, log);

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

export { getDC, putDC, updateDC, queryDC, scanDC, deleteItem, getExpression };
