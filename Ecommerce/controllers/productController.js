const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')
const Category_controller = require('../controllers/categoryController')
const Store_controller = require('../controllers/storeController')

//POST -> /api/add-prod
const addProduct = asyncHandler(async (req, res) => {
    const { vendor_id, store_id, price, name, category_id } = req.body
    var arrImages = []
    for (let i = 0; i < req.files.length; i++){
        arrImages[i]  = req.files? req.files[i].filename : null
    }
    const addProd = await Product.create({
        vendor_id,
        store_id,
        price,
        name,
        category_id,
        images:arrImages
    })
    if (!addProd) {
        res.status(400)
        throw new Error("Product not added")
    }
    res.status(200).json({message:"Product Added", addProd})
})

//GET -> /api/get-prod
const getProducts = asyncHandler(async (req, res) => {
    try {
        let send_data = []
        let cat_data = await Category_controller.getCategories()

        if (cat_data.length > 0) {
            for (const category of cat_data) {
                let product_data = []
                let cat_id = category['id'].toString()
                let cat_prod = await Product.find({ category_id: cat_id })

                if (cat_prod.length > 0) {
                    for (const product of cat_prod) {
                        let store_data = await Store_controller.getStore(product['store_id'])
                        product_data.push({
                            "product_name": product['name'],
                            "images": product['images'],
                            "store_address": store_data ? store_data['address'] : "Address not found"
                        })
                    }
                }

                send_data.push({
                    "category": category['category'],
                    "products": product_data
                })
            }

            return res.status(200).json({ Product: send_data })
        } else {
            return res.status(200).json({ message: "Product Details not found" })
        }
    } catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

//GET -> /api/search-prod
const searchProduct = asyncHandler(async (req, res) => {
    const { search } = req.body
    const product = await Product.find({ "name": { $regex : ".*" + search + ".*" , $options: 'i'} })
    if (product.length <= 0) {
        res.status(404)
        throw new Error("Products not found")
    }
    res.status(200).json({Products: product})
})

module.exports = {addProduct,getProducts,searchProduct}