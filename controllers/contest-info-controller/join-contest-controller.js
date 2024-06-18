const { joinContest } = require('../../use-cases/contest-info-use-cases');

module.exports = function buildJoinContestController(response, constants, CustomError) {
    return async function joinContestController(req, res) {
        try {
            const user = req.user;
            const contestId = req.params.contestId;
            await joinContest(user.id, user.role, user.balance, contestId, req.body);
            response.success(res, "Contest Joined successfully", constants.status.CREATED);
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