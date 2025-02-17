const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },    
  });
  
  module.exports = mongoose.model("image", imageSchema);