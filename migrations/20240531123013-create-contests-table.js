'use strict';

module.exports = {
  async up ({ context: queryInterface}) {
    queryInterface.sequelize.query(
      `CREATE TABLE contests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name STRING(255) NOT NULL,
        contest_code STRING(255) UNIQUE NOT NULL,
        type STRING(255) NOT NULL,
        status STRING(255) NOT NULL,
        no_of_participants INT NOT NULL,
        entry_fee INT NOT NULL,
        total_winner INT NOT NULL,
        created_by UUID NOT NULL,
        match_id STRING(255) NOT NULL,
        FOREIGN KEY (created_by) REFERENCES users(id),
        FOREIGN KEY (match_id) REFERENCES matches(id)
    );`
    )
  }
};