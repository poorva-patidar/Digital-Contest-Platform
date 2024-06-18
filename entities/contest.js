// Purpose: To create a contest entity
module.exports = function buildMakeContest(Joi) {
  return function makeContest({
    name,
    contestCode,
    type,
    status,
    noOfParticipants,
    entryFee,
    totalWinner,
    createdBy,
    matchId,
  } = {}) {
    
    // Validate contest data
    const schema = Joi.object({
      name: Joi.string().required(),
      contestCode: Joi.number().required(),
      type: Joi.string().valid("mega", "private").required(),
      status: Joi.string()
        .valid("Upcoming", "Live", "Cancelled", "Finished")
        .required(),
      noOfParticipants: Joi.number().min(2).required(),
      entryFee: Joi.number().min(0).required(),
      totalWinner: Joi.number().min(1).required(),
      createdBy: Joi.string().guid().required(),
      matchId: Joi.string().min(6).required(),
    });

    const { error } = schema.validate({
      name,
      contestCode,
      type,
      status,
      noOfParticipants,
      entryFee,
      totalWinner,
      createdBy,
      matchId,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    return Object.freeze({
      getName: () => name,
      getContestCode: () => contestCode,
      getType: () => type,
      getStatus: () => status,
      getNoOfParticipants: () => noOfParticipants,
      getEntryFee: () => entryFee,
      getTotalWinner: () => totalWinner,
      getCreatedBy: () => createdBy,
      getMatchId: () => matchId,
    });
  };
};
