const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')
const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../src/server/config')
const server = new Server()

let mongo = ''

beforeAll(async () => {
  process.env.SECRETKEY = 'romelin.py'
  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()
  for (const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  if (mongo) await mongo.stop()
  await mongoose.connection.close()
})

const signIn = async () => {
  await request(server.app)
    .post('/api/roles')
    .send({
      name: 'PROVIDER_ROLE',
      description: 'ROLE FROM PROVIDER'

    })
    .expect(200)

  await request(server.app)
    .post('/api/roles')
    .send({
      name: 'USER_ROLE',
      description: 'ROLE FROM USER'

    })
    .expect(200)

  await request(server.app)
    .post('/api/roles')
    .send({
      name: 'ADMIN_ROLE',
      description: 'ROLE FROM ADMIN'

    })
    .expect(200)

  await request(server.app)
    .post('/api/users')
    .send({
      name: 'test-demo',
      email: 'test-demo@gmail.com',
      password: 'test-demo',
      image: 'test-demo.jpg',
      phone: '946242945'
    })
    .expect(200)

  const res = await request(server.app)
    .post('/api/auth/login')
    .send({
      email: 'test-demo@gmail.com',
      password: 'test-demo'
    })
    .expect(200)

  expect(res.body.token).not.toBeUndefined()
  expect(res.body.user).not.toBeUndefined()

  const { user, token: jwt } = res.body
  return { user, jwt }
}

module.exports = { signIn }
