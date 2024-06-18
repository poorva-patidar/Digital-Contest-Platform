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
const buildGetParticipatedContest = require("./get-participated-contest");

const contestDb = {
  findById: () => {},
};

const contestInfoDb = {
  findByParticipant: () => {},
};

let findByIdStub;
let findByParticipantStub;

BeforeAll(() => {
  findByIdStub = sandBox.stub(contestDb, "findById");
  findByParticipantStub = sandBox.stub(contestInfoDb, "findByParticipant");
});

Before(() => {
  findByIdStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    return {
        id: "7100582a-abcd-439c-a401-af2c79e12dc1",
        name: "contest_3",
        contest_code: "17084",
        type: "mega",
        status: "Finished",
        no_of_participants: 8,
        entry_fee: 10,
        total_winner: 3,
        created_by: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        match_id: "6659c0be1b283595041e2144",
      }
  });

  findByParticipantStub.callsFake((args) => {
    expect(args).to.have.own.property("participantId");
    if (args.participantId === "2100582a-bcfd-439c-a401-af2c79e12dc2") return [];
    return [
        {
          id: "7100582a-abcd-439c-a401-af2c79e12dc1",
          name: "contest_3",
          contest_code: "17084",
          type: "mega",
          status: "Finished",
          no_of_participants: 8,
          entry_fee: 10,
          total_winner: 3,
          created_by: 28,
          match_id: "6659c0be1b283595041e2144",
        },
      ];

  })
});

After(() => {
  sandBox.resetHistory();
  this.userId = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given("userId: {string} get-participated-contest", async (userId) => {
  this.userId = userId;
});

When("try to get participated contest", async () => {
  const getParticipatedContest = buildGetParticipatedContest({
    contestDb,
    contestInfoDb,
    constants,
    CustomError,
    Joi,
  });

  try {
    const contests = await getParticipatedContest(this.userId);
    this.result = JSON.stringify(contests);
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for getting participated contest",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for getting participated contest",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
