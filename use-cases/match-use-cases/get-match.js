module.exports = function buildGetMatch({
  matchDb,
  constants,
  CustomError,
  Joi,
}) {
  return async function getMatch(matchId) {
    const schema = Joi.object({
      matchId: Joi.string().required(),
    });

    const { error } = schema.validate({
      matchId,
    });

    if (error) {
      throw new Error(error.details[0].message);
    }

    const match = await matchDb.findById({ matchId });
    if (!match) {
      throw new CustomError(
        constants.error.NO_MATCH,
        constants.status.NOT_FOUND
      );
    }
    return match;
  };
};
