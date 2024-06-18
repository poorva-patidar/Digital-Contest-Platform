const { getReferrals } = require('../../use-cases/user-referrals-use-cases');

module.exports = function buildGetReferralsController(
  response,
  constants,
  CustomError
) {
  return async function getReferralsController(req, res) {
    const { id } = req.user;

    try {
      const referrals = await getReferrals(id);
      response.success(res, referrals, constants.status.OK);
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
