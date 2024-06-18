'use strict';

module.exports = {
  async up ({ context : queryInterface}) {
    queryInterface.sequelize.query(
      `CREATE TABLE matches (
        id STRING(255) PRIMARY KEY,
        name STRING(255) NOT NULL,
        status STRING(255) NOT NULL,
        format STRING(255) NOT NULL,
        series STRING(255) NOT NULL,
        team1_name STRING(255) NOT NULL,
        team2_name STRING(255) NOT NULL,
        team1_score INT DEFAULT NULL,
        team2_score INT DEFAULT NULL,
        winner STRING(255) DEFAULT NULL,
        start_time TIMESTAMP NOT NULL,
        INDEX (status)
    );`
    )
  }
};
