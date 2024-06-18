module.exports = function buildDeleteContest({
  contestDb,
  contestInfoDb,
  userDb,
  constants,
  CustomError,
  Joi
}) {
  return async function deleteContest(userId, userRole, contestId) {
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

    if (userRole === constants.role.USER && userId !== contest.created_by) {
      throw new CustomError(
        constants.error.UNAUTHORIZED,
        constants.status.UNAUTHORIZED
      );
    }

    if (contest.status === constants.contestStatus.LIVE) {
      throw new CustomError(
        constants.error.CONTEST_LIVE,
        constants.status.BAD_REQUEST
      );
    } else if (contest.status === constants.contestStatus.UPCOMING) {
      // if participants are present, return their entry fees
      const contestInfo = await contestInfoDb.findByContest({ contestId });
      const participants = contestInfo.map((info) => info.participantId);
      participants.forEach(async (participant) => {
        await userDb.updateBalance({
          id: participant,
          amount: contest.entry_fee,
        });
      });
    }

    // delete contest
    await contestDb.remove({ contestId });
  };
};
