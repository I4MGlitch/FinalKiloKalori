const mongoose = require('mongoose');

const wholecakeSchema = mongoose.Schema({
    flavor: { type: String, required: true },
    price: { type: String, required: true },
    size: { type: String, required: true }, 
    category: { type: String, required: true },    
  });
  
  module.exports = mongoose.model("wholecake", wholecakeSchema);