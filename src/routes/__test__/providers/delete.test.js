const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../../../server/config')
const { signIn } = require('../../../../test/setup')
const server = new Server()
const app = server.app

describe('CP-11', () => {
  it('Delete a provider using its id', async () => {
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
      .delete('/api/providers/' + firstRes.body.provider.uuid)
      .set('x-token', jwt)
      .expect(200)

    expect(secondRes.body.ok).toBe(true)
    expect(secondRes.body.provider.uuid).toBe(firstRes.body.provider.uuid)
  })

  it('Delete a provider using an invalid id', async () => {
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
      .delete('/api/providers/' + firstRes.body.provider.uuid + '1')
      .set('x-token', jwt)
      .expect(400)

    expect(secondRes.body.ok).toBe(false)
    expect(secondRes.body.message).not.toBeUndefined()
    expect(secondRes.body.message).not.toBe([])
  })

  it('Delete a provider without permissions required', async () => {
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
      .delete('/api/providers/' + firstRes.body.provider.uuid + '1')
      .set('x-token', '')
      .expect(500)

    expect(secondRes.body.ok).toBe(false)
    expect(secondRes.body.message).not.toBeUndefined()
    expect(secondRes.body.message).not.toBe([])
  })
})
