const dotenv = require('dotenv')
dotenv.config()
const Server = require('./src/server/config')
const { dbConnection } = require('./src/database/connection')

const start = async () => {
  try {
    const server = new Server()
    const app = await server.app
    await dbConnection()
    app.listen(server.port, () => {
      console.log('Server started on port', server.port)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
