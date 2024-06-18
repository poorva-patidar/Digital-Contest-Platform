const { getContestByMatch } = require('../../use-cases/contest-use-cases');

module.exports = function buildGetContestByMatchController(response, constants, CustomError) {
  return async function getContestByMatchController(req, res) {
    const user = req.user;
    const matchId = req.params.matchId;
    try {
      const contest = await getContestByMatch(user.id, matchId);
      response.success(res, contest, constants.status.OK);
    } catch (error) {
      console.log(error);
        if (error instanceof CustomError) {
          response.error(res, error.message, error.status);
        } else {
            response.error(
                res,
                constants.error.SERVER_ERROR,
                constants.status.SERVER_ERROR
            );
        }
    }
  };
}