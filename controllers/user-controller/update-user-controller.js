const { checkAdminPermissions } = require("../../use-cases/user-permissions-use-cases");

const { updateUser } = require('../../use-cases/user-use-cases');

module.exports = function buildUpdateUserController(
  response,
  constants,
  CustomError
) {
  return async function updateUserController(req, res) {
    const userId = req.params.userId;


    try {
      await checkAdminPermissions(req.user.id, req.user.role, "update_user");
      await updateUser(userId, req.body);
      response.success(
        res,
        constants.success.USER_UPDATED,
        constants.status.OK
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
  };
};
