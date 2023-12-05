const router = require("express").Router();
const Registration = require("../models/Registration");
const Room = require("../models/Room");
const cloudinary = require("../cloudinary");
const getSlug = require("speakingurl");
const { getPlaiceholder } = require("plaiceholder");

// Create Registration
router.post("/", async (req, res) => {
  try {
    const registered = await Registration.findOne({ username: req.body.username });
    const roomId = await Room.findOne({ name: req.body.roomId });
    const { used, maxUser } = roomId;
    console.log(used, maxUser);
    // console.log(registered.year, registered.semester);
    if (req.body?.semester === registered?.semester && req.body?.year === registered?.year) {
      res.status(401).json("Bạn đã đăng ký trước đó!");
    } else if (used < maxUser) {
      await Room.findOneAndUpdate({name: req.body.roomId}, {
          $set: {...{used: used + 1}}
        }, { new: true });
      const newRegistration = new Registration(req.body);
      const saveRegistration = await newRegistration.save();
      res.status(200).json(saveRegistration);
      console.log("Đăng ký thành công!");
    } else {
      res.status(401).json("Phòng hết chỗ!");
      console.log("Phòng hết chỗ!")
    }
  } catch (err) {
    err;
  }
});

// Update Post
router.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
      try {
        const updatedRegistration = await Registration.findByIdAndUpdate(
          req.params.id,
          {
            $set: {...req.body},
          },
          { new: true }
        );
        res.status(200).json(updatedRegistration);
      } catch (err) {
        res.status(500).json(err);
      }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Registrations
router.delete("/:id", async (req, res) => {
  try {
    // console.log(req.body.roomId);
    const roomId = await Room.findOne({ name: req.body.roomId });
    const { used } = roomId;
    const registration = await Registration.findById(req.params.id);
    try {
      await Room.findOneAndUpdate({name: req.body.roomId}, {
        $set: {...{used: used - 1}}
      }, { new: true });
      await registration.delete();
      res.status(200).json("Room has been deleted...");
    } catch (err) {
      res.status(500).json(err); 
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get registration
router.get("/:username", async (req, res) => {
  try {
    const registration = await Registration.find({ username: req.params.username });
    res.status(200).json(registration);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all registration
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  const q = getSlug(req.query.q);
  console.log(q);
  const newest = req.query.newest;
  const page = parseInt(req.query.page || 1);
  const num_results_on_page = parseInt(req.query.num_results_on_page || 11);
  // console.log(q);
  try {
    let registrations, total_documents, total_pages;
    if (username) {
      registrations = await Registration.find({ username });
    } else if (catName) {
      total_documents = await Registration.find({
        categories: {
          $in: [catName],
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      registrations = await Registration.find({
        categories: {
          $in: [catName],
        },
      })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (q) {
      total_documents = await Registration.find({
        name: {
          $regex: q,
          $options: "i",
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      registrations = await Registration.find({
        name: {
          $regex: q,
          $options: "i",
        },
      })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (newest) {
      registrations = await Registration.find().limit(8).sort({ createdAt: -1 });
    } else if (page) {
      total_documents = await Registration.countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      registrations = await Registration.find()
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page)
        .sort({ createdAt: 1 });
      // registrations = await Registration.find().skip((page - 1) * num_results_on_page).limit(num_results_on_page);
    } else {
      registrations = await Registration.find(); // ưu tiên lấy num_results_on_page do page có thể bằng 1 nên else if (page) được thực hiện
    }
    res
      .status(200)
      .json({ page, num_results_on_page, total_documents, total_pages, registrations });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
