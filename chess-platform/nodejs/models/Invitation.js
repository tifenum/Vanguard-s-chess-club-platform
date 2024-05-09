// Invitation.js
const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: {
    type: String
},
lastname: {
  type: String
},
  status: { type: String, enum: ['pending', 'accepted', 'declined'] }
});

module.exports = mongoose.model('Invitation', invitationSchema);
