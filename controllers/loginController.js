const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    
    // Find user with the same username
    const user = await User.findOne({ username: body.username })
    // Compare the password entered tot he user's password
    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(body.password, user.passwordHash)

    // If either there is no user with username, or the password is wrong, send back an error
    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'invalid username or password'
      })
    }

    // If there is no error, create a user to eb signed by jwt
    const userForToken = {
      username: user.username,
      id: user.id
    }

    // JWT signs the user with the token
    const token = jwt.sign(userForToken, config.SECRET)

    // Send back the token, along with the information about the user.
    res.status(200).send({ token, username: user.username, name: user.name })
  } catch (err) {
    next(err)
  }
})

module.exports = loginRouter