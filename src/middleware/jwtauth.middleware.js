// src/middleware/jwtauth.middleware.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Invalid token
      }
      req.user = user;
      next(); // Proceed to the next middleware/route handler
    });
  } else {
    res.sendStatus(401); // No token provided
  }
};

const authenticateUser = (req, res) => {
  const { username, password } = req.body;

  // Authenticate user (dummy check here, replace with real logic)
  if (username === "user" && password === "password") {
    const user = { username };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
};

export { authenticateJWT, authenticateUser };
