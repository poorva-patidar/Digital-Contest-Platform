const { makeUserReferral } = require("../../entities");

module.exports = function buildSendReferral({
  userReferralDb,
  constants,
  CustomError,
  sendEmail,
  Joi,
}) {
  return async function sendReferral(referrerId, referredEmail, referralCode) {
    const newReferral = makeUserReferral({
      referrerId,
      referredEmail,
      status: constants.referralStatus.INVITED,
    });

    const schema = Joi.object({
      referralCode: Joi.number().required(),
    });

    const { error } = schema.validate({
      referralCode,
    });

    if (error) {
      throw Error(error.details[0].message);
    }
  
    const referral = await userReferralDb.findByReferrerAndReferred({
      referrerId,
      referredEmail,
    });

    if (referral) {
      throw new CustomError("Already referred", constants.status.BAD_REQUEST);
    }

    await sendEmail({
      email: referredEmail,
      subject: "Come join Digital contest platform",
      message: `Signup using this referral
      code to get 50 coins for free! REFERRAL CODE ${referralCode}`,
    });

    await userReferralDb.insert({
      referrerId: newReferral.getReferrerId(),
      referredEmail: newReferral.getReferredEmail(),
      status: newReferral.getStatus(),
    });
  };
};
