
class ProviderController {
  constructor (providerService) {
    this.providerService = providerService
  }

  async getProviders (req, res, next) {
    try {
      const { limit = 10, offset = 0 } = req.query
      const rta = await this.providerService.list(limit, offset)
      res.status(200).json({ ok: true, message: 'Providers listed', ...rta })
    } catch (error) {
      next(error)
    }
  }

  async getProvider (req, res, next) {
    try {
      const id = req.params.id
      const rta = await this.providerService.findOne(id)
      res.status(200).json({
        ok: true,
        message: 'Provider listed',
        ...rta
      })
    } catch (error) {
      next(error)
    }
  }

  async createProvider (req, res, next) {
    try {
      const { name, email, role, image, address } = req.body
      const rta = await this.providerService.create({
        name,
        email,
        address,
        role,
        image
      })
      res.status(200).json({
        ok: true,
        message: 'Provider created',
        ...rta
      })
    } catch (error) {
      next(error)
    }
  }

  async updateProvider (req, res, next) {
    try {
      const id = req.params.id
      const { _id, email, ...rest } = req.body
      const rta = await this.providerService.update(id, rest)
      res.status(200).json({
        ok: true,
        message: 'Provider updated',
        ...rta
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteProvider (req, res, next) {
    try {
      const { id } = req.params
      const provider = await this.providerService.delete(id)
      res.status(200).json({ provider })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = { ProviderController }
