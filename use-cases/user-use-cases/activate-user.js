const { makeUser } = require("../../entities");

module.exports = function buildActivateUser({
  userDb,
  userPermissionDb,
  constants,
  CustomError,
  Joi
}) {
  return async function activateUser(email, password) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({
      email,
      password,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    const user = await userDb.findByEmail({ email });
    if (!user) {
      throw new CustomError(
        constants.error.USER_NOT_FOUND,
        constants.status.NOT_FOUND
      );
    }

    if (user.password) {
      throw new CustomError(
        constants.error.USER_ALREADY_ACTIVATED,
        constants.status.BAD_REQUEST
      );
    }

    user.password = password;
    await userDb.updatePassword({ email, password});
    await userPermissionDb.updateStatus({
      userId: user.id,
      status: constants.userStatus.ACTIVE,
    });
  };
};
