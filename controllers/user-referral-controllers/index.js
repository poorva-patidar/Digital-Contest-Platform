const { response, CustomError, constants } = require('../../utils');

const buildGetReferralsController = require('./get-referrals-controller');
const getReferralsController = buildGetReferralsController(response, constants, CustomError);

const buildSendReferralController = require('./send-referral-controller');
const sendReferralController =  buildSendReferralController(response, constants, CustomError);

module.exports = Object.freeze({
    getReferralsController,
    sendReferralController
});