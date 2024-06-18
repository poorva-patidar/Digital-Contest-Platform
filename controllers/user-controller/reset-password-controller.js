const { resetPassword } = require('../../use-cases/user-use-cases')

module.exports = function buildResetPasswordController(
  response,
  constants,
  CustomError,
  jwt,
  JWT_SECRET
) {
  return async function resetPasswordController(req, res) {
    if(!req.body){
      response.error(res, constants.error.INCOMPLETE_DATA, constants.status.BAD_REQUEST);
      return false;
    }
  
    const { password } = req.body;
    const token = req.query.token;
  
    try {
      const { email } = jwt.verify(token, JWT_SECRET);
      await resetPassword(email, password);
      response.success(res, constants.success.USER_UPDATED, constants.status.OK);
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        response.error(res, error.message, error.statusCode);
      } else {
        console.log(error);
        response.error(
          res,
          constants.error.SERVER_ERROR,
          constants.status.SERVER_ERROR
        );
      }
      return false;
    }
  }
};