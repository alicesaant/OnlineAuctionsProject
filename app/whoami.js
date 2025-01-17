const express = require('express');
const { verifyToken } = require('./auth');
const db = require('./db.js');
const router = express.Router();

// Se autenticato, restituisce le informazioni sull'utente
router.get('/', verifyToken, async (req, res) => {
    try {
        const mongo = await db.connect2db();
        const user = await mongo.collection('users').findOne({ userId: req.user.id });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const userDetails = {
            userId: user.userId,
            username: user.username,
            name: user.name,
            surname: user.surname,
        };

        return res.json(userDetails);
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;