module.exports = function buildGetContestResult({
  contestInfoDb,
  contestDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function getContestResult(userId, userRole, contestId) {
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

    const contestInfo = await contestInfoDb.findByContest({ contestId });
    if (!contestInfo.length) {
      throw new CustomError(
        "No participants found",
        constants.status.NOT_FOUND
      );
    }

    if (userRole === constants.role.USER && userId !== contest.created_by) {
      const participant = contestInfo.find(
        (participant) => participant.participant_id === userId
      );
      if (!participant) {
        throw new CustomError(
          constants.error.UNAUTHORIZED,
          constants.status.UNAUTHORIZED
        );
      }
    }

    if (contest.status !== constants.contestStatus.FINISHED) {
      throw new CustomError(
        constants.error.CONTEST_NOT_FINISHED,
        constants.status.BAD_REQUEST
      );
    }

    contestInfo.sort((a, b) => b.points - a.points);
    return contestInfo;
  };
};
