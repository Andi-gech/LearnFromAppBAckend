const jwt = require("jsonwebtoken");

async function Authmiddleware(req, res, next) {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("no token provided");
    try {
      const decoded = jwt.verify(token, "this is key");

      req.user = decoded;
    } catch (error) {
      return res.status(401).send("invalid token provided");
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
module.exports = Authmiddleware;
