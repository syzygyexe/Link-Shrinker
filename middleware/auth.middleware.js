const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // OPTIONS is a special method in the RestAPI which checks for a server availability
  if (req.method === "OPTIONS") {
    return next();
  }
  // If method is "GET" or "POST".
  try {
    // "Bearer TOKEN" which we are parsing to get the token(first element in the array)
    // authorization is a string which we pass on our frontend.
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      // Unauthorized case
      return res.status(401).json({ message: "Not authorized" });
    }
    // If we have a token, verify it with our jwtSecret code from the config file
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded;
    next();
  } catch (e) {
    res.status(401).json({ message: "Not authorized" });
  }
};
