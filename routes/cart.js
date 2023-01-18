import { Router } from "express";
import { verifyToken, verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
import Cart from "../models/Cart.js";
const router = Router();

// create cart

router.post("/", verifyTokenAuthorization, async (req, res) => {
    const newCart = new Cart(req.body);
    try {
        const savedCart = await newCart.save();
        res.status(201).json(savedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// update cart

router.put("/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// delete cart
router.delete("/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (error) {
        res.status(500).json(error);
    }
});

// get cart
router.get("/find/:id", verifyTokenAuthorization, async (req, res) => {
    try {
        const cart = await Cart.findOne({userId: req.params.id});
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json(error);
    }
});

// get all carts
router.get("/", verifyTokenAuthorization, async (req, res) => {
    
        try {
            const carts = await Cart.find();
            res.status(200).json(carts);
        } catch (error) {
            res.status(500).json(error);
        }
     
});

export default router;

// import { Router } from "express";
// import { verifyTokenAdmin, verifyTokenAuthorization } from "./verifyToken.js";
// import Product from "../models/Product.js";

// const router = Router();

// // create product

// router.post("/", verifyTokenAdmin, async (req, res) => {
//     const newProduct = new Product(req.body);
//     try {
//         const savedProduct = await newProduct.save();
//         res.status(201).json(savedProduct);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

// // update product

// router.put("/:id", verifyTokenAdmin, async (req, res) => {
//     try {
//         const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 $set: req.body,
//             },
//             { new: true }
//         );
//         res.status(200).json(updatedProduct);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

// // delete product
// router.delete("/:id", verifyTokenAdmin, async (req, res) => {
//     try {
//         await Product.findByIdAndDelete(req.params.id);
//         res.status(200).json("Product has been deleted...");
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

// // get product
// router.get("/find/:id", verifyTokenAdmin, async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id);
//         res.status(200).json(product);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

// // get all products
// router.get("/", verifyTokenAdmin, async (req, res) => {
//     const queryNew = req.query.new;
//     const queryCategory = req.query.category;
//     if (queryNew) {
//         try {
//             const products = await Product.find().sort({ _id: -1 }).limit(5);
//             res.status(200).json(products);
//         } catch (error) {
//             res.status(500).json(error);
//         }
//     } else if (queryCategory) {
//         try {
//             const products = await Product.find({
//                 categories: {
//                     $in: [queryCategory],
//                 },
//             });
//             res.status(200).json(products);
//         } catch (error) {
//             res.status(500).json(error);
//         }
//     } else {
//         try {
//             const products = await Product.find();
//             res.status(200).json(products);
//         } catch (error) {
//             res.status(500).json(error);
//         }
//     }
// });
