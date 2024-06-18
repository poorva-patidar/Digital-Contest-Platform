module.exports = {
  error: {
    INCOMPLETE_DATA: "You must provide all the required fields",
    USER_NOT_FOUND: "User not found",
    ROUTE_NOT_FOUND: "Route not found", 
    METHOD_NOT_ALLOWED: "Method not allowed",
    USER_ALREADY_EXISTS: "User already exists",
    UNSUPPORTED_FORMAT: "Unsupported format",
    UNAUTHORIZED: "You are not authorized to perform this action",
    SERVER_ERROR: "Internal server error",
    INVALID_PASSWORD: "Invalid password",
    TOKEN_EXPIRED: "Token expired! Login again to get a new token",
    USER_ALREADY_ACTIVATED: "User already activated",
    NO_USERS: "No users found",
    NO_ID_PROVIDED: "You must provide an id",
    NO_REFERRAL: "No referral found",
    NO_MATCHES: "No matches found",
    NO_MATCH: "No match found", 
    NO_CONTESTS: "No contests found",
    NO_CONTEST: "No contest found",
    NO_AUTH_TOKEN: "No auth token provided",
    INVALID_CONTEST: "Invalid contest check all fields",
    MATCH_ALREADY_STARTED: "Match already started or finished",
    CONTEST_LIVE: "Contest is live or finished",
    CONTEST_NOT_FINISHED: "Contest not finished yet!",
    INSUFFICIENT_BALANCE: "Not enough balance",
    INVALID_CONTEST_CODE: "Invalid code",
    CONTEST_FULL: "Contest Full"
  },

  success: {
    USER_LOGGED_IN: "User logged in successfully",
    USER_CREATED: "User created successfully",
    USER_DELETED: "User deleted successfully",
    USER_UPDATED: "User updated successfully",
    USER_ACTIVATED: "User activated successfully",
    EMAIL_SENT: "Email sent successfully",
    REFERRAL_SENT: "Referral sent successfully",
    CONTEST_CREATED: "Contest created successfully",
    CONTEST_DELETED: "Contest deleted successfully",
    CONTEST_UPDATED: "Contest updated successfully"
  },

  status: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
    NOT_AUTHENTICATED: 401,
    UNAUTHORIZED: 403,
  },

  role: {
    ADMIN: "admin",
    USER: "user",
  },

  userStatus: {
    ACTIVE: "active",
    INACTIVE: "inactive",
  },

  referralStatus: {
    ACCEPTED: "accepted",
    INVITED: "invited",
  },

  matchStatus: {
    UPCOMING: "Upcoming",
    FINISHED: "Finished",
    ABANDONED: "Abandoned",
    LIVE: "Live",
  },

  contestStatus: {
    UPCOMING: "Upcoming",
    FINISHED: "Finished",
    LIVE: "Live",
    CANCELLED: "Cancelled",
  },

  contestType: {
    MEGA: "mega",
    PRIVATE: "private",
  },
};
