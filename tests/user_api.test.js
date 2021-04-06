const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./user_test_helper')
let token = null

const api = supertest(app)

describe('when there is only one user in the db', () => {
  beforeEach(async () => {
    // Clear the databse
    await User.deleteMany({})
    const user = helper.initialUsers[0]
    const passwordHash = await bcrypt.hash(user.password, 10)
    const newUser = new User({ username: user.username, passwordHash })

    await newUser.save()

    console.log('Databse Initialised')
  })

  test.only('users are returned as a json with length 1', async () => {
    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    
    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(helper.initialUsers.length)
  })

  test('a valid user can be created successfully', async () => {
    const newUser = {
      name: 'Isaac',
      username: 'jumbo',
      password: 'workinprogress'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const res = await api.get('/api/users')
    expect(res.body).toHaveLength(helper.initialUsers.length + 1)

    const usernames = res.body.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('same username will be rejected', async () => {
    const newUser = {
      username: helper.initialUsers[0].username,
      password: 'workinprogress'
    }

    await api.post('/api/users').send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const res = await api.post('/api/users').send(newUser)
    expect(res.error).toBeDefined()


    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)

  })

  test('invalid username will be rejected', async () => {
    const newUser = {
      username: 'he',
      password: 'workinprogress'
    }

    await api.post('/api/users').send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    
    const res = await api.post('/api/users').send(newUser)
    expect(res.error).toBeDefined()


    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)

  })

  test('invalid password will be rejected', async () => {
    const newUser = {
      username: 'root',
      password: 'wo'
    }

    await api.post('/api/users').send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const res = await api.post('/api/users').send(newUser)
    expect(res.error).toBeDefined()

    const users = await api.get('/api/users')
    expect(users.body).toHaveLength(helper.initialUsers.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})