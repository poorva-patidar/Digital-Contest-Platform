const { deleteContest} = require('../../use-cases/contest-use-cases');
const { checkAdminPermissions } = require('../../use-cases/user-permissions-use-cases');

module.exports = function buildDeleteContestController(response, constants, CustomError) {
    return async function deleteContestController(req, res) {
        try {
            const user = req.user;
            const { contestId } = req.params;
            await checkAdminPermissions(user.id, user.role, "delete_contest");
            await deleteContest(user.id, user.role, contestId);
            response.success(res, constants.success.CONTEST_DELETED, constants.status.OK);
        } catch (error) {
            console.log(error);
            if(error instanceof CustomError) {
              response.error(res, error.message, error.statusCode);
            } else {
              response.error(res, constants.error.SERVER_ERROR, constants.status.SERVER_ERROR);
            }
        }
    };
}