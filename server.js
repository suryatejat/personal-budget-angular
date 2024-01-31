const express = require("express");
const app = express();
const port = 3000;

const budget = require('./budgetData.json');

app.use("/", express.static('public'))

app.get("/budget", (req, res) => {
    res.json(budget);
})

app.listen(port, () => {
    console.log(`Listining to http://localhost:${port}`)
})