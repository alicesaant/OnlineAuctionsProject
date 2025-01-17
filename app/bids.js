const express = require('express');
const db = require('./db.js');
const router = express.Router();

// Dettagli dell'offerta con identificativo id
router.get('/:id', async (req, res) => {
    const bidId = parseInt(req.params.id, 10); 
    try {
        const mongo = await db.connect2db();
        const bid = await mongo.collection('bids').findOne({ bidId });

        if (!bid) {
            return res.status(404).json({ message: "Bid not found" });
        }

        return res.json(bid);
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

module.exports = router;