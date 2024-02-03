import UserModal from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../configs/emailConfig.js";

class UserController {
  // User Register
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
                token: token,
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
  // User Login
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
              token: token,
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
  // User Password Change
  static changeUserPassword = async (req, res) => {
    try {
      const { password, password_confirmation } = req.body;
      if (password && password_confirmation) {
        if (password !== password_confirmation) {
          res.send({
            status: "failed",
            message: "New Password and Confirmed Password does not match",
          });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModal.findByIdAndUpdate(req.user._id, {
            $set: { password: newHashPassword },
          });
          res.send({
            status: "success",
            message: "Password change successfully",
          });
        }
      } else {
        res.send({ status: "failed", message: "All fields are required" });
      }
    } catch (error) {
      res.send({ status: "failed", message: "Failed to Change Password" });
    }
  };
  // Logged user data
  static loggedUserData = async (req, res) => {
    try {
      res.send({ user: req.user });
    } catch (error) {
      res.send({ status: "failed", message: "Failed to get user data" });
    }
  };
  // User password reset email
  static sendResetPasswordEmail = async (req, res) => {
    try {
      const { email } = req.body;
      if (email) {
        const user = await UserModal.findOne({ email: email });
        if (user) {
          const secret = user._id + process.env.JWT_SECRET_KEY;
          const token = jwt.sign({ UserID: user._id }, secret, {
            expiresIn: "1h",
          });
          const link = `${process.env.FRONTEND_RESET_URL}/${user._id}/${token}`;
          // Send Email
          const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user?.email,
            subject: "Asad Saeed Auth Api Password Reset Link",
            html: `<a href=${link}>Click here</a> to reset your password.`,
          });
          res.send({
            status: "success",
            message: "Password reset email sent successfully",
            info: info,
          });
        } else {
          res.send({
            status: "failed",
            message: "Email does not exist",
          });
        }
      } else {
        res.send({
          status: "failed",
          message: "Email field is required",
        });
      }
    } catch (error) {
      res.send({
        status: "failed",
        message: "Failed to send rest password email",
        error: error.message,
      });
    }
  };
  // User password reset
  static userPasswordReset = async (req, res) => {
    try {
      const { password, password_confirmation } = req.body;
      const { id, token } = req.params;
      const user = await UserModal.findById(id);
      const new_secret = user._id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, new_secret, { expiresIn: "1h" });
      try {
        if (password && password_confirmation) {
          if (password !== password_confirmation) {
            res.send({
              status: "failed",
              message: "Password and confirm password do not match",
            });
          } else {
            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(password, salt);
            await UserModal.findByIdAndUpdate(id, {
              $set: {
                password: newHashPassword,
              },
            });
            res.send({
              status: "success",
              message: "Password reset successfully",
            });
          }
        } else {
          res.send({
            status: "failed",
            message: "All fields are required",
          });
        }
      } catch (error) {
        res.send({
          status: "failed",
          message: "Invalid token",
          error: error.message,
        });
      }
    } catch (error) {
      res.send({
        status: "failed",
        message: "Failed to Reset Password",
        error: error.message,
      });
    }
  };
}

export default UserController;
