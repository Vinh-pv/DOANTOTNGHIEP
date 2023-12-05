const router = require("express").Router();
const UtilityBill = require("../models/UtilityBill");
const Room = require("../models/Room");
const getSlug = require("speakingurl");

// Create UtilityBill
router.post("/", async (req, res) => {
  try {
      const newUtilityBill = new UtilityBill(req.body);
      const saveUtilityBill = await newUtilityBill.save();
      res.status(200).json(saveUtilityBill);
      console.log("Tạo thành công!");
  } catch (err) {
    err;
  }
});

// Update UtilityBil
router.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
      try {
        const updatedUtilityBill = await UtilityBill.findByIdAndUpdate(
          req.params.id,
          {
            $set: {...req.body},
          },
          { new: true }
        );
        res.status(200).json(updatedUtilityBill);
      } catch (err) {
        res.status(500).json(err);
      }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete UtilityBills
router.delete("/:id", async (req, res) => {
  try {
    // console.log(req.body.roomId);
    const roomId = await Room.findOne({ name: req.body.roomId });
    const { used } = roomId;
    const UtilityBill = await UtilityBill.findById(req.params.id);
    try {
      await Room.findOneAndUpdate({name: req.body.roomId}, {
        $set: {...{used: used - 1}}
      }, { new: true });
      await UtilityBill.delete();
      res.status(200).json("Room has been deleted...");
    } catch (err) {
      res.status(500).json(err); 
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get UtilityBill
router.get("/:username", async (req, res) => {
  try {
    const UtilityBill = await UtilityBill.find({ username: req.params.username });
    res.status(200).json(UtilityBill);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all UtilityBill
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  const q = getSlug(req.query.q);
  console.log(q);
  const newest = req.query.newest;
  const page = parseInt(req.query.page || 1);
  const num_results_on_page = parseInt(req.query.num_results_on_page || 100);
  // console.log(q);
  try {
    let utilityBills, total_documents, total_pages;
    if (username) {
      utilityBills = await UtilityBill.find({ username });
    } else if (catName) {
      total_documents = await UtilityBill.find({
        categories: {
          $in: [catName],
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      utilityBills = await UtilityBill.find({
        categories: {
          $in: [catName],
        },
      })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (q) {
      total_documents = await UtilityBill.find({
        name: {
          $regex: q,
          $options: "i",
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      utilityBills = await UtilityBill.find({
        name: {
          $regex: q,
          $options: "i",
        },
      })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (newest) {
      utilityBills = await UtilityBill.find().limit(8).sort({ createdAt: -1 });
    } else if (page) {
      total_documents = await UtilityBill.countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      utilityBills = await UtilityBill.find()
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page)
        .sort({ createdAt: 1 });
      // utilityBills = await UtilityBill.find().skip((page - 1) * num_results_on_page).limit(num_results_on_page);
    } else {
      utilityBills = await UtilityBill.find(); // ưu tiên lấy num_results_on_page do page có thể bằng 1 nên else if (page) được thực hiện
    }
    res
      .status(200)
      .json({ page, num_results_on_page, total_documents, total_pages, utilityBills });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
