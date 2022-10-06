const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     const token = req.headers.authorization.split(" ")[1];
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
//     const userId = decodedToken.userId;
//     req.auth = {
//       userId: userId,
//     };
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Unauthorized request" });
//   }
// };

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(404).json({ message: "coucou" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.auth = {
      userId: payload.userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized request" });
  }
};

module.exports = { auth };
