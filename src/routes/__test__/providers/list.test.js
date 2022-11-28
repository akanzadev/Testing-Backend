const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../../../server/config')
const { signIn } = require('../../../../test/setup')
const server = new Server()
const app = server.app

describe('CP-09', () => {
  it('List Providers', async () => {
    const res = await request(app).get('/api/providers').expect(200)

    expect(res.body.total).not.toBeUndefined()
    expect(res.body.providers).not.toBeUndefined()
    expect(res.body.ok).toBe(true)
  })

  it('List providers using query parameters', async () => {
    const { jwt } = await signIn()

    for (let i = 0; i < 3; i++) {
      await request(app)
        .post('/api/providers')
        .set('x-token', jwt)
        .send({
          name: 'test' + i,
          email: 'test' + i + '@gmail.com',
          address: 'Av Siempre Viva Test ' + i,
          image: 'test' + i + '.com',
          phone: '98765432' + i
        })
        .expect(200)
    }

    const limit = 2
    const offset = 0
    const res = await request(app).get('/api/providers' + '?limit=' + limit + '&offset=' + offset).expect(200)

    expect(res.body.providers).not.toBeUndefined()
    expect(res.body.providers).toHaveLength(limit)
    expect(res.body.total).not.toBeUndefined()
    expect(res.body.ok).toBe(true)
  })

  it('List providers when none have been created', async () => {
    const res = await request(app).get('/api/providers').expect(200)

    expect(res.body.providers).not.toBeUndefined()
    expect(res.body.providers).toHaveLength(0)
    expect(res.body.total).not.toBeUndefined()
    expect(res.body.total).toBe(0)
    expect(res.body.ok).toBe(true)
  })
})
