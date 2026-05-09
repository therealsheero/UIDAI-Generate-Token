module.exports = (req, res, next) => {
  const now = new Date();
  const istTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

//  const hours = istTime.getHours();
//  const minutes = istTime.getMinutes();
//
//  const currentMinutes = hours * 60 + minutes;
//
//  const start = 6 * 60; 
//  const end = 16 * 60; 
//
//  if (currentMinutes < start || currentMinutes > end) {
//    return res.status(403).json({
//      message: "Booking allowed only between 6:00 AM and 4:00 PM/ बुकिंग केवल सुबह 6:00 बजे से शाम 4:00 बजे के बीच ही की जा सकती है।"
//     });
//  }

  next();
};
