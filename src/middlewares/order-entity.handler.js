
const OrderItem = require('../models/order-item.entity')

const createOrderItem = async (req, res, next) => {
  try {
    const { products } = req.body

    await Promise.all(
      products.map(async (product) => {
        const orderItem = new OrderItem({
          quantity: product.quantity,
          product: product._id
        })
        await orderItem.save()
      })
    )

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = { createOrderItem }
