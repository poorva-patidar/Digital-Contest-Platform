const { makeUser } = require("../../entities");

module.exports = function buildResetPassword({
  userDb,
  CustomError,
  constants,
  Joi
}) {
  return async function resetPassword(email, password) {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate({ email, password });
    if (error) throw new Error(error.details[0].message);
    

    const user = await userDb.findByEmail({ email });
    if (!user) {
      throw new CustomError(
        constants.error.USER_NOT_FOUND,
        constants.status.NOT_FOUND
      );
    }

    await userDb.updatePassword({ email, password });
  };
};
