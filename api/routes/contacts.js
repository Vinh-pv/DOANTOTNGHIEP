const router = require("express").Router();
const Contact = require("../models/Contact");
const getSlug = require("speakingurl");

// Create Contact
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const newContact = new Contact(req.body);
      const saveContact = await newContact.save();
      res.status(200).json(saveContact);
  } catch (err) {
    err;
  }
});

// Update Contact
router.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
      try {
        const updatedContact = await Contact.findByIdAndUpdate(
          req.params.id,
          {
            $set: {...req.body},
          },
          { new: true }
        );
        res.status(200).json(updatedContact);
      } catch (err) {
        res.status(500).json(err);
      }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Contacts
router.delete("/:id", async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    try {
      await contact.delete();
      res.status(200).json("Contact has been deleted...");
    } catch (err) {
      res.status(500).json(err); 
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get Contact
router.get("/:username", async (req, res) => {
  try {
    const contact = await Contact.find({ username: req.params.username });
    res.status(200).json(contact);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all Contact
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
    let contacts, total_documents, total_pages;
    if (username) {
      contacts = await Contact.find({ username });
    } else if (catName) {
      total_documents = await Contact.find({
        categories: {
          $in: [catName],
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      contacts = await Contact.find({
        categories: {
          $in: [catName],
        },
      })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (q) {
      total_documents = await Contact.find({
        name: {
          $regex: q,
          $options: "i",
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      contacts = await Contact.find({
        name: {
          $regex: q,
          $options: "i",
        },
      })
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page);
    } else if (newest) {
      contacts = await Contact.find().limit(8).sort({ createdAt: -1 });
    } else if (page) {
      total_documents = await Contact.countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      contacts = await Contact.find()
        .skip((page - 1) * num_results_on_page)
        .limit(num_results_on_page)
        .sort({ createdAt: 1 });
      // contacts = await Contact.find().skip((page - 1) * num_results_on_page).limit(num_results_on_page);
    } else {
      contacts = await Contact.find(); // ưu tiên lấy num_results_on_page do page có thể bằng 1 nên else if (page) được thực hiện
    }
    res
      .status(200)
      .json({ page, num_results_on_page, total_documents, total_pages, contacts });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
