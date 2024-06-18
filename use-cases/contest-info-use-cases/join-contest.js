const { makeContestInfo } = require("../../entities");

module.exports = function buildJoinContest({
  contestInfoDb,
  contestDb,
  userDb,
  constants,
  CustomError,
  Joi
}) {
  return async function joinContest(userId, userRole, userBalance, contestId, joinData) {
    const schema = Joi.object({
      userId: Joi.string().required().guid(),
      userRole: Joi.string().required().valid("user", "admin", "superadmin"),
      userBalance: Joi.number().required().min(0),
      contestId: Joi.string().required().guid(),
      joinData: Joi.object().unknown(true).required(),
    });
    const { error } = schema.validate({
      userId,
      userRole,
      userBalance,
      contestId,
      joinData,
    });
    if (error) throw new Error(error.details[0].message);

    if (userRole !== constants.role.USER) {
      throw new CustomError(
        constants.error.UNAUTHORIZED,
        constants.status.UNAUTHORIZE
      );
    }

    const contest = await contestDb.findById({ id: contestId });

    // If contest not found
    if (!contest) {
      throw new CustomError(
        constants.error.NO_CONTEST,
        constants.status.NOT_FOUND
      );
    }

    // If contest already started or finished, user cannot join
    if (contest.status !== constants.contestStatus.UPCOMING) {
      throw new CustomError(
        constants.error.CONTEST_LIVE,
        constants.status.BAD_REQUEST
      );
    }

    // If user already joined the contest, user cannot join again
    const participants = await contestInfoDb.getParticipants({ contestId });
    const participant = participants.find(
      (participant) => participant.participant_id === userId
    );
    if (participant) {
      throw new CustomError(
        "You already joined the contest",
        constants.status.BAD_REQUEST
      );
    }

    // If participant count is full, user cannot join
    if (participants.length >= contest.no_of_participants) {
      throw new CustomError(
        constants.error.CONTEST_FULL,
        constants.status.BAD_REQUEST
      );
    }

    // If user balance is less than entry fee, user cannot join
    if (userBalance < contest.entry_fee) {
      throw new CustomError(
        constants.error.INSUFFICIENT_BALANCE,
        constants.status.BAD_REQUEST
      );
    }

    // If contest is private, user must provide contest code to join
    if (contest.type === constants.contestType.PRIVATE) {
      if (contest.contest_code != joinData.joiningCode) {
        throw new CustomError(
          constants.error.INVALID_CONTEST_CODE,
          constants.status.BAD_REQUEST
        );
      }
    }

    // Create contest info object
    const newParticipant = makeContestInfo({
      contestId,
      participantId: userId,
      chosenTeam: joinData.chosenTeam,
      scoreGuess: joinData.scoreGuess,
    });

    // Update user balance
    await userDb.updateBalance({ id: userId, amount: -contest.entry_fee });

    // Save contest info to database
    await contestInfoDb.insert({
      contestId: newParticipant.getContestId(),
      participantId: newParticipant.getParticipantId(),
      chosenTeam: newParticipant.getChosenTeam(),
      scoreGuess: newParticipant.getScoreGuess(),
    });
  };
};
