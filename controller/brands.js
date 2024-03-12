import { Brands } from "../model/brands.js";

export const fetchAllBrand = async (req, res) => {
  try {
    const brands = await Brands.find({});
    res.status(201).json(brands);
  } catch (error) {
    res.status(400).json(error);
  }
};
export const createBrand = async (req, res) => {
  try {
    // Assuming req.body is an array of data you want to save
    const dataArray = req.body;

    // Create an array to store promises returned by save operation
    const savePromises = [];

    // Iterate over the array and create documents
    dataArray.forEach((data) => {
      const newDocument = new Brands(data);
      savePromises.push(newDocument.save());
    });

    // Wait for all save operations to complete
    await Promise.all(savePromises);

    res.status(201).json({ message: "Documents created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
