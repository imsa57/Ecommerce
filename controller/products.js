import { Product } from "../model/products.js";

export const createProduct = async (req, res) => {
  // this product we have to get from API body
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const fetchProductById = async (req, res) => {
  // this product we have to get from API body
  //65dee03ff71190478dde62c3
  const { id } = req.params;
  try {
    const newProduct = await Product.findById(id);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(404).json(error);
  }
};
export const fetchUpdateProduct = async (req, res) => {
  // this product we have to get from API body
  //65dee03ff71190478dde62c3
  const { id } = req.params;
  try {
    const newProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(404).json(error);
  }
};

export const fetchFilterproduct = async (req, res) => {
  // let query = Product.find({ deleted: { $ne: true } });
  let query = Product.find({});
  let totalDocCount = Product.find({});

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalDocCount = totalDocCount.find({ category: req.query.category });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalDocCount = totalDocCount.find({ brand: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalDocCount = totalDocCount.sort({ [req.query._sort]: req.query._order });
  }

  if (req.query._search) {
    query = query.find({
      $or: [
        { brand: { $regex: req.query._search, $options: "i" } },
        { category: { $regex: req.query._search, $options: "i" } },
      ],
    });
    totalDocCount = totalDocCount.find({
      $or: [
        { brand: { $regex: req.query._search, $options: "i" } },
        { category: { $regex: req.query._search, $options: "i" } },
      ],
    });
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

export const createMultipleProducts = async (req, res) => {
  try {
    // Assuming req.body is an array of data you want to save
    const dataArray = req.body;

    // Create an array to store promises returned by save operation
    const savePromises = [];

    // Iterate over the array and create documents
    dataArray.forEach((data) => {
      const newDocument = new Product(data);
      savePromises.push(newDocument.save());
    });

    // Wait for all save operations to complete
    const products = await Promise.all(savePromises);

    res.status(201).json(products);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
