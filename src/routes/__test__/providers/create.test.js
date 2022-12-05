const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../../../server/config')
const { signIn } = require('../../../../test/setup')
const server = new Server()
const app = server.app

describe('CP-11', () => {
  it('Create provider with all required features', async () => {
    const { jwt } = await signIn()

    const res = await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        name: 'tes-4',
        email: 'provider5@gmail.com',
        address: 'Av Siempre Viva',
        image: 'provider4.com',
        phone: '946242945'
      }).expect(200)

    expect(res.body.ok).toBe(true)
    expect(res.body.provider).not.toBeUndefined()
  })

  it('Create provider skipping some required features', async () => {
    const { jwt } = await signIn()

    const res = await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        address: 'Av Siempre Viva',
        image: 'provider4.com',
        phone: '946242945'
      }).expect(400)

    expect(res.body.ok).toBe(false)
    expect(res.body.message).not.toBeUndefined()
    expect(res.body.message).not.toBe([])
  })

  it('Create provider with unique features already in use', async () => {
    const { jwt } = await signIn()

    await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        name: 'test1',
        email: 'test1@gmail.com',
        address: 'Av Siempre Viva',
        image: 'provider4.com',
        phone: '946242945'
      }).expect(200)

    const res = await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        name: 'test1',
        email: 'test1@gmail.com',
        address: 'Av Siempre Viva',
        image: 'provider4.com',
        phone: '946242945'
      }).expect(500)

    expect(res.body.ok).toBe(false)
    expect(res.body.message).not.toBeUndefined()
    expect(res.body.message).not.toBe([])
  })
})
