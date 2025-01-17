const express = require('express');
const db = require('./db.js');
const { verifyToken } = require('./auth');
const router = express.Router();

// Elenco degli utenti, si può filtrare con il parametro q
router.get('/', verifyToken, async (req, res) => {
    const { q } = req.query;
    try {
        const mongo = await db.connect2db();
        const query = q ? { username: { $regex: q, $options: 'i' } } : {};
        const users = await mongo.collection('users').find(query).toArray();
        if (users.length === 0) {
            return res.status(200).json({ message: "No users found", users: [] });
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

// Dettagli dell'utente con identificativo id
router.get('/:id', verifyToken, async (req, res) => {
    const userId = parseInt(req.params.id, 10); 
    try {
        const mongo = await db.connect2db();
        const user = await mongo.collection('users').findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const userWonAuctions = await mongo.collection('auctions').find({ winningUser: user.username }).sort({ endDate: -1 }).toArray();
        if(userWonAuctions.length > 0)
        {
            return res.json(userWonAuctions);
        }
        return res.json({ message: "User didn't win any auction" }); 
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;