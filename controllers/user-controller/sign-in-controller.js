const { signInUser } = require('../../use-cases/user-use-cases');

module.exports = function buildSignInController(response, constants, CustomError, setToken) {
    return async function signInController(req, res) {
        const { email, password, rememberMe } = req.body;
      
        try {
          await signInUser(email, password);
          let cookie = setToken(rememberMe, email);
          response.success(
            res,
            constants.success.USER_LOGGED_IN,
            constants.status.OK,
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
