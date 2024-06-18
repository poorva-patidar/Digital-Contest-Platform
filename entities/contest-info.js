// Purpose: To create a contest info entity
module.exports = function buildMakeContestInfo(Joi) {
  return function makeContestInfo({
    contestId,
    participantId,
    chosenTeam,
    scoreGuess,
    points = null,
    participantRank = null,
    prizeAmount = 0,
  } = {}) {
    
    // Validate contest info data
    const schema = Joi.object({
      contestId: Joi.string().guid().required(),
      participantId: Joi.string().guid().required(),
      chosenTeam: Joi.string().required(),
      scoreGuess: Joi.number().min(0).required(),
      points: Joi.number().min(0).allow(null),
      participantRank: Joi.number().min(1).allow(null),
      prizeAmount: Joi.number().min(0).default(0),
    });

    const { error } = schema.validate({
      contestId,
      participantId,
      chosenTeam,
      scoreGuess,
      points,
      participantRank,
      prizeAmount,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    return Object.freeze({
      getContestId: () => contestId,
      getParticipantId: () => participantId,
      getChosenTeam: () => chosenTeam,
      getScoreGuess: () => scoreGuess,
      getPoints: () => points,
      getParticipantRank: () => participantRank,
      getPrizeAmount: () => prizeAmount,
    });
  };
};
