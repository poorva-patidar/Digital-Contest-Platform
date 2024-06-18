const { response, CustomError, constants } = require('../../utils');

const buildGetContestResultController = require('./get-contest-result-controller');
const getContestResultController = buildGetContestResultController(response, constants, CustomError);

const buildJoinContestController = require("./join-contest-controller");
const joinContestController = buildJoinContestController(response, constants, CustomError);

module.exports = {
    getContestResultController,
    joinContestController
}

