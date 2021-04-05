const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  passwordHash: String,
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    // Hide passwordHash from the JSON Object
    delete returnedObject.passwordHash
  },
  virtuals: true
})

module.exports = mongoose.model('User', userSchema)