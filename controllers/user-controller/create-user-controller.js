const { createUser } = require('../../use-cases/user-use-cases');
const { checkAdminPermissions, createUserPermission } = require('../../use-cases/user-permissions-use-cases');

module.exports = function buildCreateUserController(
    response,
    constants,
    CustomError
    ) {
    return async function createUserController(req, res) {
        try {
          const user = req.user;
          await checkAdminPermissions(user.id, user.role, "create_user");
          const { name, email, permissions } = req.body;
      
          const newUserId = await createUser({ name, email, role: constants.role.ADMIN });
          await createUserPermission(newUserId, permissions);
      
          response.success(
            res,
            constants.success.USER_CREATED,
            constants.status.CREATED
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
}