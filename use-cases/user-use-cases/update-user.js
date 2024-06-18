const { makeUser, makeUserPermissions } = require("../../entities");

module.exports = function buildUpdateUser({
  userDb,
  userPermissionDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function updateUser(userId, userData) {
    const schema = Joi.object({ userId: Joi.string().required().guid() });
    const { error } = schema.validate({ userId });
    if (error) throw new Error(error.details[0].message);

    const user = await userDb.findById({ id: userId });
    if (!user) {
      throw new CustomError(
        constants.error.USER_NOT_FOUND,
        constants.status.NOT_FOUND
      );
    }

    if (user.id !== userId && user.role === "superadmin") {
      throw new CustomError(
        constants.error.UNAUTHORIZED,
        constants.status.UNAUTHORIZED
      );
    }

    if (user.role !== constants.role.USER && userData.permissions) {
      const permissionsToUpdate = await userPermissionDb.findByUserId({
        userId,
      });
      const updatedPermissions = makeUserPermissions({
        userId: permissionsToUpdate.user_id,
        status: permissionsToUpdate.status,
        createUser: permissionsToUpdate.create_user ? true : false,
        updateUser: permissionsToUpdate.update_user ? true : false,
        deleteUser: permissionsToUpdate.delete_user ? true : false,
        createContest: permissionsToUpdate.create_contest ? true : false,
        updateContest: permissionsToUpdate.update_contest ? true : false,
        deleteContest: permissionsToUpdate.delete_contest ? true : false,
        ...userData.permissions,
      });

      await userPermissionDb.updatePermissions({
        userId: updatedPermissions.getUserId(),
        permissions: {
          create_user: updatedPermissions.getCreateUser(),
          update_user: updatedPermissions.getUpdateUser(),
          delete_user: updatedPermissions.getDeleteUser(),
          create_contest: updatedPermissions.getCreateContest(),
          update_contest: updatedPermissions.getUpdateContest(),
          delete_contest: updatedPermissions.getDeleteContest(),
        },
      });
    }

    const updatedUser = await makeUser({
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role,
      balance: user.balance,
      referralCode: user.referral_code,
      createdAt: user.created_at,
      ...userData,
    });

    const exists = await userDb.findByEmail({ email: updatedUser.getEmail() });
    if (exists && exists.id != userId) {
      throw new CustomError(
        "Already present user!",
        constants.status.BAD_REQUEST
      );
    }

    return await userDb.update({
      id: userId,
      data: {
        name: updatedUser.getName(),
        email: updatedUser.getEmail(),
        password: updatedUser.getPassword(),
      },
    });
  };
};
