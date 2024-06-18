const Joi = require('joi')
const { CustomError, constants } = require("../../utils");
const { contestInfoDb, userDb, contestDb } = require("../../data-access");

const buildGetContestResult = require("./get-contest-result");
const getContestResult = buildGetContestResult({
  contestInfoDb,
  contestDb,
  constants,
  CustomError,
  Joi
});

const buildJoinContest = require("./join-contest");
const joinContest = buildJoinContest({
  contestInfoDb,
  contestDb,
  userDb,
  constants,
  CustomError,
  Joi
});

const buildCalculateAndUpdateResult = require("./calculate-results");
const calculateAndUpdateResult = buildCalculateAndUpdateResult({
  contestInfoDb,
  userDb,
});

module.exports = Object.freeze({
  getContestResult,
  joinContest,
  calculateAndUpdateResult,
});
