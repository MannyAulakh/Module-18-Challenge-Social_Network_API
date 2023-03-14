const { User, Thought } = require('../models');



module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => {
        res.json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Get a single User
  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId})
      .select('-__v')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Create a new User
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a User and associated Thoughts
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No such user exists' })
          : Thought.deleteMany({ _id: {$in: user.thoughts}})
      )
      .then(() => res.json({message: 'User & Thoughts are deleted'}))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Update user
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { username: req.body.username, email: req.body.email },
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Add Friend
  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $push: {friends: req.params.friendId} },
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  //Delete Friend
  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: {friends: req.params.friendId} },
    )
      .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user found with that ID :(' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
