module.exports = function buildSignInUser({
  userDb,
  constants,
  CustomError,
  verifyPassword,
  Joi,
}) {
  return async function signInUser(email, password) {
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

    if (!(await verifyPassword({ password, hashedPassword: user.password }))) {
      throw new CustomError(
        constants.error.INVALID_PASSWORD,
        constants.status.BAD_REQUEST
      );
    }
  };
};
