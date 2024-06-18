module.exports = function buildCheckUpdateDeleteUserPermission({ constants, response }) {
  return async function checkUpdateDeleteUserPermission(req, res) {
    const user = req.user;
    const userId = req.params.userId;
    if (user.id != userId && user.role === constants.role.USER) {
      response.error(res,
        constants.error.UNAUTHORIZED,
        constants.status.UNAUTHORIZED
      );
    }
    return true;
  };
};
