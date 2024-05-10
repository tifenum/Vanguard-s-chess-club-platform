// routes/playwithfriendsRoutes.js
const express = require("express");
const router = express.Router();
const playwithfriendsController = require("./playwithfriendsController");
const authenticateToken = require("../authenticateToken");
const Invitation = require("../models/Invitation");

// Routes pour envoyer, accepter et refuser les invitations
router.post(
  "/invite",
  authenticateToken,
  playwithfriendsController.sendInvitation
);
router.post("/accept", playwithfriendsController.acceptInvitation);
router.post(
  "/decline",
  
  playwithfriendsController.declineInvitation
);
router.get("/invitations/:to", async (req, res) => {
  try {
    const { to } = req.params;
    const invitations = await Invitation.find({ to: to, status: "pending" });

    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/invitationsByid/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    const invitations = await Invitation.find({ _id: _id,});

    res.status(200).json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
