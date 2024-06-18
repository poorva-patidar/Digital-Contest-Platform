'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up ({context: queryInterface}) {
    queryInterface.sequelize.query(
      `CREATE TABLE user_referrals (
        referrer_id UUID NOT NULL,
        referred_email STRING(255) NOT NULL,
        status STRING(255) NOT NULL,
        PRIMARY KEY (referrer_id, referred_email),
        FOREIGN KEY (referrer_id) REFERENCES users(id)
    );`
    );
  }
};
