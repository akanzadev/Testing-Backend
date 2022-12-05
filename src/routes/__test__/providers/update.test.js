const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../../../server/config')
const { signIn } = require('../../../../test/setup')
const server = new Server()
const app = server.app

describe('CP-13', () => {
  it('Update provider with all required features', async () => {
    const { jwt } = await signIn()

    const firstRes = await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        name: 'test1',
        email: 'test1@gmail.com',
        address: 'Av Siempre Viva Test 1',
        image: 'test1.com',
        phone: '987654321'
      })
      .expect(200)

    expect(firstRes.body.provider).not.toBeUndefined()
    expect(firstRes.body.provider.uuid).not.toBeUndefined()

    const secondRes = await request(app)
      .put('/api/providers/' + firstRes.body.provider.uuid)
      .set('x-token', jwt)
      .send({
        name: 'test2',
        address: 'Av Siempre Viva Test 2',
        image: 'test2.com',
        phone: '987654322'
      })
      .expect(200)

    expect(firstRes.body.provider.uuid).toBe(secondRes.body.provider.uuid)
  })

  it('Updated provider skipping some required features', async () => {
    const { jwt } = await signIn()

    const firstRes = await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        name: 'test3',
        email: 'test3@gmail.com',
        address: 'Av Siempre Viva Test 3',
        image: 'test3.com',
        phone: '987654321'
      })
      .expect(200)

    expect(firstRes.body.provider).not.toBeUndefined()
    expect(firstRes.body.provider.uuid).not.toBeUndefined()

    const secondRes = await request(app)
      .put('/api/providers/' + firstRes.body.provider.uuid)
      .set('x-token', jwt)
      .send({
        name: 'test4'
      })
      .expect(200)

    expect(firstRes.body.provider.uuid).toBe(secondRes.body.provider.uuid)
  })

  it('Update provider with unique features already in use', async () => {
    const { jwt } = await signIn()

    const firstRes = await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        name: 'test5',
        email: 'test5@gmail.com',
        address: 'Av Siempre Viva Test 5',
        image: 'test5.com',
        phone: '987654321'
      })
      .expect(200)

    await request(app)
      .post('/api/providers')
      .set('x-token', jwt)
      .send({
        name: 'test6',
        email: 'test6@gmail.com',
        address: 'Av Siempre Viva Test 6',
        image: 'test6.com',
        phone: '987654321'
      })
      .expect(200)

    const secondRes = await request(app)
      .put('/api/providers/' + firstRes.body.provider.uuid)
      .set('x-token', jwt)
      .send({
        email: 'test6@gmail.com'
      })
      .expect(500)

    expect(secondRes.body.ok).toBe(false)
    expect(secondRes.body.message).toBe('Email test6@gmail.com already exists')
  })
})
