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
const buildCreateUser = require('./create-user');
const { constants, CustomError } = require('../../utils');
const { CLIENT_URL, JWT_SECRET } = require('../../config/environment');

const userDb = {
  findByEmail: () => {},
  findByReferralCode: () => {},
  getReferralCodes: () => {},
  insert: () => {},
  updateBalance: () => {},
};

const userReferralDb = {
  findByReferrerId: () => {},
  updateStatus: () => {},
  insert: () => {},
};

const externalFunctions = {
    sendEmail: () => {},
    generateCode: () => {}
}

const jwt =  { sign: sinon.stub().returns("jwt-token")};

let findByEmailStub;
let findByReferralCodeStub;
let getReferralCodesStub;
let insertUserStub;
let updateBalanceStub;

let findByReferrerIdStub;
let updateStatusStub;
let insertUserReferralStub;

let sendEmailStub;
let generateCodeStub;

BeforeAll(() => {
  findByEmailStub = sandBox.stub(userDb, "findByEmail");
  findByReferralCodeStub = sandBox.stub(userDb, "findByReferralCode");
  getReferralCodesStub = sandBox.stub(userDb, "getReferralCodes");
  insertUserStub = sandBox.stub(userDb, "insert");
  updateBalanceStub = sandBox.stub(userDb, "updateBalance");

  findByReferrerIdStub = sandBox.stub(userReferralDb, "findByReferrerId");
  updateStatusStub = sandBox.stub(userReferralDb, "updateStatus");
  insertUserReferralStub = sandBox.stub(userReferralDb, "insert");

  sendEmailStub = sandBox.stub(externalFunctions, "sendEmail");
  generateCodeStub = sandBox.stub(externalFunctions, "generateCode");
});

Before(() => {
  findByEmailStub.callsFake((args) => {
    expect(args).to.have.own.property("email");
    if (args.email === "poorva@example.com") {
      return true;
    }
    return false;
  });

  findByReferralCodeStub.callsFake((args) => {
    expect(args).to.have.own.property("referralCode");
    if (args.referralCode === 1583715) {
      return {
        id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        name: "Akhya B",
        email: "akhya@example.com",
        password: "5e2b266c0259ab352c5750139329551a",
        role: "admin",
        balance: "100",
        referral_code: "1583715",
        created_at: "2024-06-03T11:18:49.663Z",
        updated_at: "2024-06-03T11:42:17.572Z",
      };
    }
    return false;
  });

  getReferralCodesStub.callsFake(() => {
    return [
      { referral_code: 1583715 },
      { referral_code: 4042573 },
      { referral_code: 1573718 },
    ];
  });

  insertUserStub.callsFake((args) => {
    expect(args).to.have.own.property("name");
    expect(args).to.have.own.property("email");
    expect(args).to.have.own.property("password");
    expect(args).to.have.own.property("role");
    expect(args).to.have.own.property("balance");
    expect(args).to.have.own.property("referralCode");
    return "7100582a-bcfd-439c-a401-af2c79e12dc1";
  });

  updateBalanceStub.callsFake((args) => {
    expect(args).to.have.own.property("id");
    expect(args).to.have.own.property("amount");
  });

  findByReferrerIdStub.callsFake((args) => {
    expect(args).to.have.own.property("referrerId");
    return [
      {
        referrer_id: "7100582a-bcfd-439c-a401-af2c79e12dc1",
        referred_email: "referred@example.com",
        status: "invited",
      },
    ];
  });

  updateStatusStub.callsFake((args) => {
    expect(args).to.have.own.property("referrerId");
    expect(args).to.have.own.property("referredEmail");
    expect(args).to.have.own.property("status");
  });

  insertUserReferralStub.callsFake((args) => {
    expect(args).to.have.own.property("referrerId");
    expect(args).to.have.own.property("referredEmail");
    expect(args).to.have.own.property("status");
  });

  sendEmailStub.callsFake((args) => {
    return true;
  });

  generateCodeStub.callsFake((args) => {
    return 1245543;
  })
});

After(() => {
  sandBox.resetHistory();
  this.name = undefined;
  this.email = undefined;
  this.password = undefined;
  this.role = undefined;
  this.appliedCode = undefined;
  this.result = undefined;
  this.error = undefined;
});

AfterAll(() => {
  sandBox.restore();
});

Given(
  'name: {string}, email: {string}, password: {string}, role: {string}, appliedCode: {string} create-user',
  async (name, email, password, role, appliedCode) => {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.appliedCode = appliedCode;
  }
);

When("try to create user", async () => {
  const createUser = buildCreateUser({
    userDb,
    userReferralDb,
    generateCode: externalFunctions.generateCode,
    constants,
    CustomError,
    jwt,
    sendEmail: externalFunctions.sendEmail,
    CLIENT_URL: "http://client.com",
    JWT_SECRET: "secret-key"
  });

  try {
    const user = await createUser({
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role,
      appliedCode: this.appliedCode
    });
    this.result = "User created successfully";
  } catch (error) {
    this.error = error.message;
  }
});

Then(
  "It should return the result: {string} for create user",
  async (result) => {
    expect(this.error).to.be.undefined;
    expect(this.result).to.be.equal(result);
  }
);

Then(
  "It should return the error: {string} for create user",
  async (error) => {
    expect(this.error).to.be.equal(error);
  }
);
