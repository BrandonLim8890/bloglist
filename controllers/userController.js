const userRouter = require('express').Router()
const User = require('../models/user')
require('express-async-errors')
const bcrypt = require('bcrypt')

userRouter.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}).populate('blogs', { url: 1, author: 1, title: 1 })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

userRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const saltRounds = 10

    if (body.password.length < 3) {
      res.status(400).send({ error: 'password too short' })
    }

    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const newUser = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await newUser.save()
    res.status(201).json(savedUser)
  } catch(err) {
    next(err)
  }
})


module.exports = userRouter