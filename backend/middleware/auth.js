const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, "your_jwt_secret_key");
    req.user = decoded; // {id: ...}
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
