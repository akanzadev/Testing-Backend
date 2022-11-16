const { Order, OrderItem } = require('../models')

class OrderService {
  constructor (userService, providerService, productService) {
    this.userService = userService
    this.providerService = providerService
    this.productService = productService
  }

  async list (limit, offset) {
    const [total, orders] = await Promise.all([
      Order.countDocuments({ status: true }),
      Order.find({ status: true })
        .populate('items')
        .skip(Number(offset))
        .limit(Number(limit))
    ])
    return { total, orders }
  }

  async findOne (id) {
    const order = await Order.findOne({ _id: id, status: true })
      .populate('user')
      .populate('provider')
      .populate('items')
    if (!order) throw new Error('Order not found')
    return { order }
  }

  async findForUser (id) {
    const [total, orders] = await Promise.all([
      Order.countDocuments({ user: id, status: true }),
      Order.find({ user: id, status: true })
        .populate('user')
        .populate('provider')
        .populate('items')
    ])
    return { total, orders }
  }

  async findForProvider (id) {
    const [total, orders] = await Promise.all([
      Order.countDocuments({ user: id, status: true }),
      Order.find({ provider: id, status: true })
        .populate('user')
        .populate('provider')
        .populate('items')
    ])
    return { total, orders }
  }

  async create (data) {
    await this.userService.findOne(data.user)
    await this.providerService.findOne(data.provider)
    await this.productService.validateProducts(data.items)

    const orderItems = await OrderItem.insertMany(data.items)
    const order = new Order({
      user: data.user,
      provider: data.provider,
      items: orderItems.map(orderItem => orderItem._id)
    })
    return { order }
  }

  async update (id, data) {
    if (data.user) await this.userService.findOne(data.user)
    if (data.provider) await this.providerService.findOne(data.provider)
    if (data.items.length > 0) {
      await this.productService.validateProducts(data.items)
    }
    const order = await Order.findByIdAndUpdate(
      id,
      { ...data },
      { new: true }
    )
    return { order }
  }

  async delete (id) {
    /* const order = await Order.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )
    return { order } */
    // delete to db
    const order = await Order.findByIdAndDelete(id)
    return { order }
  }
}

module.exports = { OrderService }
