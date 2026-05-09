const express = require("express");
// require("./models/init");

const cors = require("cors");

const bookingRoutes = require("./routes/booking.routes");
const availabilityRoutes = require("./routes/availability.routes");
const locationRoutes = require("./routes/location.routes");
const adminRoutes = require("./routes/admin.routes");
const app = express();

app.use(cors());
app.use(express.json()); 
app.use("/api/guard", require("./routes/guard.routes"));
app.use("/api/admin", adminRoutes);
app.use("/api", locationRoutes);
app.get("/", (req, res) => {
  res.send("Appointment Token System API is running");
});
// app.use("/api/otp", require("./routes/otp.routes"));
app.use("/api", bookingRoutes);
app.use("/api", availabilityRoutes);


module.exports = app;
