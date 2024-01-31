import UserModal from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static userRegistration = async (req, res) => {
    try {
      const { name, email, password, password_confirmation, tc } = req.body;
      const user = await UserModal.findOne({ email: email });
      if (user) {
        res.send({ status: "failed", message: "Email already exist" });
      } else {
        if (name && email && password && password_confirmation && tc) {
          if (password === password_confirmation) {
            try {
              // Password hashing
              const salt = await bcrypt.genSalt(10);
              const hashPassword = await bcrypt.hash(password, salt);
              const doc = new UserModal({
                name: name,
                email: email,
                password: hashPassword,
                tc: tc,
              });
              await doc.save();
              const saved_user = await UserModal.findOne({ email: email });
              // Generate Jwt token
              const token = jwt.sign(
                { UserID: saved_user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "5d" }
              );
              res.status(201).send({
                status: "success",
                message: "User created succefully",
                accessToken: token,
              });
            } catch (error) {
              res.send({ status: "failed", message: "Failed to register" });
            }
          } else {
            res.send({
              status: "failed",
              message: "Confimed password does not match",
            });
          }
        } else {
          res.send({ status: "failed", message: "All fields are required" });
        }
      }
    } catch (error) {
      res.send({ status: "failed", message: "Failed to register" });
    }
  };
  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModal.findOne({ email: email });
        if (user != null) {
          // compare hashed and user password
          const isMatch = await bcrypt.compare(password, user.password);
          if (user.email === email && isMatch) {
            // Generate Jwt token
            const token = jwt.sign(
              { UserID: user._id },
              process.env.JWT_SECRET_KEY,
              { expiresIn: "5d" }
            );
            res.send({
              status: "success",
              message: "Login Successfully",
              accessToken: token,
            });
          } else {
            res.send({
              status: "failed",
              message: "Credential does not match",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "You are not a register user!",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Failed to login" });
    }
  };
}

export default UserController;
