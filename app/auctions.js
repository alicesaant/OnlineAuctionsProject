const express = require('express');
const db = require('./db.js');
const router = express.Router();
const { verifyToken } = require("./auth");

// Elenco di tutte le aste, si può filtrare con il parametro q
router.get('/', async (req, res) => {
    const { q } = req.query;
    try {
        const mongo = await db.connect2db();
        const query = q ? { title: { $regex: q, $options: 'i' } } : {};
        const currentDate = new Date();
        const auctions = await mongo.collection('auctions').find(query).toArray();
        if (auctions.length === 0) {
            return res.status(200).json({ message: "No auctions found", auctions: [] });
        }
        for (const auction of auctions) {
            if ((new Date(auction.endDate) <= currentDate) && !auction.winningUser) {
                const highestBid = await mongo.collection('bids')
                    .find({ auctionId: auction.auctionId })
                    .sort({ bidAmount: -1 })
                    .limit(1)
                    .toArray();
                if (highestBid.length > 0) {
                    const winningBid = highestBid[0];
                    if(winningBid.bidAmount == auction.currentPrice) {
                        await mongo.collection('auctions').updateOne(
                            { auctionId: auction.auctionId },
                            { $set: { winningUser: winningBid.creator } }
                        );
                    }
                }
            }
        }
        return res.json(auctions);
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

// Crea una nuova asta, solo per utenti autenticati
router.post('/', verifyToken, async (req, res) => {
    const { title, description, endDate, startingPrice } = req.body;
    const creator = req.user.username;

    try {
        const mongo = await db.connect2db();
        const lastAuction = await mongo.collection("auctions").findOne({}, { sort: { auctionId: -1 } });
        let auctionId = lastAuction?.auctionId !== undefined ? lastAuction.auctionId : -1;
        auctionId++;
        const newAuction = { auctionId, title, description, endDate, startingPrice, creator };
        await mongo.collection('auctions').insertOne(newAuction);
        return res.status(201).json({ message: "Auction created successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

// Dettagli dell'asta specifica con identificativo id
router.get('/:id', async (req, res) => {
    const auctionId = parseInt(req.params.id, 10); 
    try {
        const mongo = await db.connect2db();
        const auction = await mongo.collection('auctions').findOne({ auctionId });

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }

        return res.json(auction);
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

// Modifica di un'asta esistente con identificativo id, previa autenticazione
router.put('/:id', verifyToken, async (req, res) => {
    const auctionId = parseInt(req.params.id, 10);
    const { title, description } = req.body;
    const username = req.user.username;

    try {
        const mongo = await db.connect2db();
        const auction = await mongo.collection('auctions').findOne({ auctionId });

        if (!auction || auction.creator !== username) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;

        const result = await mongo.collection('auctions').updateOne(
            { auctionId },
            { $set: updateFields }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Auction not updated" });
        }

        return res.json({ message: "Auction updated successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

// Elimina un'asta esistente con identificativo id, solo il creatore dell'asta può
router.delete('/:id', verifyToken, async (req, res) => {
    const auctionId = parseInt(req.params.id, 10);
    const username = req.user.username;
    
    try {
        const mongo = await db.connect2db();
        const auction = await mongo.collection('auctions').findOne({ auctionId });

        if (!auction || auction.creator !== username) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await mongo.collection('auctions').deleteOne({ auctionId });

        return res.json({ message: "Auction deleted successfully!" });
    } catch (error) {
        return res.status(500).json({ message: "Internal error" });
    }
});

// Elenco delle offerte per l'asta con identificativo id
router.get('/:id/bids', async (req, res) => {
    const auctionId = parseInt(req.params.id, 10); 
    try {
        const mongo = await db.connect2db();
        const bids = await mongo.collection('bids').find({ auctionId }).sort({ bidAmount: -1 }).toArray();
        return res.json(bids);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching bids" });
    }
});

// Nuova offerta per l'asta con identificativo id, previa autenticazione
router.post('/:id/bids', verifyToken, async (req, res) => {
    const auctionId = parseInt(req.params.id, 10); 
    const { bidAmount } = req.body;
    const username = req.user.username;

    if (!bidAmount || bidAmount <= 0) {
        return res.status(400).json({ message: 'Invalid bid amount' });
    }
  
    try {
        const mongo = await db.connect2db();
        const auction = await mongo.collection('auctions').findOne({ auctionId });

        if (!auction) {
            return res.status(404).json({ message: "Auction not found" });
        }
        const currentDate = new Date();
        if (currentDate > new Date(auction.endDate)) {
            return res.status(400).json({ message: 'Auction has already ended' });
        }

        if (!auction.currentPrice) {
            if (bidAmount <= auction.startingPrice) {
                return res.status(400).json({
                    message: 'Bid amount must be greater than the starting price',
                });
            }
        } else {
            if (bidAmount <= auction.currentPrice) {
                return res.status(400).json({
                    message: 'Bid amount must be greater than the current price',
                });
            }
        }
        const lastBid = await mongo.collection("bids").findOne({}, { sort: { bidId: -1 } });
        let bidId = lastBid?.bidId !== undefined ? lastBid.bidId : -1;
        bidId++;
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        const hours = today.getHours().toString().padStart(2, '0');
        const minutes = today.getMinutes().toString().padStart(2, '0');
        const seconds = today.getSeconds().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        const newBid = { bidId, auctionId, creator: username, bidAmount, createdAt: formattedDate };
        await mongo.collection('bids').insertOne(newBid);

        await mongo.collection('auctions').updateOne(
            { auctionId },
            { $set: { currentPrice: bidAmount } }
        );
        return res.status(201).json({ message: "Bid successfully placed!" });
    } catch (error) {
        return res.status(500).json({ message: "Error placing bid" });
    }
});

module.exports = router;