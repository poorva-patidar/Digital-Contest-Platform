const { checkAdminPermissions } = require("../../use-cases/user-permissions-use-cases");
const { deleteUser } = require('../../use-cases/user-use-cases');

module.exports = function buildDeleteUserController(
  response,
  constants,
  CustomError
) {
  return async function deleteUserController(req, res) {
    const userId = req.params.userId;

    try {
      await checkAdminPermissions(req.user.id, req.user.role, "delete_user");
      await deleteUser(userId);
      response.success(
        res,
        constants.success.USER_DELETED,
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
          constants.error.SERVER_ERROR,
          constants.status.SERVER_ERROR
        );
      }
      return false;
    }
  };
};
