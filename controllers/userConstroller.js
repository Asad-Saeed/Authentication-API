import UserModal from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserController {
  static userRegistration = async (req, res) => {
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
            const hashPassword=await bcrypt.hash(password,salt)
            const doc = new UserModal({
              name: name,
              email: email,
              password: hashPassword,
              tc: tc,
            });
            await doc.save();
          } catch (error) {
            // console.log("error", error);
            res.send({ status: "failed", message: "Unable to register" });
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
  };
}
