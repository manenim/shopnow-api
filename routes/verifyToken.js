import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    !authHeader && res.status(403).json("You are not authenticated!");

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) res.status(403).json("You are not authenticated!");
        req.user = user;
        next();
    }) 
}

export const verifyTokenAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        req.user.id == req.params.id || req.user.isAdmin ? next() : res.status(403).json("You are not allowed to perform this action!")
    })
}

export const verifyTokenAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        req.user.isAdmin ? next() : res.status(403).json("You are not allowed to perform this action!")
    })
}

