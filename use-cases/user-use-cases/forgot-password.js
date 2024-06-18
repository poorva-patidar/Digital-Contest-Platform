module.exports = function buildForgotPassword({
  userDb,
  constants,
  CustomError,
  jwt,
  sendEmail,
  CLIENT_URL,
  JWT_SECRET,
  Joi,
}) {
  return async function forgotPassword(email) {
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate({ email });
    if (error) throw new Error(error.details[0].message);

    const user = await userDb.findByEmail({ email });
    if (!user) {
      throw new CustomError(
        constants.error.USER_NOT_FOUND,
        constants.status.NOT_FOUND
      );
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "15m" });
    await sendEmail({
      email: email,
      subject: "Reset your password",
      message: `<h1>Welcome to Digital Contest Platform.</h1> 
                <p>Please click on the link to reset your password:</p> 
                <a href=${CLIENT_URL}/frontend/html/reset-password.html?token=${token}>Reset password link</a>
                <p>The link will expire in 15 min.</p>`,
    });
  };
};
