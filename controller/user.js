import { requiredUserData } from "../common/passportAuthorization.js";
import User from "../model/user.js";

export const fetchUserById = async (req, res) => {
  // this product we have to get from API body
  //65dee03ff71190478dde62c3
  const { id } = req.user;
  try {
    const userData = await User.findById(
      id,
      "name email,addresses orders role"
    ).exec();
    res.status(201).json(userData);
  } catch (error) {
    res.status(404).json(error);
  }
};
export const fetchUpdateUser = async (req, res) => {
  // this product we have to get from API body
  //65dee03ff71190478dde62c3
  const { id } = req.user;
  try {
    const userData = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(requiredUserData(userData));
  } catch (error) {
    res.status(404).json(error);
  }
};
