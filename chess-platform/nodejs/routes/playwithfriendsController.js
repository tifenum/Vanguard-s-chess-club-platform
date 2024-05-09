// invitationController.js

const Invitation = require('../models/Invitation');
const User = require('../models/user');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

exports.sendInvitation = async (req, res) => {
    try {
      const { to } = req.body;
      const from = req.user._id; // Utilisateur envoyant l'invitation
      const user = await User.findById(from);

      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
      }

      const name = user.name;
      const lastname=user.lastname;
      const invitation = await Invitation.create({ from, name,lastname, to, status: 'pending' });
      io.emit('invitation', { type: 'new', data: invitation });
      // Envoyer une notification WebSocket à tous les utilisateurs connectés
   

      res.status(201).json({ status: 'success', data: invitation });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.acceptInvitation = async (req, res) => {
    try {
      const invitationId = req.body.invitationId;
      const invitation = await Invitation.findById(invitationId);
  
      if (!invitation || invitation.status !== 'pending') {
        return res.status(400).json({ status: 'error', message: 'Invalid invitation ID or already accepted/declined' });
      }
  
      invitation.status = 'accepted';
      await invitation.save();

      // Envoyer une notification WebSocket à tous les utilisateurs connectés
      io.emit('invitation', { type: 'accepted', data: invitation });

      res.status(200).json({ status: 'success', message: 'Invitation accepted' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
};

exports.declineInvitation = async (req, res) => {
    try {
      const invitationId = req.body.invitationId;
      const invitation = await Invitation.findById(invitationId);
  
      if (!invitation || invitation.status !== 'pending') {
        return res.status(400).json({ status: 'error', message: 'Invalid invitation ID or already accepted/declined' });
      }
  
      invitation.status = 'declined';
      await invitation.save();
  
      res.status(200).json({ status: 'success', message: 'Invitation declined' });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
};
