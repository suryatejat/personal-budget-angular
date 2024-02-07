// Budget API
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const budget = require('./budgetData.json');

app.use(cors());

app.get("/budget", (req, res) => {
    res.json(budget);
})

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
})