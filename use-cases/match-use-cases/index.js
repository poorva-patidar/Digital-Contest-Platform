const Joi = require("joi");
const { CustomError, constants, getMatchUpdates } = require("../../utils");
const { matchDb } = require("../../data-access");
const { updateContests } = require("../../use-cases/contest-use-cases");

const buildGetMatches = require("./get-matches");
const getMatches = buildGetMatches({ matchDb, constants, CustomError });

const buildGetMatch = require("./get-match");
const getMatch = buildGetMatch({ matchDb, constants, CustomError, Joi });

const buildUpdateMatches = require("./update-matches");
const updateMatches = buildUpdateMatches({
  matchDb,
  constants,
  CustomError,
  getMatchUpdates,
  updateContests,
});

module.exports = Object.freeze({
  getMatches,
  getMatch,
  updateMatches,
});
