// Purpose: Define the user referral entity.
module.exports = function buildMakeUserReferral(Joi) {
  return function makeUserReferral({ referrerId, referredEmail, status } = {}) {
    // Validate user referral data
    const schema = Joi.object({
      referrerId: Joi.string().guid().required(),
      referredEmail: Joi.string().email().required(),
      status: Joi.string().valid("accepted", "invited").required(),
    });

    const { error } = schema.validate({
      referrerId,
      referredEmail,
      status,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    return Object.freeze({
      getReferrerId: () => referrerId,
      getReferredEmail: () => referredEmail,
      getStatus: () => status,
    });
  };
};
