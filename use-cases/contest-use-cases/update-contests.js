module.exports = function buildUpdateContests({
  contestDb,
  contestInfoDb,
  userDb,
  constants,
  calculateAndUpdateResult,
  Joi,
}) {
  return async function updateContests(match) {
    const schema = Joi.object({
      match: Joi.object().unknown(true).required(),
    });
    const { error } = schema.validate({ match });
    if (error) throw new Error(error.details[0].message);

    const contests = await contestDb.findByMatchId({matchId: match._id});

    for (const contest of contests) {
      if (match.matchStatus === constants.matchStatus.FINISHED) {
        // If match finished, calculate and update result of contest
        const participants = await contestInfoDb.findByContest({
          contestId: contest.id,
        });
        if (participants.length) {
          await calculateAndUpdateResult(match, contest, participants);
        }
        await contestDb.update({
          id: contest.id,
          data: { status: "Finished" },
        });
      } else if (match.matchStatus === constants.matchStatus.LIVE) {
        await contestDb.update({
          id: contest.id,
          data: { status: "Live" },
        });
      } else if (match.matchStatus === constants.matchStatus.ABANDONED) {
        // If match abandoned, update balance of all participants and cancel the contest
        const participants = await contestInfoDb.findByContest({
          contestId: contest.id,
        });
        const participantIds = participants.map(
          (participant) => participant.participant_id
        );
        for (let participantId of participantIds) {
          await userDb.updateBalance({
            id: participantId,
            amount: contest.entry_fee,
          });
        }
        await contestDb.update({
          id: contest.id,
          data: { status: "Cancelled" },
        });
      }
    }
  };
};
