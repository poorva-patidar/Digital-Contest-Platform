const Joi = require('joi')

const {
  CustomError,
  constants,
  sendEmail,
  generateCode,
} = require("../../utils");

const {
  userDb,
  contestDb,
  contestInfoDb,
  matchDb,
} = require("../../data-access");

const { calculateAndUpdateResult } = require("../contest-info-use-cases");

const buildCreateContest = require("./create-contest");
const createContest = buildCreateContest({
  contestDb,
  matchDb,
  generateCode,
  constants,
  CustomError,
  Joi
});

const buildGetContestByMatch = require("./get-contest-by-match");
const getContestByMatch = buildGetContestByMatch({
  contestDb,
  constants,
  CustomError,
  Joi
});

const buildDeleteContest = require("./delete-contest");
const deleteContest = buildDeleteContest({
  contestDb,
  contestInfoDb,
  userDb,
  constants,
  CustomError,
  Joi
});

const buildGetHostedContest = require("./get-hosted-contest");
const getHostedContest = buildGetHostedContest({
  contestDb,
  constants,
  CustomError,
  Joi
});

const buildGetContest = require("./get-contest");
const getContest = buildGetContest({ contestDb, constants, CustomError, Joi });

const buildGetParticipatedContest = require("./get-participated-contest");
const getParticipatedContest = buildGetParticipatedContest({
  contestDb,
  contestInfoDb,
  constants,
  CustomError,
  Joi
});

const buildUpdateContest = require("./update-contest");
const updateContest = buildUpdateContest({
  contestDb,
  contestInfoDb,
  constants,
  CustomError,
  Joi
});

const buildSendContestInvite = require("./send-contest-invite");
const sendContestInvite = buildSendContestInvite({
  contestDb,
  constants,
  CustomError,
  sendEmail,
  Joi
});

const buildUpdateContests = require("./update-contests");
const updateContests = buildUpdateContests({
  contestDb,
  contestInfoDb,
  userDb,
  constants,
  calculateAndUpdateResult,
  Joi
});

module.exports = Object.freeze({
  createContest,
  getContestByMatch,
  deleteContest,
  getHostedContest,
  getContest,
  getParticipatedContest,
  updateContest,
  sendContestInvite,
  updateContests,
});
