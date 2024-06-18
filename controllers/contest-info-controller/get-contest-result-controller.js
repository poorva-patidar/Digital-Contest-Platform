const { getContestResult } = require('../../use-cases/contest-info-use-cases');

module.exports = function buildGetContestResultController(response, constants, CustomError) {
    return async function getContestResultController(req, res) {
        try {
            const user = req.user;
            const contestId = req.params.contestId;
            const contestResult = await getContestResult(user.id, user.role, contestId);
            response.success(res, contestResult, constants.status.OK);
        } catch (error) {
            console.log(error);
            if (error instanceof CustomError) {
                response.error(res, error.message, error.statusCode);
            } else {
                response.error(res, constants.error.SERVER_ERROR, constants.status.SERVER_ERROR);
            }
        }
    };
}