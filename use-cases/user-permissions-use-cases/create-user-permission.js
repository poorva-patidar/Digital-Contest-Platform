const { makeUserPermissions } = require("../../entities");

module.exports = function buildCreateUserPermission({
  userPermissionsDb,
  constants,
  Joi,
}) {
  return async function createUserPermission(userId, permissions) {
    const schema = Joi.object({
      permissions: Joi.object().unknown(true).required(),
    });
    const { error } = schema.validate({ permissions });
    if (error) throw new Error(error.details[0].message);

    const userPermissions = makeUserPermissions({
      userId,
      status: constants.userStatus.INACTIVE,
      ...permissions,
    });

    return await userPermissionsDb.insert({
      userId: userPermissions.getUserId(),
      status: userPermissions.getStatus(),
      createUser: userPermissions.getCreateUser(),
      updateUser: userPermissions.getUpdateUser(),
      deleteUser: userPermissions.getDeleteUser(),
      createContest: userPermissions.getCreateContest(),
      updateContest: userPermissions.getUpdateContest(),
      deleteContest: userPermissions.getDeleteContest(),
    });
  };
};
