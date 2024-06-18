const { updateContest } = require('../../use-cases/contest-use-cases');
const { checkAdminPermissions } = require('../../use-cases/user-permissions-use-cases');

module.exports = function buildUpdateContestController(response, constants, CustomError) {
    return async function updateContestController(req, res) {
        try {
            const user = req.user;
            const { contestId } = req.params;
            await checkAdminPermissions(user.id, user.role, "update_contest");
            await updateContest(user.id, user.role, contestId, req.body);
            response.success(res, constants.success.CONTEST_UPDATED, constants.status.OK);
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) {
                response.error(res, error.message, error.statusCode);
            } else {
                response.error(res, error.message, constants.status.SERVER_ERROR);
            }
        }
    };
}