module.exports = function buildCheckAdminPermissions({
  userPermissionDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function checkAdminPermissions(userId, userRole, permission) {
    const schema = Joi.object({
      userId: Joi.string().required().guid(),
      userRole: Joi.string().required().valid("user", "admin", "superadmin"),
      permission: Joi.string()
        .required()
        .valid(
          "create_user",
          "update_user",
          "delete_user",
          "create_contest",
          "update_contest",
          "delete_contest"
        ),
    });

    const { error } = schema.validate({ userId, userRole, permission });
    if (error) throw new Error(error.details[0].message);

    if (userRole === constants.role.ADMIN) {
      const permissions = await userPermissionDb.findByUserId({ userId });
      if (!permissions[permission]) {
        throw new CustomError(
          constants.error.UNAUTHORIZED,
          constants.status.UNAUTHORIZED
        );
      }
    }
  };
};
