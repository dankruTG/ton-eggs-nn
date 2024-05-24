const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  username: String,
  balance: Number,
  walletStatus: String,
  speedUpgradeLevel: Number,
  speedUpgradePrice: Number,
  energyUpgradeLevel: Number,
  energyUpgradePrice: Number,
  curenerg: Number,
  maxenerg: Number,
  inventoryItems: Array,
  currentEgg: Object,
});

module.exports = mongoose.model('User', userSchema);
