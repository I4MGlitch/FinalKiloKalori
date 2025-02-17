const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({    
    username: { type: String },
    password: { type: String },
    role: { type: String },     
});

module.exports = mongoose.model('admins', adminSchema);