const db = require("./db.js");
const bcrypt = require('bcryptjs');

module.exports = {
    fillDatabase: async () => {
        const mongo = await db.connect2db();
        try {
            const userCount = await mongo.collection('users').countDocuments();
            const auctionCount = await mongo.collection('auctions').countDocuments();
            
            if (userCount > 0 || auctionCount > 0) {
            return;
            }

            const users = [
                { userId: 0, username: "johnsmith", name: "John", surname: "Smith", password: await bcrypt.hash("Secure$123", 12) },
                { userId: 1, username: "emilydavis", name: "Emily", surname: "Davis", password: await bcrypt.hash("Pass!word8", 12) },
                { userId: 2, username: "michaelbrown", name: "Michael", surname: "Brown", password: await bcrypt.hash("Mike@4567", 12) },
                { userId: 3, username: "sarajones", name: "Sara", surname: "Jones", password: await bcrypt.hash("Sara$Pass99", 12) },
                { userId: 4, username: "davidclark", name: "David", surname: "Clark", password: await bcrypt.hash("Clark@2021", 12) },
                { userId: 5, username: "lucywhite", name: "Lucy", surname: "White", password: await bcrypt.hash("Lucy#777!", 12) },
                { userId: 6, username: "robertmiller", name: "Robert", surname: "Miller", password: await bcrypt.hash("Miller$1234", 12) },
                { userId: 7, username: "annathompson", name: "Anna", surname: "Thompson", password: await bcrypt.hash("Anna!Pass1", 12) },
                { userId: 8, username: "charleslee", name: "Charles", surname: "Lee", password: await bcrypt.hash("Lee@1234$", 12) },
                { userId: 9, username: "karenwalker", name: "Karen", surname: "Walker", password: await bcrypt.hash("Walk3r#!", 12) },
            ];

            await mongo.collection("users").insertMany(users);
            console.log("Users inserted");

            const currentDate = new Date();

            const auctions = [
                { auctionId: 0, title: "Vintage Watch", description: "A classic vintage watch from the 90s in excellent condition.", endDate: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 150, creator: "johnsmith", winningUser: "emilydavis" },
                { auctionId: 1, title: "Modern Painting", description: "A modern abstract painting by a well-known local artist.", endDate: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 500, creator: "emilydavis", winningUser: null },
                { auctionId: 2, title: "Used Laptop", description: "A gently used laptop in great working condition, 8GB RAM, 512GB SSD.", endDate: new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 350, creator: "michaelbrown", winningUser: null },
                { auctionId: 3, title: "Antique Table", description: "An antique wooden table from the 18th century, well-preserved.", endDate: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 800, creator: "sarajones", winningUser: "johnsmith" },
                { auctionId: 4, title: "Electric Scooter", description: "A brand new electric scooter, great for city commuting.", endDate: new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 250, creator: "davidclark", winningUser: null },
                { auctionId: 5, title: "Designer Handbag", description: "A high-end designer handbag, gently used, from a famous fashion brand.", endDate: new Date(currentDate.getTime() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 1200, creator: "lucywhite", winningUser: null },
                { auctionId: 6, title: "Mountain Bike", description: "A durable mountain bike, great for off-road cycling.", endDate: new Date(currentDate.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 450, creator: "robertmiller", winningUser: null },
                { auctionId: 7, title: "Smartphone", description: "A flagship smartphone, barely used, unlocked and ready for any carrier.", endDate: new Date(currentDate.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 700, creator: "annathompson", winningUser: "michaelbrown" },
                { auctionId: 8, title: "Luxury Watch", description: "A luxury watch with a sleek design and modern features.", endDate: new Date(currentDate.getTime() + 35 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 3000, creator: "charleslee", winningUser: null },
                { auctionId: 9, title: "Vintage Guitar", description: "A vintage guitar in perfect condition, a collector's item.", endDate: new Date(currentDate.getTime() + 41 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 1500, creator: "karenwalker", winningUser: null },
                { auctionId: 10, title: "Classic Car", description: "A rare classic car from the 70s, fully restored.", endDate: new Date(currentDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 20000, creator: "johnsmith", winningUser: null },
                { auctionId: 11, title: "Sculpture Art", description: "A stunning modern sculpture made of marble, unique and elegant.", endDate: new Date(currentDate.getTime() + 50 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 7500, creator: "emilydavis", winningUser: null },
                { auctionId: 12, title: "High-End DSLR Camera", description: "A professional DSLR camera with multiple lenses and accessories.", endDate: new Date(currentDate.getTime() + 53 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 1300, creator: "michaelbrown", winningUser: null },
                { auctionId: 13, title: "Gold Necklace", description: "A 24K gold necklace, simple but elegant design.", endDate: new Date(currentDate.getTime() + 56 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 1200, creator: "sarajones", winningUser: null },
                { auctionId: 14, title: "Fitness Tracker", description: "A state-of-the-art fitness tracker, monitor your health and workouts.", endDate: new Date(currentDate.getTime() + 59 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 250, creator: "davidclark", winningUser: null },
                { auctionId: 15, title: "Designer Shoes", description: "A pair of luxury designer shoes, new and in perfect condition.", endDate: new Date(currentDate.getTime() + 62 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 450, creator: "lucywhite", winningUser: null },
                { auctionId: 16, title: "Digital Piano", description: "A high-quality digital piano, great for practice and performances.", endDate: new Date(currentDate.getTime() + 66 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 900, creator: "robertmiller", winningUser: null },
                { auctionId: 17, title: "Home Theater System", description: "A complete home theater system with surround sound and 4K capabilities.", endDate: new Date(currentDate.getTime() + 69 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 1500, creator: "annathompson", winningUser: null },
                { auctionId: 18, title: "Smartwatch", description: "A sleek smartwatch with fitness tracking and mobile notifications.", endDate: new Date(currentDate.getTime() + 72 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 300, creator: "charleslee", winningUser: null },
                { auctionId: 19, title: "Vintage Camera", description: "A vintage camera from the 1950s, perfect for collectors and photography enthusiasts.", endDate: new Date(currentDate.getTime() + 74 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10), startingPrice: 500, creator: "karenwalker", winningUser: null }
            ];

            await mongo.collection("auctions").insertMany(auctions);
            console.log("Auctions inserted");

            let bidIdCounter = 0;
            const generateAndInsertBids = async (auctions) => {
                for (const auction of auctions) {
                    let currentMaxBid = 0;
                    const numBids = Math.floor(Math.random() * 5) + 3;
            
                    for (let i = 0; i < numBids; i++) {
                        const newBidAmount = currentMaxBid + Math.floor(Math.random() * 500) + 1;
                        currentMaxBid = newBidAmount;
            
                        const bidDate = new Date(auction.endDate);
                        bidDate.setDate(bidDate.getDate() - Math.floor(Math.random() * (7 + 1)));
                        bidDate.setHours(Math.floor(Math.random() * 24));
                        bidDate.setMinutes(Math.floor(Math.random() * 60));
                        bidDate.setSeconds(Math.floor(Math.random() * 60));
                        const createdAt = bidDate.toISOString().replace('T', ' ').split('.')[0];
                        const randomUser = users[Math.floor(Math.random() * users.length)];

                        const bid = {
                            bidId: bidIdCounter++,
                            auctionId: auction.auctionId,
                            creator: randomUser.username,
                            bidAmount: newBidAmount,
                            createdAt: createdAt
                        };

                        await mongo.collection("bids").insertOne(bid);
                    }

                    auction.currentPrice = currentMaxBid;
            
                    await mongo.collection("auctions").updateOne(
                        { auctionId: auction.auctionId },
                        { $set: { currentPrice: auction.currentPrice } }
                    );
                }
            };

            await generateAndInsertBids(auctions);
            
            console.log("Bids inserted");
        } catch (error) {
            console.error("Error during database initialization: ", error);
            throw error;
        }
    }
}