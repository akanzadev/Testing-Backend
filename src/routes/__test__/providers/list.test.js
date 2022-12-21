const request = require('supertest')

const dotenv = require('dotenv')
dotenv.config()

const Server = require('../../../server/config')
const { signIn } = require('../../../../test/setup')
const server = new Server()
const app = server.app

describe('TEST LIST PROVIDER SERVICE', () => {
  it('List providers when none have been created // CP-04', async () => {
    const res = await request(app).get('/api/providers').expect(200)

    expect(res.body.providers).not.toBeUndefined()
    expect(res.body.providers).toHaveLength(0)
    expect(res.body.total).not.toBeUndefined()
    expect(res.body.total).toBe(0)
    expect(res.body.ok).toBe(true)
  })

  it('List providers using query parameters // CP-05', async () => {
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
    const res = await request(app)
      .get('/api/providers' + '?limit=' + limit + '&offset=' + offset)
      .expect(200)

    expect(res.body.providers).not.toBeUndefined()
    expect(res.body.providers).toHaveLength(limit)
    expect(res.body.total).not.toBeUndefined()
    expect(res.body.ok).toBe(true)
  })

  it('List providers without using query parameters // CP-06', async () => {
    const res = await request(app).get('/api/providers').expect(200)

    expect(res.body.total).not.toBeUndefined()
    expect(res.body.providers).not.toBeUndefined()
    expect(res.body.ok).toBe(true)
  })
})
