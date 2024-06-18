const { response, CustomError, constants } = require('../../utils');

const buildGetMatchController = require('./get-match-controller');
const getMatchController = buildGetMatchController(response, constants, CustomError);

const buildGetMatchesController = require('./get-matches-controller');
const getMatchesController = buildGetMatchesController(response, constants, CustomError);

module.exports = Object.freeze({
    getMatchController,
    getMatchesController,
});