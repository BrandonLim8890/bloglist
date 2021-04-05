const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_test_helper')

const api = supertest(app)

// Before each test, this method will run and reset the database
beforeEach(async () => {
  // Clears the database
  await Blog.deleteMany({})

  const user = await User.findOne({})
  // Create an array of promises
  const blogObjects = helper.initialBlogs.map( blog => new Blog({ ...blog, user: user.id }) )
  const promiseBlogs = blogObjects.map( blog => blog.save() )

  // Oneshot, ensures all the blogs are saved
  await Promise.all(promiseBlogs)

  console.log('Database Initialised')
})


test.only('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  console.log( await api.get('/api/blogs') )
})

test('there are two blogs', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body).toHaveLength(2)
})

test('.id value is defined in a blog', async () => {
  const res = await api.get('/api/blogs')
  expect(res.body[0].id).toBeDefined()
})

test('a valid blog can be added', async () => {

  await api.post('/api/blogs')
    .send(helper.newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')
  const titles = res.body.map(blog => blog.title)

  expect(titles).toHaveLength(3)
  expect(titles).toContain('CSGO vs Valorant')
})

test('if likes is undefined, the blog default value is 0', async () => {
  // eslint-disable-next-line no-unused-vars
  const {likes, ...newBlog} = helper.newBlog

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const res = await api.get('/api/blogs')
  const likeArray = res.body.map(blog => blog.likes)
  expect(likeArray).toHaveLength(3)
  expect(likeArray).toContain(0)
})

test('returns 400 Bad Request when an invalid blog is added', async () => {
  // eslint-disable-next-line no-unused-vars
  const {title, author, ...newBlog} = helper.newBlog

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const res = await api.post('/api/blogs').send(newBlog)
  expect(res.error).toBeDefined()
})

test('successfully deletes the first blog', async () => {
  const blogObject = await Blog.find({author: 'Dondon'})
  
  await api.delete(`/api/blogs/${blogObject[0].id}`)
    .expect(204)

  const res = await api.get('/api/blogs')
  const titleArray = res.body.map(blog => blog.title)
  expect(titleArray).toHaveLength(1)
  expect(titleArray).not.toContain('How to blog')
})

test('successfully updates the first blog', async () => {
  const blogObject = await Blog.find({author: 'Dondon'})

  const newBlogObject = {
    title: 'This has been changed',
    author: blogObject[0].author,
    url: blogObject[0].url,
    likes: blogObject[0].likes
  }
  
  await api.put(`/api/blogs/${blogObject[0].id}`)
    .send(newBlogObject)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    
  const res = await api.get('/api/blogs')
  const titleArray = res.body.map(blog => blog.title)
  expect(titleArray).toHaveLength(2)
  expect(titleArray).toContain('This has been changed')
})

afterAll(() => {
  mongoose.connection.close()
})