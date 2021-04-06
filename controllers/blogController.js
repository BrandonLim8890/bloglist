const blogRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const User = require('../models/user')

blogRouter.get('/', async (req, res, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    res.json(blogs)
  } catch (err) {
    next(err)
  }
})

blogRouter.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('user', { username: 1, name: 1 })
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (err) {
    next(err)
  }
})

blogRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body
    const token = req.token
    const decodedToken = jwt.verify(token, config.SECRET)
    if (!token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    }
    const user = await User.findById(decodedToken.id)

    const newBlog = new Blog({
      ...body, user: decodedToken.id
    })

    const savedBlog = await newBlog.save()

    await user.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

blogRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

blogRouter.put('/:id', async (req, res, next) => {
  try {
    const body = req.body

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, body, { new: true })
    res.status(200).json(updatedBlog)
  } catch (err) {
    next(err)
  }
})


module.exports = blogRouter