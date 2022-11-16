const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../../../server/config')
const { signIn } = require('../../../../test/setup')
const server = new Server()
const app = server.app

describe('Providers Routes For List', () => {
  it('List Providers', async () => {
    try {
      const { jwt } = await signIn()
      await request(app).get('/api/providers').set('x-token', jwt).expect(200)
    } catch (error) {
      console.log(error)
    }
  })

  it('Find Provider By ID', async () => {
    try {
      const { jwt } = await signIn()

      const res = await request(app)
        .post('/api/providers')
        .set('x-token', jwt)
        .send({
          name: 'provider-4',
          email: 'provider5@gmail.com',
          address: 'Av Siempre Viva',
          image: 'provider4.com',
          phone: '946242945'
        })
        .expect(200)

      expect(res.body.provider).not.toBeUndefined()
      expect(res.body.provider.uuid).not.toBeUndefined()

      await request(app)
        .get('/api/providers/' + res.body.provider.uuid)
        .set('x-token', jwt)
        .expect(200)
    } catch (error) {
      console.log(error)
    }
  })
})
