
const userController = require('../../../../src/controllers/usuarios')
const mockListUsersResponse = require('../mocks/list-users-response.json')

class MockUserApplication {
  assertListUsers (res) {
    const result = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(result).toEqual(mockListUsersResponse)
  }

  assertListOne (res) {
    const result = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(result).toHaveProperty('guid')
    expect(result).toHaveProperty('name')
    expect(result).toHaveProperty('lastname')
  }

  getController () {
    return userController
  }
}

module.exports = MockUserApplication
