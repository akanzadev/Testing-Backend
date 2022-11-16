const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../../../server/config')
const { signIn } = require('../../../../test/setup')
const server = new Server()
const app = server.app

describe('Providers Routes For Updated', () => {
  it('Updated Provider', async () => {
    try {
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
    } catch (error) {
      console.log(error)
    }
  })

  it('Updated Provider 2', async () => {
    try {
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
    } catch (error) {
      console.log(error)
    }
  })
})
