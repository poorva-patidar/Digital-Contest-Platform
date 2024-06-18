const { getParticipatedContest } = require('../../use-cases/contest-use-cases');

module.exports = function buildGetParticipatedContestController(response, constants, CustomError) {
    return async function getParticipatedContestController(req, res) {
        try {
            const user = req.user;
            const contests = await getParticipatedContest(user.id);
            response.success(res, contests, constants.status.OK);
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