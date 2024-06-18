const { response, CustomError, constants } = require('../../utils');

const buildCreateContestController = require("./create-contest-controller");
const createContestController = buildCreateContestController(response, constants, CustomError);

const buildGetContestByMatchController = require("./get-contest-by-match-controller");
const getContestByMatchController = buildGetContestByMatchController(response, constants, CustomError);

const buildDeleteContestController = require("./delete-contest-controller");
const deleteContestController = buildDeleteContestController(response, constants, CustomError);

const buildGetContestController = require("./get-contest-controller");
const getContestController = buildGetContestController(response, constants, CustomError);

const buildGetHostedContestController = require("./get-hosted-contest-controller");
const getHostedContestController = buildGetHostedContestController(response, constants, CustomError);

const buildGetParticipatedContestController = require("./get-participated-contest-controller");
const getParticipatedContestController = buildGetParticipatedContestController(response, constants, CustomError);

const buildUpdateContestController = require("./update-contest-controller");
const updateContestController = buildUpdateContestController(response, constants, CustomError);

const buildSendContestInviteController = require("./send-contest-invite-controller");
const sendContestInviteController = buildSendContestInviteController(response, constants, CustomError);

module.exports = Object.freeze({
    createContestController,
    getContestByMatchController,
    deleteContestController,
    getContestController,
    getHostedContestController,
    getParticipatedContestController,
    updateContestController,
    sendContestInviteController,
});
