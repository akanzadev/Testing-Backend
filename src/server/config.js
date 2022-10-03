const express = require('express')
const cors = require('cors')
const http = require('http')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')

const { dbConnection } = require('../database/connection.js')
const { errorHandler, expressValErrors } = require('../middlewares')

class Server {
  constructor () {
    this.app = express()
    this.port = process.env.PORT || 3000
    this.httpServer = http.createServer(this.app)

    this.paths = {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      /* buscar: '/api/buscar',
      uploads: '/api/uploads', */
      roles: '/api/roles',
      brands: '/api/brands'
    }
    this.conectarBD()

    this.middlewares()

    this.mountRoutes()

    this.errorHandler()
  }

  async conectarBD () {
    await dbConnection()
  }

  middlewares () {
    this.app.use(cors())

    this.app.use(express.json())
    this.app.use(express.static('public'))
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true
      })
    )
    this.app.use(morgan('dev'))
  }

  mountRoutes () {
    this.app.use(this.paths.users, require('../routes/user.routes'))
    this.app.use(this.paths.brands, require('../routes/brand.routes'))
    this.app.use(this.paths.categories, require('../routes/category.routes'))
    this.app.use(this.paths.roles, require('../routes/role.routes'))
    this.app.use(this.paths.products, require('../routes/product.routes'))
    this.app.use(this.paths.auth, require('../routes/auth.routes'))
    /* this.app.use(this.paths.buscar, require('../routes/buscar.js'))
    this.app.use(this.paths.uploads, require('../routes/uploads.js')) */
  }

  errorHandler () {
    this.app.use(expressValErrors)
    this.app.use(errorHandler)
  }

  listen () {
    this.app.listen(this.port, () => {
      console.log('Running in port', this.port)
    })
  }
}

module.exports = Server
