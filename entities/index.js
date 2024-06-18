const Joi = require("joi");
const { hashPassword } = require("../utils/hash-verify-password");

const buildMakeUser = require("./user");
const makeUser = buildMakeUser(hashPassword, Joi);

const buildMakeUserPermissions = require("./user-permissions");
const makeUserPermissions = buildMakeUserPermissions(Joi);

const buildMakeUserReferral = require("./user-referral");
const makeUserReferral = buildMakeUserReferral(Joi);

const buildMakeMatch = require("./match");
const makeMatch = buildMakeMatch(Joi);

const buildMakeContest = require("./contest");
const makeContest = buildMakeContest(Joi);

const buildMakeContestInfo = require("./contest-info");
const makeContestInfo = buildMakeContestInfo(Joi);

module.exports = Object.freeze({
  makeUser,
  makeUserPermissions,
  makeUserReferral,
  makeContest,
  makeMatch,
  makeContestInfo,
});
