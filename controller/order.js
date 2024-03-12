import Order from "../model/order.js";

export const createOrder = async (req, res) => {
  // this product we have to get from API body
  const order = new Order({ ...req.body, user: req.user.id });
  try {
    const newOrder = await order.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchOrderByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const OrderItems = await Order.find({ user: id });
    res.status(200).json(OrderItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchFilterOrder = async (req, res) => {
  // let query = Product.find({ deleted: { $ne: true } });
  let query = Order.find({});
  let totalDocCount = Order.find({});

  if (req.query.status) {
    query = query.find({ status: req.query.status });
    totalDocCount = totalDocCount.find({ status: req.query.status });
  }

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalDocCount = totalDocCount.sort({ [req.query._sort]: req.query._order });
  }
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }
  const totalCount = await totalDocCount.countDocuments();

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalCount);
    res.status(201).json(docs);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const fetchUpdateOrder = async (req, res) => {
  // this product we have to get from API body
  //65dee03ff71190478dde62c3
  const { id } = req.body;
  try {
    const newOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(404).json(error);
  }
};
