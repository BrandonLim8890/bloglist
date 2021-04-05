const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: 3
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})


userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Hide passwordHash from the JSON Object
    delete returnedObject.passwordHash
  },
  virtuals: true
})


module.exports = mongoose.model('User', userSchema)