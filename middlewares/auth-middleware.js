import jwt from "jsonwebtoken";
import UserModal from "../models/User.js";

const checkUserAuth = async (req, res, next) => {
  //   Get token from frontend headers
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];
      //   Verify token
      const { UserID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      //   Get user form token
      req.user = await UserModal.findById(UserID).select("-password");
      next();
    } catch (error) {
      res.status(401).send({ status: "failed", message: "Unauthorized User" });
    }
    if (!token) {
      res
        .status(401)
        .send({ status: "failed", message: "Unauthorized User No Token" });
    }
  }
};

export default checkUserAuth;
