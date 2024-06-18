const { getContest } = require('../../use-cases/contest-use-cases');

module.exports = function buildGetContestController(response, constants, CustomError) {
  return async function getContestController(req, res) {
    const contestId = req.params.contestId;
    const user = req.user;
    try {
      const contest = await getContest(user.id, user.role, contestId);
      response.success(res, contest,  constants.status.OK,);
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