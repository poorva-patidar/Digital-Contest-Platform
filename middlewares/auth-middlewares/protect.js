const { getUserByEmail } = require('../../use-cases/user-use-cases');

module.exports = function buildProtect(response, constants, CustomError, jwt, JWT_SECRET) {
 
  return async function protect(req, res) {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"] || "";
    if (authHeader && authHeader.split(" ")[0] === "Bearer") {
      try {
        const token = authHeader.split(" ")[1];
        const { email } = jwt.verify(token, JWT_SECRET);
        const user = await getUserByEmail(email);
        req.user = user;
        return true;
      } catch (error) {
        console.log(error);
        if (error instanceof jwt.TokenExpiredError) {
          response.error(
            res,
            constants.error.TOKEN_EXPIRED,
            constants.status.UNAUTHORIZED
          );
        } else if(error instanceof CustomError){
          response.error(res, error.message, error.statusCode);
        }else {
          response.error(
            res,
            constants.error.SERVER_ERROR,
            constants.status.SERVER_ERROR
          );
        }

        return false;
      }
    } else {
      response.error(
        res,
        constants.error.NO_AUTH_TOKEN,
        constants.status.UNAUTHORIZED
      );
      return false;
    }
  };
};
