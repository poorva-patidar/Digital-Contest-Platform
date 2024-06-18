const { createContest } = require('../../use-cases/contest-use-cases');
const { checkAdminPermissions } = require('../../use-cases/user-permissions-use-cases')

module.exports = function buildCreateContestController(
  response,
  constants,
  CustomError,
) {
  return async function createContestController(req, res) {
    const user = req.user;
    try {
      await checkAdminPermissions(user.id, user.role, "create_contest");
      await createContest(user.id, user.role, { ...req.body});
      response.success(
        res,
        constants.success.CONTEST_CREATED,
        constants.status.CREATED
      );
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
    }
  };
};
