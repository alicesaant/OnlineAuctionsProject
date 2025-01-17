const express = require('express');
const cookieParser = require('cookie-parser');
const { router: authRouter } = require("./auth");
const whoamiRouter = require("./whoami");
const usersRouter = require("./users");
const auctionsRouter = require("./auctions");
const bidsRouter = require("./bids");
const filldb = require("./fillDatabase.js");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/whoami", whoamiRouter);
app.use("/api/users", usersRouter);
app.use("/api/auctions", auctionsRouter);
app.use("/api/bids", bidsRouter);

app.use(express.static('public'));

app.listen(3000, async () => {
    try {
        await filldb.fillDatabase();
        console.log("Database initialized");
    } catch (error) {
        console.error("Error initializing database");
    } finally {
        console.log("Active server on http://localhost:3000");
    }
});