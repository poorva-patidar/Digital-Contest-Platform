module.exports = function buildGetReferrals({
  userReferralDb,
  constants,
  CustomError,
  Joi
}) {
  return async function getReferrals(referrerId) {
    const schema = Joi.object({
      referrerId: Joi.string().guid().required()
    });

    const { error } = schema.validate({
      referrerId,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    const referrals = await userReferralDb.findByReferrerId({ referrerId });
    if (!referrals.length) {
      throw new CustomError(
        constants.error.NO_REFERRAL,
        constants.status.NOT_FOUND
      );
    }

    return referrals;
  };
};
