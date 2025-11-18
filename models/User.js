const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Identificador único
  cargo: String,
  password: { type: String, required: true }, 
  criadoEm: { type: Date, default: Date.now }
});
module.exports = mongoose.model('User', userSchema);