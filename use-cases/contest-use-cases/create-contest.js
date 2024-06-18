const { makeContest } = require("../../entities");

module.exports = function buildCreateContest({
  contestDb,
  matchDb,
  generateCode,
  constants,
  CustomError,
  Joi,
}) {
  return async function createContest(userId, userRole, contest) {
    
    if (!contest) {
      throw new CustomError(
        constants.error.INCOMPLETE_DATA,
        constants.status.BAD_REQUEST
      );
    }

    const schema = Joi.object({
      userId: Joi.string().required().guid(),
      userRole: Joi.string().required().valid("user", "admin", "superadmin"),
    });
    
    const { error } = schema.validate({ userId, userRole });
    if (error) throw new Error(error.details[0].message);

    if (+contest.noOfParticipants < +contest.totalWinner) {
      throw new CustomError(
        "Participant number needs to be greater than equal to winners",
        constants.status.BAD_REQUEST
      );
    }

    const match = await matchDb.findById({ matchId: contest.matchId });
    if (!match) {
      throw new CustomError(
        constants.error.NO_MATCH,
        constants.status.NOT_FOUND
      );
    }

    if (match.status !== constants.matchStatus.UPCOMING) {
      throw new CustomError(
        constants.error.MATCH_ALREADY_STARTED,
        constants.status.BAD_REQUEST
      );
    }

    contest.status = constants.contestStatus.UPCOMING;
    contest.createdBy = userId;

    // contest code generation logic
    let contestCodes = await contestDb.getContestCodes();
    contestCodes = contestCodes.map((code) => code.contestCode);
    contest.contestCode = generateCode(1000, 100000, contestCodes);

    // setting contest type
    if (userRole === constants.role.USER)
      contest.type = constants.contestType.PRIVATE;
    else contest.type = constants.contestType.MEGA;

    // creating contest entity to validate
    const newContest = makeContest(contest);

    return contestDb.insert({
      name: newContest.getName(),
      contestCode: newContest.getContestCode(),
      type: newContest.getType(),
      status: newContest.getStatus(),
      noOfParticipants: newContest.getNoOfParticipants(),
      entryFee: newContest.getEntryFee(),
      totalWinners: newContest.getTotalWinner(),
      createdBy: newContest.getCreatedBy(),
      matchId: newContest.getMatchId(),
    });
  };
};
