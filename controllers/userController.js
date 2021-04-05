const userRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await User.find({})
    res.json(blogs)
  } catch (err) {
    next(err)
  }
})

userRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const newUser = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })
    const savedUser = await newUser.save()
    res.json(savedUser)
  } catch(err) {
    next(err)
  }
})

module.exports = userRouter