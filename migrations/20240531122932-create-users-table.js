'use strict';

module.exports = {
  async up ({context: queryInterface}) {
    queryInterface.sequelize.query(
      `CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name STRING(255) NOT NULL,
        email STRING(255) NOT NULL UNIQUE,
        password STRING(255),
        role STRING(255) NOT NULL,
        balance INT NOT NULL DEFAULT 0,
        referral_code INT UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP());`
    );
  }
};
