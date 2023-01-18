import { Router } from "express";
import Stripe from "stripe";
const stripe = Stripe(process.env.STRIPE_KEY || "sk_test_51Lk53MH8CPKa16qvIgF3Lhp6WEjTih9UmJS33n6rL1WI330QL3SmANI3VeMCAaD9xWO4HJSIve4sAQ64RUgwyljQ00POW165Ud")


const router = Router();

router.post('/payment', (req, res) => {
    stripe.charges.create(
        {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
    },
    (stripeErr, stripeRes) => {
        if(stripeErr){
            res.status(500).json(stripeErr)
        }else{
            res.status(200).json(stripeRes)
        }
    }
    )
})


export default router