const pool = require("./database");
const { constants, CustomError } = require("../utils");

const buildUserDb = require("./user-db");
const userDb = buildUserDb({ pool, constants, CustomError });

const buildUserReferralDb = require("./user-referral-db");
const userReferralDb = buildUserReferralDb({ pool, constants, CustomError });

const buildUserPermissionsDb = require("./user-permission-db");
const userPermissionsDb = buildUserPermissionsDb({
  pool,
  constants,
  CustomError,
});

const buildMatchDb = require("./match-db");
const matchDb = buildMatchDb({ pool, constants, CustomError });

const buildContedtDb = require("./contest-db");
const contestDb = buildContedtDb({ pool, constants, CustomError });

const buildContestInfoDb = require("./contest-info-db");
const contestInfoDb = buildContestInfoDb({ pool, constants, CustomError });

module.exports = Object.freeze({
  userDb,
  userReferralDb,
  userPermissionsDb,
  contestInfoDb,
  contestDb,
  matchDb,
});
