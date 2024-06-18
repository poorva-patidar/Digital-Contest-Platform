const { createUser } = require('../../use-cases/user-use-cases');

module.exports = function buildSignUpController(response, constants, CustomError, setToken) {
  return async function signUpController(req, res) {
    const { name, email, password, referralCode, rememberMe } = req.body;
  
    try {
      await createUser({ name, email, password, role: constants.role.USER, appliedCode: referralCode });
  
      let cookie = setToken(rememberMe, email);
      response.success(
        res,
        constants.success.USER_CREATED,
        constants.status.CREATED,
        {
          "Set-Cookie": cookie,
        }
      );
      return true;
    } catch (error) {
      if (error instanceof CustomError) {
        response.error(res, error.message, error.statusCode);
      } else {
        console.log(error);
        response.error(
          res,
          error.message,
          constants.status.SERVER_ERROR
        );
      }
      return false;
    }
  }
}