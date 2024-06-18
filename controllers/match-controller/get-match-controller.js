const { getMatch } = require('../../use-cases/match-use-cases');

module.exports = function buildGetMatchController(
  response,
  constants,
  CustomError
) {
  return async function getMatchController(req, res) {
    const matchId = req.params.matchId;

    try {
      const match = await getMatch(matchId);
      response.success(res, match, constants.status.OK);
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        response.error(res, error.message, error.statusCode);
      } else {
        response.error(res, constants.error.SERVER_ERROR, constants.status.SERVER_ERROR);
      }
      return false;
    }
  };
};
