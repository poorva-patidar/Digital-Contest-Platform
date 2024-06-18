const { activateUser } = require('../../use-cases/user-use-cases');

module.exports = function buildActivateUserController(
  response,
  constants,
  CustomError,
  jwt,
  JWT_SECRET
) {
  return async function activateUserController(req, res) {
    const { password } = req.body;
    const token = req.query.token;

    if(!token){
      response.error(
        res,
        "No token provided",
        constants.status.SERVER_ERROR
      );
    }
    
    try {
      const { email } = jwt.verify(token, JWT_SECRET);
      await activateUser(email, password);
      response.success(
        res,
        constants.success.USER_ACTIVATED,
        constants.status.OK
      );
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        response.error(res, error.message, error.statusCode);
      } else {
        response.error(
          res,
          error.message,
          constants.status.SERVER_ERROR
        );
      }
      return false;
    }
  };
};
