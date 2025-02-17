const mongoose = require('mongoose');

const websiteSchema = mongoose.Schema({
    aboutus: { type: String},
    whatsapp: { type: String},
    alamat: { type: String}, 
    linkmap: { type: String},
    facebook: { type: String},
    instagram: { type: String},
    tiktok: { type: String},    
  });
  
  module.exports = mongoose.model("website", websiteSchema);