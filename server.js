const express = require("express");
const app = express();
const port = 3000;

app.use("/", express.static('public'))

const budget = [
    {
        title: "Eat Out",
        budget: 100
    },
    {
        title: "Rent",
        budget: 400
    },
    {
        title: "Gorceries",
        budget: 50
    }
]

app.get("/budget", (req, res) => {
    res.json(budget);
})

app.listen(port, () => {
    console.log(`Listining to http://localhost:${port}`)
})