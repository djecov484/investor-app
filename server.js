require("dotenv").config();
const {PORT = 3000, MONGODB_URL} = process.env;
const express = require("express");
const importData = require("./data.json");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  // Connection Events
  mongoose.connection
    .on("open", () => console.log("Your are connected to mongoose"))
    .on("close", () => console.log("Your are disconnected from mongoose"))
    .on("error", (error) => console.log(error));




//Models 
const RankingsSchema = new mongoose.Schema({
    rank: Number,
    name: String,
    marketCap: Number,
    country: String
})
const Rankings = mongoose.model("Rankings", RankingsSchema)

// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev"))
app.use(express.json()); // parse json bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//ROUTES///
//Test route
app.get("/", (req, res) => {
    res.send("hello world")
});

//Index Route
app.get("/rankings", async(req, res) => {
    try {
        res.json(await Rankings.find({}));
    } catch (error) {
        res.status(400).json(error)
    }
});

//Create Route
app.post("/rankings", async(req, res) => {
    console.log(req.body)
    try{
        res.json(await Rankings.create(req.body))
    } catch (error) {
        res.status(400).json(error);
    }
});

//Update Route
app.put("/rankings/:id", async(req, res) => {
    try{
       res.json( await Rankings.findByIdAndUpdate(req.params.id, req.body, {new: true})
       );
    } catch (error) {
        res.status(400).json(error);
    }
});

//Delete Route
app.delete("/rankings/:id", async(req,res) => {
    try {
        res.json(await Rankings.findByIdAndRemove(req.params.id));
    } catch (error){
        res.status(400).json(error);
    }
})


//Show route






app.listen(PORT, () => 
console.log(`listening on PORT ${PORT}`));
