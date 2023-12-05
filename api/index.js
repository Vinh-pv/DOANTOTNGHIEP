const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const roomRoute = require("./routes/rooms");
const registrationRoute = require("./routes/registrations");
const utilityBillRoute = require("./routes/utilityBills");
const contactRoute = require("./routes/contacts");
const cors = require("cors");

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/registrations", registrationRoute);
app.use("/api/utilitybills", utilityBillRoute);
app.use("/api/contacts", contactRoute);
app.use("/api/rooms", roomRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Backend is running.");
});
