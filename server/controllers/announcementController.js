const { Announcement, Poll, Vote, User } = require('../models');

// Announcements
exports.createAnnouncement = async (req, res) => {
    try {
        const announcement = await Announcement.create(req.body);
        
        req.io.emit('newAnnouncement', announcement);
        
        res.status(201).json(announcement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.findAll({ order: [['createdAt', 'DESC']] });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Polls
exports.createPoll = async (req, res) => {
    try {
        const poll = await Poll.create(req.body);
        req.io.emit('newPoll', poll);
        res.status(201).json(poll);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPolls = async (req, res) => {
    try {
        const polls = await Poll.findAll({
            include: [{ model: Vote, as: 'votes' }],
            order: [['createdAt', 'DESC']]
        });
        res.json(polls);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.votePoll = async (req, res) => {
  try {
      const { id } = req.params;
      const { optionIndex } = req.body;
      
      const existingVote = await Vote.findOne({
          where: { pollId: id, residentId: req.user.id }
      });
      
      if (existingVote) return res.status(400).json({ message: 'Already voted' });
      
      const vote = await Vote.create({
          pollId: id,
          residentId: req.user.id,
          optionIndex
      });
      
      req.io.emit('newVote', { pollId: id, vote });
      
      res.status(201).json(vote);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
