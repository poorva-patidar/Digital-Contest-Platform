const { getUserById } = require('../../use-cases/user-use-cases');

module.exports = function buildGetUserController(
  response,
  constants,
  CustomError
) {
  return async function getUserController(req, res) {
    const userId = req.params.userId;

    try {
      const user = await getUserById(userId);
      response.success(res, user, constants.status.OK);
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
