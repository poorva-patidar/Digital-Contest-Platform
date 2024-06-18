module.exports = function buildGetHostedContest({
  contestDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function getHostedContest(userId) {
    const schema = Joi.object({ userId: Joi.string().required().guid() });
    const { error } = schema.validate({ userId });
    if (error) throw new Error(error.details[0].message);

    const contests = await contestDb.findByCreatedBy({ userId });

    if (!contests.length) {
      throw new CustomError(
        constants.error.NO_CONTESTS,
        constants.status.NOT_FOUND
      );
    }

    return contests;
  };
};
