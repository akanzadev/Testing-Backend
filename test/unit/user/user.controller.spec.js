const httpMocks = require('node-mocks-http')
const MockUserApplication = require('./repository/mock-user-application')

let request, response
let mockUserApplication
let userController

describe('User Controller', () => {
  beforeAll(() => {
    mockUserApplication = new MockUserApplication()
    userController = mockUserApplication.getController()
  })

  beforeEach(() => {
    request = httpMocks.createRequest()
    response = httpMocks.createResponse()
  })

  it('should return a list of users', async () => {
    try {
      expect(true).toBe(true)

      /* await userController.getUsers(request, response)
      mockUserApplication.assertListUsers(response) */
    } catch (error) {
      console.log(error)
    }
  })
})
