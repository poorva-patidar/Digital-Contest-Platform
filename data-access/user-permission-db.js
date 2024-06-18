module.exports = function buildUserPermissionsDb({
  pool,
  constants,
  CustomError,
}) {
  async function insert(permissions) {
    try {
      await pool.query(
        "INSERT INTO user_permissions (user_id, status, create_user, update_user, delete_user, create_contest, update_contest, delete_contest) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [...Object.values(permissions)]
      );
    } catch (error) {
      throw new CustomError(
        "Error while creating user permissions!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function findByUserId({ userId }) {
    try {
      const { rows } = await pool.query(
        `SELECT * FROM user_permissions WHERE user_id = $1`,
        [userId]
      );
      return rows[0];
    } catch (error) {
      throw new CustomError(
        "Error while finding user permissions by user Id!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updateStatus({ userId, status }) {
    try {
      await pool.query(
        "UPDATE user_permissions SET status = $1 WHERE user_id = $2",
        [status, userId]
      );
    } catch (error) {
      throw new CustomError(
        "Error while updating user status!",
        constants.status.SERVER_ERROR
      );
    }
  }

  async function updatePermissions({ userId, permissions }) {
    try {
      await pool.query(
        "UPDATE user_permissions SET create_user = $1, update_user = $2, delete_user = $3, create_contest = $4, update_contest = $5, delete_contest = $6 WHERE user_id = $7",
        [...Object.values(permissions), userId]
      );
    } catch (error) {
      throw new CustomError(
        "Error while finding user permissions!",
        constants.status.SERVER_ERROR
      );
    }
  }

  return Object.freeze({
    findByUserId,
    insert,
    updateStatus,
    updatePermissions,
  });
};
