const blogRouter = require('express').Router()
const Blog = require('../models/blog')
require('express-async-errors')
const middleware = require('../utils/middleware')

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

blogRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  try {
    const body = req.body
    const user = req.user
    if (!user) {
      return res.status(401).json({ error: 'user invalid or missing' })
    }

    const newBlog = new Blog({
      ...body, user: user.id
    })

    const savedBlog = await newBlog.save()

    await user.save()
    res.status(201).json(savedBlog)
  } catch (err) {
    next(err)
  }
})

blogRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const user = req.user

    if (!user) {
      res.status(401).json({ error: 'user invalid or missing' })
    }

    const blog  = await Blog.findById(req.params.id)
    if (blog.user.toString() !== user.id.toString()) {
      res.status(401).json({ error: 'user does not have access to this resource' })
    }
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