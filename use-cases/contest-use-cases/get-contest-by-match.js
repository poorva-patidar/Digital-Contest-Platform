module.exports = function buildGetContestByMatch({
  contestDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function getContestByMatch(userId, matchId) {
    const schema = Joi.object({
      userId: Joi.string().required().guid(),
      matchId: Joi.string().required(),
    });

    const { error } = schema.validate({ userId, matchId });
    if (error) throw new Error(error.details[0].message);

    const contests = await contestDb.findByMatchId({ matchId });

    const myContests = contests.filter(
      (contest) =>
        contest.created_by === userId ||
        contest.type === constants.contestType.MEGA
    );

    if (!myContests.length) {
      throw new CustomError(
        constants.error.NO_CONTESTS,
        constants.status.NOT_FOUND
      );
    }

    return myContests;
  };
};
