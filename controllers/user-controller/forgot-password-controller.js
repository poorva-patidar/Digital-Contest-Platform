const { forgotPassword } = require('../../use-cases/user-use-cases')

module.exports = function buildForgotPasswordController(
  response,
  constants,
  CustomError
) {
  return async function forgotPasswordController(req, res) {
    if (!req.body) {
      response.error(
        res,
        constants.error.INCOMPLETE_DATA,
        constants.status.BAD_REQUEST
      );
      return false;
    }

    const { email } = req.body;

    try {
      await forgotPassword(email);     
      response.success(res, constants.success.EMAIL_SENT, constants.status.OK);
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        response.error(res, error.message, error.statusCode);
      } else {
        response.error(
          res,
          constants.error.SERVER_ERROR,
          constants.status.SERVER_ERROR
        );
      }
      return false;
    }
  };
};
