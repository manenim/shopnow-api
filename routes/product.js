import { Router } from "express";
import {verifyToken, verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
import Product from "../models/Product.js";

const router = Router();

/**
 * @openapi
 * /api/products:
 *  post:
 *    tags:
 *      - Products
 *    summary: Add a Product
 *    requestBody:
 *      description: Adds a Product with corresponding properties
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *                default: Stretched Shirts
 *              desc:
 *                type: string
 *                default: Great shirts for casual outings
 *              img:
 *                type: string
 *                default: https://i.pinimg.com/564x/c4/23/06/c42306bd1d0cc3a860aceeda2e3a65d6.jpg
 *              category:
 *                type: array
 *                default: [shirts]
 *              size:
 *                type: array
 *                default: [M, S]
 *              color:
 *                type: array
 *                default: [gray]
 *              price:
 *                type: integer
 *                default: 1200
 *              inStock:
 *                type: boolean
 *                default: true
 *    responses:
 *      201:
 *        description: 'Added a Product'
 *      400:
 *        description: 'Bad Request'
 */
router.post("/", async (req, res) => {
    const newProduct = new Product(req.body);
    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});


/**
 * @openapi
 * paths:
 *  /api/products/{id}:
 *    put:
 *      tags:
 *        - Products
 *      summary: Update product Info
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *            default: 6354414135848dbd9cdc6e2e
 *      requestBody:
 *        description: Update Product information
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                  default: Stretched Shirts
 *                desc:
 *                  type: string
 *                  default: Great shirts for casual outings
 *                img:
 *                  type: string
 *                  default: https://i.pinimg.com/564x/c4/23/06/c42306bd1d0cc3a860aceeda2e3a65d6.jpg
 *                category:
 *                  type: array
 *                  default: [shirts]
 *                size:
 *                  type: array
 *                  default: [M, S]
 *                color:
 *                  type: array
 *                  default: [gray]
 *                price:
 *                  type: integer
 *                  default: 1200
 *                inStock:
 *                  type: boolean
 *                  default: true
 *      responses:
 *        201:
 *          description: 'An updated Product'
 *        400:
 *          description: 'Something went wrong'
 */
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json(error);
    }
});



/**
 * @openapi
 * paths:
 *  /api/products/{id}:
 *    delete:
 *      tags:
 *        - Products
 *      summary: Delete a Product
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *            default: "6354414135848dbd9cdc6e2e"
 *          required: true
 *          description: unique ID Of the Product to be deleted
 *      responses:
 *        200:
 *          description: 'Product has been deleted'
 *        400:
 *          description: 'Bad Request'
 */
router.delete("/:id", verifyTokenAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Product has been deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
});


/**
 * @openapi
 * paths:
 *  /api/products/{id}:
 *    get:
 *      tags:
 *        - Products
 *      summary: Get a Product
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *            default: "6354414135848dbd9cdc6e2e"
 *          required: true
 *          description: unique ID Of the product to get
 *      responses:
 *        200:
 *          description: 'Access detailed information about a specific clothing item, including descriptions, images, and variations (e.g., size, color).'
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  desc:
 *                    type: string
 *                  img:
 *                    type: string
 *                  category:
 *                    type: array
 *                  size:
 *                    type: array
 *                  color:
 *                    type: array
 *                  price:
 *                    type: integer
 *                  inStock:
 *                    type: boolean
 *                example:
 *                    id: "65e5b4925fed3c6fb66daab9"
 *                    title: Shivon
 *                    desc: "Shivon Shirts for ceremonies and occasions"
 *                    img: https://i.pinimg.com/564x/a4/6e/33/a46e33d626899a6a274096d5017671ae.jpg
 *                    category: [shirts, merch]
 *                    sizes: [L, M]
 *                    color: [black, grey]
 *                    price: 1500
 *                    inStock: true
 *        400:
 *          description: 'Bad Request'
 */
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json(error);
    }
});


/**
 * @openapi
 * /api/products/:
 *  get:
 *    tags:
 *      - Products
 *    summary: Get all Products
 *    responses:
 *      200:
 *        description: 'Retrieve a list of available clothes, with filters for categories, sizes, colors, and other relevant attributes'
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *              properties:
 *              
 *                  id:
 *                    type: string
 *                  title:
 *                    type: string
 *                  desc:
 *                    type: string
 *                  img:
 *                    type: string
 *                  category:
 *                    type: array
 *                  size:
 *                    type: array
 *                  color:
 *                    type: array
 *                  price:
 *                    type: integer
 *                  inStock:
 *                    type: boolean
 * 
 *              example:
 *                  id: "6354414135848dbd9cdc6e2e"
 *                  title: Shivon
 *                  desc: "Shivon Shirts for ceremonies and occasions"
 *                  img: https://i.pinimg.com/564x/a4/6e/33/a46e33d626899a6a274096d5017671ae.jpg
 *                  category: [shirts, merch]
 *                  sizes: [L, M]
 *                  color: [black, grey]
 *                  price: 1500
 *                  inStock: true
 *      400:
 *        description: 'Bad Request'
 */
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
      let products;
  
      if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCategory) {
        products = await Product.find({
          category: {
            $in: [qCategory],
          },
        });
        console.log(qCategory)
      } else {
        products = await Product.find();
      }
  
      res.status(200).json(products);
    } catch (err) {
      res.status(500).json(err);
    }
});




export default router;


// Language: javascript
// Path: routes\user.js
