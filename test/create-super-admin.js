const { createUser } = require('../use-cases/user-use-cases');
const { CustomError, constants, response } = require('../utils');

async function createSuperAdminController(req, res) {
    try {
      const { name, email, password} = req.body;
  
      await createUser({
        name,
        email,
        password,
        role: "superadmin",
      });
  
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

  module.exports = createSuperAdminController;