const allowedOrgins = require("./allowedOrgins");

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrgins.indexOf(origin) !== -1 || !origin) {
      // ------------------ If suscfull
      callback(null, true);
    } else {
      // ------------------ Not suscfull
      callback(new Error("Not allowed by Cors"));
    }
  },

  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
