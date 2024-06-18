module.exports = function buildGetParticipatedContest({
  contestDb,
  contestInfoDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function getParticipatedContest(userId) {
    const schema = Joi.object({ userId: Joi.string().required().guid() });
    const { error } = schema.validate({ userId });
    if (error) throw new Error(error.details[0].message);

    const contests = await contestInfoDb.findByParticipant({
      participantId: userId,
    });

    if (!contests.length) {
      throw new CustomError(
        constants.error.NO_CONTESTS,
        constants.status.NOT_FOUND
      );
    }

    const participatedContests = [];
    for (let contest of contests) {
      participatedContests.push(
        await contestDb.findById({ id: contest.contest_id })
      );
    }
    return participatedContests;
  };
};
