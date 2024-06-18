module.exports = function buildCheckUserPermission(response, constants){
    return async function checkUserPermission(req, res){
        if (req.user.role === constants.role.USER) {
            response.error(
              res,
              constants.error.UNAUTHORIZED,
              constants.status.UNAUTHORIZED
            );
            return false;
          }
          return true;
    }
}