const { sendReferral } = require('../../use-cases/user-referrals-use-cases');

module.exports = function buildSendReferralController(
  response,
  constants,
  CustomError
) {
  return async function sendReferralController(req, res) {
    const { email } = req.body;
    const { id, referral_code } = req.user;

    try {
      await sendReferral(id, email, referral_code);
      response.success(
        res,
        constants.success.REFERRAL_SENT,
        constants.status.OK
      );
      return true;
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        response.error(res, error.message, error.statusCode);
      } else {
        response.error(res, error.message, constants.status.SERVER_ERROR);
      }
      return false;
    }
  };
};
