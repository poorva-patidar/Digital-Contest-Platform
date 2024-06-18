const { getMatches } = require('../../use-cases/match-use-cases');

module.exports = function buildGetMatchesController(
  response,
  constants,
  CustomError
) {
  return async function getMatchesController(req, res) {
    const sort = req.query.sort;
    const order = req.query.order;
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;
  
    try {
      const matches = await getMatches(sort, order, limit, offset);
      response.success(res, matches, constants.status.OK);
      return true;
    } catch (error){
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
