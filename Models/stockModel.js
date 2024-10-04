var mongoose = require("mongoose");

var StockSchema = new mongoose.Schema({
  stockName: { type: String, required: true },
  y: {
    minus: {
      dataPoints: Number,
      YP80: Number,
      YP50: Number,
      YP20: Number,
      dailyOccurrence: [Number]  // แสดงค่าโอกาสที่เกิดขึ้นต่อวัน
    },
    plus: {
      dataPoints: Number,
      YP80: Number,
      YP50: Number,
      YP20: Number,
      dailyOccurrence: [Number]  // แสดงค่าโอกาสที่เกิดขึ้นต่อวัน
    }
  },
  yh: {
    minus: {
      dataPoints: Number,
      YhP80: Number,
      YhP50: Number,
      YhP20: Number,
      dailyOccurrence: [Number]  // แสดงค่าโอกาสที่เกิดขึ้นต่อวัน
    },
    plus: {
      dataPoints: Number,
      YhP80: Number,
      YhP50: Number,
      YhP20: Number,
      dailyOccurrence: [Number]  // แสดงค่าโอกาสที่เกิดขึ้นต่อวัน
    }
  }
});

module.exports = mongoose.model("Stock", StockSchema);
