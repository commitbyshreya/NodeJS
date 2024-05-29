const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.ACCESSTOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401);
        throw new Error("User is not authorized");
      }
      req.user = decoded.user;
      next();
    });
    if (!token) {
      res.status(401);
      throw new Error("User is not authorized or token is missing");
    }
  }
});

module.exports = validateToken;

// const asyncHandler = require("express-async-handler");
// const jwt = require("jsonwebtoken");
// const { promisify } = require("util");

// const verifyToken = promisify(jwt.verify);

// const validateToken = asyncHandler(async (req, res, next) => {
//   let token;
//   let authHeader = req.headers.authorization || req.headers.Authorization;
//   console.log("Authorization Header:", authHeader);
//   if (authHeader && authHeader.startsWith("Bearer")) {
//     token = authHeader.split(" ")[1];
//     console.log("Token:", token);
//     try {
//       const decoded = await verifyToken(token, process.env.ACCESS_TOKEN_KEY);
//       console.log("Decoded Token:", decoded);
//       req.user = decoded; // Attach the decoded payload to the request object
//       next(); // Proceed to the next middleware or route handler
//     } catch (err) {
//       console.error("JWT Verification Error:", err);
//       res.status(401);
//       throw new Error("User is not authorized");
//     }
//   } else {
//     res.status(401);
//     throw new Error("Token not found");
//   }
// });

// module.exports = validateToken;
