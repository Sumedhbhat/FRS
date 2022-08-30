const jwt = require("jsonwebtoken");

const checkUserAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  console.log(req.header["authorization"]);
  console.log(req.headers["authorization"]);
  if (!authorization) {
    return res.status(401).json({ msg: "No authorization header" });
  }
  //     const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
    req.body.last_modified_by = decoded.name;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ msg: "Invalid token" });
  }
};

module.exports = checkUserAuth;
