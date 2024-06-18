const { getHostedContest } = require('../../use-cases/contest-use-cases');

module.exports =  function buildGetHostedContestController(response, constants, CustomError) {
  return async function getHostedContestController(req, res) {
    const user = req.user;
    try {
      const contests = await getHostedContest(user.id);
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