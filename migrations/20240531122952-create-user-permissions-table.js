'use strict';

module.exports = {
  async up ({ context : queryInterface }) {
    queryInterface.sequelize.query(
      `CREATE TABLE user_permissions (
        user_id UUID PRIMARY KEY,
        status VARCHAR(255) NOT NULL,
        create_user BOOLEAN NOT NULL DEFAULT FALSE,
        update_user BOOLEAN NOT NULL DEFAULT FALSE,
        delete_user BOOLEAN NOT NULL DEFAULT FALSE,
        create_contest BOOLEAN NOT NULL DEFAULT FALSE,
        update_contest BOOLEAN NOT NULL DEFAULT FALSE,
        delete_contest BOOLEAN NOT NULL DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id)
    );`
    );
  }
};
