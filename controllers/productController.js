import slugify from "slugify";
import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/OrderModel.js";
import fs from "fs";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();
//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

//create product controller
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res
          .status(404)
          .send({ success: false, message: "Name is required" });
      case !description:
        return res
          .status(404)
          .send({ success: false, message: "Description is required" });
      case !price:
        return res
          .status(404)
          .send({ success: false, message: "Price is required" });
      case !category:
        return res
          .status(404)
          .send({ success: false, message: "Category is required" });
      case !quantity:
        return res
          .status(404)
          .send({ success: false, message: "Qunatity is required" });
      case photo && photo.size > 100000:
        return res.status(404).send({
          success: false,
          message: "Photo is required and should be less than 1mb",
        });
    }
    const product = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in creating product",
      error,
    });
  }
};

//get all products
export const getProductsController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      // .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "All products are fetched",
      total: products.length,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching products",
    });
  }
};

//single product
export const singleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    if (!product) {
      return res.status(500).send({
        success: false,
        message: "No product found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error wwhile fetching single product",
      error: error.message,
    });
  }
};

//photo controller
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error wwhile fetching product photo",
      error: error.message,
    });
  }
};

//delete controller
export const deleteProductController = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findByIdAndDelete(pid).select("-photo");
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Product deleted",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in deleting",
      error,
    });
  }
};

//update controller
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    //validation
    switch (true) {
      case !name:
        return res
          .status(404)
          .send({ success: false, message: "Name is required" });
      case !description:
        return res
          .status(404)
          .send({ success: false, message: "Description is required" });
      case !price:
        return res
          .status(404)
          .send({ success: false, message: "Price is required" });
      case !category:
        return res
          .status(404)
          .send({ success: false, message: "Category is required" });
      case !quantity:
        return res
          .status(404)
          .send({ success: false, message: "Qunatity is required" });
      case photo && photo.size > 100000:
        return res.status(404).send({
          success: false,
          message: "Photo is required and should be less than 1mb",
        });
    }
    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }
    await product.save();
    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Updating product",
      error,
    });
  }
};

//filter controller
export const filterProductsController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in filters",
      error,
    });
  }
};

//product count controller
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in product count",
      error,
    });
  }
};

//product list controller
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(6)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in product list",
      error,
    });
  }
};

//search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(results);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in search",
      error,
    });
  }
};

//related products
export const relatedProductsController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error in similar products",
      error,
    });
  }
};

//get category wise products
export const categoryProductsController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      products,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error,
    });
  }
};

//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in payment token",
      error,
    });
  }
};

//payments
export const braintreePaymentController = async (req, res) => {
  try {
    const { cart, nonce } = req.body;
    let total = 0;
    cart.map((i) => {
      total += i.price;
    });
    let newTransaction = gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      function (error, result) {
        if (result) {
          const order = new orderModel({
            products: cart,
            payment: result,
            buyer: req.user._id,
          }).save();
          res.json({ ok: true });
        } else {
          res.status(500).send(error);
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in payment",
      error,
    });
  }
};
