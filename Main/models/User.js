const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trimmed: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      }
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      }
    ]
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Create virtual called 'friend count'
userSchema.virtual('friendCount').get(function(){ return this.friends.length})

// Create Model
const User = model('User', userSchema)

module.exports = User;
