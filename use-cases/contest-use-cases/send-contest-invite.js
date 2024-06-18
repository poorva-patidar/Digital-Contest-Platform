module.exports = function buildSendContestInvite({
  contestDb,
  constants,
  CustomError,
  sendEmail,
  Joi,
}) {
  return async function sendContestInvite(userId, contestId, email) {
    const schema = Joi.object({
      userId: Joi.string().required().guid(),
      contestId: Joi.string().required().guid(),
      email: Joi.string().email().required(),
    });

    const { error } = schema.validate({ userId, contestId, email });
    if (error) throw new Error(error.details[0].message);

    const contest = await contestDb.findById({ id: contestId });

    if (!contest) {
      throw new CustomError(
        constants.error.NO_CONTEST,
        constants.status.NOT_FOUND
      );
    }

    if (
      contest.type === constants.contestType.PRIVATE &&
      contest.created_by !== userId
    ) {
      throw new CustomError(
        constants.error.UNAUTHORIZED,
        constants.status.UNAUTHORIZED
      );
    }

    if (contest.type === constants.contestType.MEGA) {
      throw new CustomError(
        "No need to send invite. Free for everyone",
        constants.status.BAD_REQUEST
      );
    }

    const options = {
      email,
      subject: "Invite to join contest",
      message: `Use the contest code to join the contest: ${contest.contest_code}`,
    };

    await sendEmail(options);
  };
};
