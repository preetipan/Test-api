var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");

// เชื่อมต่อ MongoDB Atlas
var mongo_uri = "mongodb+srv://admin:admin@kaow.ukqun.mongodb.net/?retryWrites=true&w=majority&appName=Kaow";
mongoose.connect(mongo_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("[success] task 2 : connected to the database ");
  })
  .catch(error => {
    console.log("[failed] task 2 : " + error);
    process.exit();
  });

// โมเดลหุ้น
var Stock = require("./Models/stockModel");

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log("[success] task 1 : listening on port " + port);
});

// หน้าแรกของ API
app.get("/", (req, res) => {
  res.status(200).send("หน้าแรกของ API express");
});

// เส้นทางสำหรับการดึงข้อมูลหุ้นทั้งหมด
app.get("/stocks", async (req, res) => {
  try {
    const stocks = await Stock.find({});
    console.log("[success] task 3 : fetched all stocks");
    res.status(200).json(stocks);
  } catch (err) {
    console.error("[failed] task 3 : error fetching stocks", err);
    res.status(500).send(err);
  }
});

// เส้นทางสำหรับการเพิ่มข้อมูลหุ้นใหม่
app.post("/add-stock", async (req, res) => {
  try {
    console.log("Adding new stock:", req.body);
    const newStock = new Stock(req.body);
    const savedStock = await newStock.save();
    console.log("[success] task 4 : stock added");
    res.status(200).json(savedStock);
  } catch (err) {
    console.error("[failed] task 4 : error adding stock", err);
    res.status(500).send(err);
  }
});

// เส้นทางสำหรับการอัปเดตข้อมูลหุ้นที่มีอยู่แล้ว
app.put("/update-stock/:id", async (req, res) => {
  try {
    const stockId = req.params.id;
    const updatedData = req.body;

    // ค้นหาหุ้นตาม id และอัปเดตข้อมูล
    const updatedStock = await Stock.findByIdAndUpdate(stockId, updatedData, { new: true, useFindAndModify: false });

    if (!updatedStock) {
      console.log("[failed] task 7 : stock not found for update");
      return res.status(404).send("ไม่พบข้อมูลหุ้นที่ต้องการอัปเดต");
    }

    console.log("[success] task 7 : stock updated");
    res.status(200).json(updatedStock);
  } catch (err) {
    console.error("[failed] task 7 : error updating stock", err);
    res.status(500).send(err);
  }
});

// เส้นทางสำหรับการ upsert ข้อมูลหุ้น (อัปเดตหรือเพิ่มใหม่)
app.post("/upsert-stock", async (req, res) => {
  try {
    const { name, ...restData } = req.body;

    // ตรวจสอบว่ามีหุ้นชื่อนี้ในฐานข้อมูลหรือไม่
    const existingStock = await Stock.findOne({ name });

    if (existingStock) {
      // ถ้ามีอยู่แล้ว อัปเดตข้อมูล
      const updatedStock = await Stock.findByIdAndUpdate(existingStock._id, restData, { new: true, useFindAndModify: false });
      console.log("[success] task 8 : stock updated");
      res.status(200).json(updatedStock);
    } else {
      // ถ้าไม่มีให้เพิ่มใหม่
      const newStock = new Stock(req.body);
      const savedStock = await newStock.save();
      console.log("[success] task 8 : new stock added");
      res.status(200).json(savedStock);
    }
  } catch (err) {
    console.error("[failed] task 8 : error upserting stock", err);
    res.status(500).send(err);
  }
});

// เส้นทางสำหรับการลบข้อมูลหุ้น
app.delete("/delete-stock/:id", async (req, res) => {
  try {
    console.log("Deleting stock with ID:", req.params.id);
    const deletedStock = await Stock.findByIdAndDelete(req.params.id);
    if (!deletedStock) {
      console.log("[failed] task 5 : stock not found");
      return res.status(404).send("ไม่พบข้อมูลหุ้นที่ต้องการลบ");
    }
    console.log("[success] task 5 : stock deleted");
    res.status(200).json({ message: "ลบข้อมูลหุ้นเรียบร้อยแล้ว", deletedStock });
  } catch (err) {
    console.error("[failed] task 5 : error deleting stock", err);
    res.status(500).send(err);
  }
});

// เส้นทางกรณีไม่พบเส้นทางที่ร้องขอ
app.use((req, res, next) => {
  console.log("[failed] task 6 : path not found");
  res.status(404).send("ไม่พบ path ที่คุณต้องการ");
});
