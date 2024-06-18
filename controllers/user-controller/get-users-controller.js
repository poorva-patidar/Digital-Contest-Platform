const { getUsers } = require('../../use-cases/user-use-cases');

module.exports = function buildGetUsersController(
  response,
  constants,
  CustomError
) {
  return async function getUsersController(req, res) {
    const sort = req.query.sort;
    const order = req.query.order;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;
    
    try {
      const users = await getUsers(sort, order, limit, offset);
      response.success(res, users, constants.status.OK);
      return true;
    } catch (error) {
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
  }
};