module.exports = function buildGetContest({
  contestDb,
  constants,
  CustomError,
  Joi
}) {
  return async function getContest(userId, userRole, contestId) {
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

    if (contest.type === constants.contestType.PRIVATE) {
      if (userRole === constants.role.USER && userId !== contest.created_by) {
        throw new CustomError(
          constants.error.UNAUTHORIZED,
          constants.status.UNAUTHORIZED
        );
      }
    }
    return contest;
  };
};
