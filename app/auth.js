const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("./db.js");
const bcrypt = require('bcryptjs');
const router = express.Router();

const verifyToken = (req, res, next) => {
    const token = req.cookies['token'];
    if (token) {
        jwt.verify(token, "secret key", (err, payload) => {
            if(err){
                res.status(403).send("Error");
            } else {
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(403).json({ message: "Invalid token" });
    }
};

// Registrazione di un nuovo utente
router.post("/signup", async (req, res) => {
    const { username, name, surname, password } = req.body;
    try {
        const mongo = await db.connect2db();
        const user = await mongo.collection("users").findOne({ username });
        if (user) {
            return res.status(401).json({ message: "User already exists!" });
        }
        const lastUser = await mongo.collection("users").findOne({}, { sort: { userId: -1 } });
        let userId = lastUser?.userId !== undefined ? lastUser.userId : -1;
        userId++;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = { userId, username, name, surname, password: hashedPassword };
        await mongo.collection("users").insertOne(newUser);
        return res.json({ message: "User created succesfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Error" });
    }
});

// Login di un utente
router.post("/signin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const mongo = await db.connect2db();
        const user = await mongo.collection("users").findOne({ username });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if(isPasswordValid){
                const data = { id: user.userId, username };
                const token = jwt.sign(data, "secret key", { expiresIn: 86400 });
                res.cookie("token", token, {httpOnly: true});
                return res.json({ message: "Autentication successful! Redirecting..." });
            }
            else {
                return res.status(401).json({ message: "Incorrect password" });
            }
        } else {
            return res.status(401).json({ message: "Unregistred user" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Error" });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'Logout successful' });
});

module.exports = { router, verifyToken };