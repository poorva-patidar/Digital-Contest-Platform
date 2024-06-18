module.exports = function buildGetUserByEmail({
  userDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function getUserByEmail(email) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate({
      email,
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
    return user;
  };
};
