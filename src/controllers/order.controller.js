class OrderController {
  constructor (orderService) {
    this.orderService = orderService
  }

  async getOrders (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const rta = await this.orderService.list(limit, offset)
      res.status(200).json({ ok: true, message: 'Orders listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async getOrder (req, res, next) {
    try {
      const id = req.params.id
      const product = await this.orderService.findOne(id)
      res.status(200).json({ ok: true, message: 'Order listed', ...product })
    } catch (error) {
      next(error)
    }
  }

  async getOrdersByProvider (req, res, next) {
    try {
      const id = req.params.id
      const rta = await this.orderService.findForProvider(id)
      res.status(200).json({ ok: true, message: 'Orders listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async getOrdersByUser (req, res, next) {
    try {
      const id = req.params.id
      const rta = await this.orderService.findForUser(id)
      res.status(200).json({ ok: true, message: 'Orders listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async createOrder (req, res, next) {
    try {
      const { items, provider } = req.body
      const { _id: user } = req.user
      const rta = await this.orderService.create({
        user,
        items,
        provider
      })
      res.status(200).json({ ok: true, message: 'Order created', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async updateOrder (req, res, next) {
    try {
      const id = req.params.id
      const data = req.body
      const rta = await this.orderService.update(id, data)
      res.status(200).json({ ok: true, message: 'Order updated', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async deleteOrder (req, res, next) {
    try {
      const { id } = req.params
      const rta = await this.orderService.delete(id)
      res.status(200).json({ ok: true, message: 'Order deleted', ...rta })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { OrderController }
