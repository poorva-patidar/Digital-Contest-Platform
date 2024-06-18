const Joi = require("joi");
const { userReferralDb } = require("../../data-access");
const { constants, CustomError, sendEmail } = require("../../utils");

const buildSendReferral = require("./send-referral");
const sendReferral = buildSendReferral({
  userReferralDb,
  constants,
  CustomError,
  sendEmail,
  Joi
});

const buildGetReferrals = require("./get-referrals");
const getReferrals = buildGetReferrals({
  userReferralDb,
  constants,
  CustomError,
  Joi,
});

module.exports = Object.freeze({
  sendReferral,
  getReferrals,
});
