const jwt = require("jsonwebtoken");
const config = require("config");

/**
 *
 * @param {*} req request
 * @param {*} res response
 * @param {*} next action to do next
 * @returns
 */
module.exports = function (req, res, next) {
  // Get token from header
  // x-auth-token is the key to the token in the header
  const token = req.header("x-auth-token");
  // Check if no token
  if (!token) {
    // 401: Not authorized
    return res.status(401).json({ msg: "No token, authorization denied" });
  } else {
    // Verify token
    try {
      const decoded = jwt.verify(token, config.get("jwtsecret"));
      req.user = decoded.user;
      next();
    } catch (err) {
      res.error(401).json({ msg: "Token is not valid" });
    }
  }
};
