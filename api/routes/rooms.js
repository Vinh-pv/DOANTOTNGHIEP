const router = require("express").Router();
const Room = require("../models/Room");
const cloudinary = require('../cloudinary');
const getSlug = require('speakingurl');
const { getPlaiceholder } = require("plaiceholder");

// Create Room
router.post("/", async (req, res) => {

  const imgArray = req.body.photos;
  console.log(imgArray);
  try {
    const imgs = await Promise.all(imgArray.map(async (img) => {
      const imgBase64 = await getPlaiceholder(img.src, options = {
          size: 32
        }
      ).then(({ base64 }) => {return {
        src: img.src,
        base64: base64,
        public_id: img.public_id,
      }});

      return imgBase64;
    }));
    console.log(imgs);
    const photos = [...imgs];
    const newRoom = new Room({...req.body, ...{photos}}); // ... nối 2 objects
    // console.log(newPost);
    try {
      console.log(newRoom)
      const saveRoom = await newRoom.save();
      res.status(200).json(saveRoom);
      console.log(newRoom)
    } catch (err) {
      res.status(500).json(err)
    }
  } catch (err) {
    err;
  }
  
});

// Update Post
router.put("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room.username === req.body.username) {
  
      const imgArray = req.body.photos;
      const photosDelete = req.body.photosDelete;
      // console.log(imgArray);
      try {
        const imgs = await Promise.all(imgArray.map(async (img) => {
          const imgBase64 = await getPlaiceholder(img.src, options = {
              size: 32
            }
          ).then(({ base64 }) => {return {
            src: img.src,
            base64: base64,
            public_id: img.public_id,
          }});

          return imgBase64;
        }));
        console.log(imgs);
        const photos = [...imgs];
        try {
          const updatedRoom = await Room.findByIdAndUpdate(req.params.id, {
            $set: {...req.body, ...{photos}}
          }, { new: true });
          
          if (photosDelete) {
            try {
              photosDelete.map((photo) => {
                cloudinary.uploader.destroy(photo.public_id, { invalidate: true }, function(error,result) {
                  console.log(result, error) });
             });
            } catch (err) {
              err;
            }
          }
          res.status(200).json(updatedRoom);
        } catch (err) {
          res.status(500).json(err);
        }
      } catch (err) {
        err;
      }
    } else {
      res.status(401).json("You can update only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (room.username === req.body.username) {
      try {
        await room.delete();
        cloudinary.uploader.destroy(room.public_id, { invalidate: true }, function(error,result) {
          console.log(result, error) });
          try {
              room.photos.map((photo) => {
              cloudinary.uploader.destroy(photo.public_id, { invalidate: true }, function(error,result) {
                console.log(result, error) });
            });
            res.status(200).json("Room has been deleted...");
          } catch (err) {
            err;
          }

      } catch (err) {
        res.status(500).json(err);
      }

    } else {
      res.status(401).json("You can delete only your post!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get room
router.get("/:name", async (req, res) => {
  try {
    const room = await Room.findOne({ name: req.params.name });
    res.status(200).json(room);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all rooms
router.get("/", async (req, res) => {
  const username = req.query.user;
  const catName = req.query.cat;
  const q = getSlug(req.query.q);
  console.log(q)
  const newest = req.query.newest;
  const page = parseInt(req.query.page || 1);
  const num_results_on_page = parseInt(req.query.num_results_on_page || 100);
  // console.log(q);
  try {
    let rooms, total_documents, total_pages;
    if (username) {
      rooms = await Room.find({ username });
    } else if (catName) {
      total_documents = await Room.find({ categories: {
        $in: [catName],
      }}).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      rooms = await Room.find({ categories: {
        $in: [catName],
      }}).skip((page - 1) * num_results_on_page).limit(num_results_on_page);

    } else if (q) {
      total_documents = await Room.find({
        name: {
          $regex: q,
          $options: "i",
        },
      }).countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      rooms = await Room.find({
        name: {
          $regex: q,
          $options: "i",
        },
      }).skip((page - 1) * num_results_on_page).limit(num_results_on_page);

    } else if (newest) {
      rooms = await Room.find().limit(8).sort({ createdAt: -1 });
    }

    else if (page) {
      total_documents = await Room.countDocuments();
      total_pages = Math.ceil(total_documents / num_results_on_page);
      rooms = await Room.find().skip((page - 1) * num_results_on_page).limit(num_results_on_page).sort({ createdAt: 1 });
      // rooms = await Room.find().skip((page - 1) * num_results_on_page).limit(num_results_on_page);
    }
    else {
      rooms = await Room.find(4); // ưu tiên lấy num_results_on_page do page có thể bằng 1 nên else if (page) được thực hiện
    }
    res.status(200).json({page, num_results_on_page, total_documents, total_pages, rooms});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;