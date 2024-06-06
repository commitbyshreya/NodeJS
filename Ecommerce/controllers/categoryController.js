const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");

//POST -> /api/add-category
const addCategory = asyncHandler(async (req, res) => {
    const { category } = req.body;
    const existingCat = await Category.findOne({ category: category })
    if (existingCat) {
        res.status(400)
        throw new Error(`${category} category already exists`)
    }
  const addCat = await Category.create({ category });
  if (!addCat) {
    res.status(400);
    throw new Error("Category not added");
  }
  res.status(200).json({ message: "Category Added!" });
});

//GET -> /api/get-cat
const getCategories = asyncHandler(async(req, res) => {
  const categories = await Category.find()
  return categories
  // res.status(200).json({categories: categories})
})

module.exports = { addCategory, getCategories };
