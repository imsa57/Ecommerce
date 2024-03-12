import Cart from "../model/cart.js";

export const fetchCartByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const cartItems = await Cart.find({ user: id }).populate("product").exec();
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addToCart = async (req, res) => {
  const cart = new Cart({ ...req.body, user: req.user.id });
  try {
    const response = await cart.save();
    await response.populate("product");
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchUpdateCart = async (req, res) => {
  // this product we have to get from API body
  //65dee03ff71190478dde62c3
  const { id } = req.body;
  try {
    const newCartItem = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    await newCartItem.populate("product");
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(404).json(error);
  }
};
export const fetchDeleteItem = async (req, res) => {
  // this product we have to get from API body
  //65dee03ff71190478dde62c3
  const { id } = req.body;
  try {
    const newCartItem = await Cart.findByIdAndDelete(id);
    res.status(201).json(newCartItem);
  } catch (error) {
    res.status(404).json(error);
  }
};
