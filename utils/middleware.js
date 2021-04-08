const logger = require('./logger')
const config = require('./config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  logger.info(`Method: ${req.method}`)
  logger.info(`Path: ${req.path}`)
  logger.info(`Body: ${req.body}`)
  logger.info('---')
  next()  
}

const unknownEndPoint = (req, res) => {
  res.status(404).send({ error: 'unkown endpoint' })
}

const errorHandler = (err, req, res, next) => {
  logger.error(err)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  } else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'token expired' })
  }
  next(err)
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  const token = (authorization && authorization.toLowerCase().startsWith('bearer'))
    ? authorization.split(' ')[1]
    : null

  req.token = token
  next()
}

const userExtractor = async (req, res, next) => {
  try {
    const token = req.token
    const decodedToken = jwt.verify(token, config.SECRET)
    
    req.user = await User.findById(decodedToken.id)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  requestLogger,
  unknownEndPoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
}

