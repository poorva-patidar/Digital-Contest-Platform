'use strict';

module.exports = {
  async up ({ context : queryInterface}) {
    queryInterface.sequelize.query(
      `CREATE TABLE contest_info (
        contest_id UUID NOT NULL,
        participant_id UUID NOT NULL,
        chosen_team STRING(255) NOT NULL,
        score_guess INT NOT NULL,
        points INT NULL DEFAULT 0,
        participant_rank INT NULL,
        prize_amount INT NULL DEFAULT 0,
        PRIMARY KEY (contest_id, participant_id),
        FOREIGN KEY (contest_id) REFERENCES contests(id),
        FOREIGN KEY (participant_id) REFERENCES users(id)
    );`
    );
  }
};