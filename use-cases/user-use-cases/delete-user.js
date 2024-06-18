module.exports = function buildDeleteUser({
  userDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function deleteUser(userId) {
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

    await userDb.remove({ userId });
  };
};
