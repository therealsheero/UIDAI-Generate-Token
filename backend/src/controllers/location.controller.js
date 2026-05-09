const { distanceMeters } = require("../utils/geofence");
const {
  OFFICE_LAT,
  OFFICE_LON,
  GEOFENCE_RADIUS
} = require("../utils/constants");

exports.checkLocation = (req, res) => {
  const { latitude, longitude } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({
      message: "Latitude and longitude required"
    });
  }

  const distance = distanceMeters(
    OFFICE_LAT,
    OFFICE_LON,
    latitude,
    longitude
  );

  const distanceKm = Math.round((distance / 1000) * 100) / 100;

//  if (distance <= GEOFENCE_RADIUS) {
//    return res.json({
//      mode: "WALKIN",
//      distance_meters: Math.round(distance),
//      distance_km: distanceKm
//    });
//  }

  return res.json({
//    mode: "APPOINTMENT",
    distance_meters: Math.round(distance),
    distance_km: distanceKm
  });
};
