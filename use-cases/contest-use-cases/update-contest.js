const { makeContest } = require("../../entities");

module.exports = function buildUpdateContest({
  contestDb,
  contestInfoDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function updateContest(
    userId,
    userRole,
    contestId,
    contestData
  ) {
    const schema = Joi.object({
      userId: Joi.string().required().guid(),
      userRole: Joi.string().required().valid("user", "admin", "superadmin"),
      contestId: Joi.string().required().guid(),
    });
    const { error } = schema.validate({ userId, userRole, contestId });
    if (error) throw new Error(error.details[0].message);

    const contest = await contestDb.findById({ id: contestId });
    if (!contest) {
      throw new CustomError(
        constants.error.NO_CONTEST,
        constants.status.NOT_FOUND
      );
    }

    if (userRole === constants.role.USER && contest.created_by !== userId) {
      throw new CustomError(
        constants.error.UNAUTHORIZED,
        constants.status.UNAUTHORIZED
      );
    }

    if (contest.status !== constants.contestStatus.UPCOMING) {
      throw new CustomError(
        constants.error.CONTEST_LIVE,
        constants.status.BAD_REQUEST
      );
    }

    if (contestData.entryFee || contestData.matchId) {
      const participants = await contestInfoDb.getParticipants({ contestId });
      if (participants.length > 0) {
        throw new CustomError(
          "Participants exist cannot update now!",
          constants.status.BAD_REQUEST
        );
      }
    }

    const updatedContest = makeContest({
      name: contest.name,
      contestCode: contest.contest_code,
      type: contest.type,
      status: contest.status,
      noOfParticipants: contest.no_of_participants,
      entryFee: contest.entry_fee,
      totalWinner: contest.total_winner,
      createdBy: contest.created_by,
      matchId: contest.match_id,
      ...contestData,
    });

    return contestDb.update({
      id: contest.id,
      data: {
        name: updatedContest.getName(),
        no_of_participants: updatedContest.getNoOfParticipants(),
        entry_fee: updatedContest.getEntryFee(),
        total_winner: updatedContest.getTotalWinner(),
        match_id: updatedContest.getMatchId(),
      },
    });
  };
};
