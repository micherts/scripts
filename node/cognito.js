/* eslint-disable no-console */
import { getReasonPhrase } from "http-status-codes";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
  AdminDeleteUserCommand,
  AdminRemoveUserFromGroupCommand,
  CreateGroupCommand,
  DeleteGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { v4 as uuidv4 } from "uuid";
import { region } from "./env.js";

const client = new CognitoIdentityProviderClient({ region });

const cl = (a, b) => (a ? console.log(a, b || "") : null);

const addUserToGroup = async ({ userGroup, userId, UserPoolId }, log) => {
  cl(log);
  const {
    $metadata: { httpStatusCode },
  } = await client.send(
    new AdminAddUserToGroupCommand({
      GroupName: userGroup,
      UserPoolId,
      Username: userId,
    })
  );
  cl(log, getReasonPhrase(httpStatusCode));
};

const addUserToGroups = ({ userId, groups, UserPoolId }) =>
  userId
    ? Promise.all(
        groups.map((userGroup) =>
          addUserToGroup(
            { userGroup, userId, UserPoolId },
            `Add user ${userId} to group ${userGroup}.`
          )
        )
      )
    : undefined;

const addUserToTemplateGroups = (
  userId,
  { config: { templateGroups, UserPoolId } }
) => addUserToGroups({ userId, groups: templateGroups, UserPoolId });

const removeUserFromGroup = async (params, log) => {
  // params = {Username, GroupName, UserPoolId}
  cl(log);
  const {
    $metadata: { httpStatusCode },
  } = await client.send(new AdminRemoveUserFromGroupCommand(params));
  cl(log, getReasonPhrase(httpStatusCode));
};

// const removeUserFromGroups = ({ userId, groups }) =>
//   userId
//     ? Promise.all(
//         groups.map((userGroup) =>
//           removeUserFromGroup(
//             { userGroup, userId },
//             `Remove user ${userId} from group ${userGroup}.`
//           )
//         )
//       )
//     : undefined;

// const removeUserFromTemplateGroups = ({ userId, quantity }) =>
//   quantity === 0
//     ? removeUserFromGroups({ userId, groups: templateGroups })
//     : undefined;

const createGroup = async (UserPoolId, log) => {
  cl(log);
  const {
    $metadata: { httpStatusCode },
    Group: { GroupName },
  } = await client.send(
    new CreateGroupCommand({
      GroupName: `${uuidv4()}`,
      UserPoolId,
    })
  );
  cl(log, `${GroupName} ${getReasonPhrase(httpStatusCode)}`);
  return GroupName;
};

const createGroups = (qty, UserPoolId) =>
  Promise.all(
    Array.from(Array(qty)).map(() =>
      createGroup(UserPoolId, "Create new user group.")
    )
  );

const deleteGroup = async (params, log) => {
  // params = {GroupName, UserPoolId}
  cl(log);
  const {
    $metadata: { httpStatusCode },
  } = await client.send(new DeleteGroupCommand(params));
  cl(log, getReasonPhrase(httpStatusCode));
};

// const deleteGroups = (groups, UserPoolId) =>
//   Promise.all(
//     groups.map((userGroup) =>
//       userGroup
//         ? deleteGroup(userGroup, `Delete user group ${userGroup}.`)
//         : undefined
//     )
//   );

const delUser = async (params, log) => {
  // params = {Username, UserPoolId}
  cl(log);
  const {
    $metadata: { httpStatusCode },
  } = await client.send(new AdminDeleteUserCommand(params));
  cl(log, getReasonPhrase(httpStatusCode));
};

// const deleteUsers = (usernames, UserPoolId) =>
//   Promise.all(
//     usernames.map((Username) =>
//       Username
//         ? deleteUser({Username, UserPoolId}, `Delete user ${Username}.`)
//         : undefined
//     )
//   );

export {
  addUserToGroups,
  addUserToTemplateGroups,
  removeUserFromGroup,
  // removeUserFromTemplateGroups,
  createGroups,
  deleteGroup,
  delUser,
};

// const unsubscribeGroup = async ({ group }, log1) => {
//   cl(log1);
//   const getUsers = async (log2) => {
//     cl(log2);
//     const getUsersBatch = (NextToken) =>
//       client.send(
//         new ListUsersInGroupCommand({
//           GroupName: group,
//           NextToken,
//           UserPoolId,
//         })
//       );
//     let { NextToken: token, Users: allUsers } = await getUsersBatch();
//     while (token && token.length) {
//       const { NextToken, Users } = getUsersBatch(token);
//       allUsers = [...allUsers, ...Users];
//       token = NextToken;
//     }
//     cl(log2, `Count: ${allUsers.length}`);
//     return allUsers;
//   };
//   const users = getUsers(`Get users for group ${group}.`);
//   cl(`Remove users from group ${group}.`);
//   const responses = await Promise.all(
//     users.map(({ Username }) =>
//       client.send(
//         new AdminRemoveUserFromGroupCommand({
//           GroupName: group,
//           UserPoolId,
//           Username,
//         })
//       )
//     )
//   );
//   users.map((user, i) => cl(user, getReasonPhrase(responses[i].$metadata.httpStatusCode)));
//   cl(log1, `Completed`);
// };
