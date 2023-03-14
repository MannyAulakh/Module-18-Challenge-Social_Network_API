const { User, Thought } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then((thought) => {
        res.json(thought);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Get a thought
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    Thought.create(req.body)
      .then((thought) => {
        User.findByIdAndUpdate(req.body.userId,
          { $addToSet: { thoughts: thought._id}},
          { new: true}
          ).then((user) => !user ? res.status(404).json({ message: 'No user with that ID' }) : res.json(user))
          .catch((err) => {
          console.log(err);
           return res.status(500).json(err);
      });
    })
  },

  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  deleteThought(req, res) {
    Thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No such thought exists' })
          : res.json(thought)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true}
    )
    .populate({path: 'reactions', select: '-__v'})
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: {_id: req.params.reactionId} } },
      { new: true}
    )
    .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  }
};
