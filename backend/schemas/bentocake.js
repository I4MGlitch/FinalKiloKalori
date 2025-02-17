const mongoose = require('mongoose');

const bentocakeSchema = mongoose.Schema({
    flavor: { type: String, required: true },
    price: { type: String, required: true },
    size: { type: String, required: true }, 
    category: { type: String, required: true },    
  });
  
  module.exports = mongoose.model("bentocake", bentocakeSchema);