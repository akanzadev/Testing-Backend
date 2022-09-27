
const mockListUsersResponse = require('../mocks/list-users-response.json')
const { UserController } = require('../../../../src/controllers/user')
let { UserService } = require('../../../../src/services/user.service')

class MockUserApplication {
  constructor () {
    UserService = jest.fn().mockReturnValue({
      list: jest.fn().mockResolvedValue(mockListUsersResponse)
    })
  }

  assertListUsers (res) {
    const result = res._getJSONData()
    expect(res.statusCode).toBe(200)
    expect(result).toEqual(mockListUsersResponse)
  }

  getController () {
    const userService = new UserService()
    return new UserController(userService)
  }
}

module.exports = MockUserApplication
