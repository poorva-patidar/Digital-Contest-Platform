const {
  Given,
  When,
  Then,
  BeforeAll,
  Before,
  After,
  AfterAll,
} = require("@cucumber/cucumber");
const { expect } = require("chai");
const sinon = require("sinon");
const sandBox = sinon.createSandbox();
const Joi = require("joi");
const { CustomError, constants } = require("../../utils");
const buildJoinContest = require("./join-contest");

const contestDb = {
  findById: () => {},
};

const contestInfoDb = {
  getParticipants: () => {},
  insert: () => {},
};

const userDb = {
  updateBalance: () => {},
};

let findByIdStub;
let updateBalanceStub;
let getParticipantsStub;
let insertStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(contestDb, "findById");
  updateBalanceStub = sandBox.stub(userDb, "updateBalance");
  getParticipantsStub = sandBox.stub(contestInfoDb, "getParticipants");
  insertStub = sandBox.stub(contestInfoDb, "insert");
});

Before(() => {
  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc2") return false;
    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc8")
      return { status: "Live" };

    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc9")
      return {
        status: "Upcoming",
        no_of_participants: 5,
      };

    if (args.id === "2100582a-bcfd-439c-a401-af2c79e12dc7")
      return {
        type: "private",
        status: "Upcoming",
        no_of_participants: 5,
        contest_code: 2427,
      };

    return {
      id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      name: "contest_2",
      contest_code: "84769",
      type: "private",
      status: "Upcoming",
      no_of_participants: 8,
      entry_fee: 15,
      total_winner: 3,
      created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
      match_id: "6659c0be1b283595041e2144",
    };
  });

  updateBalanceStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("amount");
  });

  getParticipantsStub.callsFake((args) => {
    expect(args).to.have.own.property("contestId");
    if (args.contestId === "2100582a-bcfd-439c-a401-af2c79e12dc6")
      return [
        {
          participant_id: "7100582a-bcfd-439c-a401-af2c79e12dc5",
        },
      ];

    if (args.contestId === "2100582a-bcfd-439c-a401-af2c79e12dc9")
      return [{}, {}, {}, {}, {}, {}];
    return [];
  });

  insertStub.callsFake((args) => {
    expect(args).to.have.own.property("contestId");
    expect(args).to.have.own.property("participantId");
    expect(args).to.have.own.property("chosenTeam");
    expect(args).to.have.own.property("scoreGuess");
  });
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.userRole = undefined;
  this.userBalance = undefined;
  this.contestId = undefined;
  this.joinData = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  "userId: {string}, userRole: {string}, userBalance: {int}, contestId: {string}, joinData: {string} join-contest",
  async (userId, userRole, userBalance, contestId, joinData) => {
    this.userId = userId;
    this.userRole = userRole;
    this.userBalance = userBalance;
    this.contestId = contestId;
    this.joinData = joinData ? JSON.parse(joinData) : joinData;
  }
);

When("try to join contest", async () => {
  const joinContest = buildJoinContest({
    contestInfoDb,
    contestDb,
    userDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    await joinContest(
      this.userId,
      this.userRole,
      this.userBalance,
      this.contestId,
      this.joinData
    );
    this.result = "Joined successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for joining contest",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for joining contest",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
