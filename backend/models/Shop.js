const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }, // e.g., "Hostel Block A", "Library"
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  queueSize: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  printingRate: { type: Number, default: 2.0 }, // Cost per page
  socketId: { type: String } // To map socket connection to shop
});

module.exports = mongoose.model('Shop', shopSchema);
