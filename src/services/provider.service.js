const { Provider } = require('../models')

class ProviderService {
  constructor (roleService) {
    this.roleService = roleService
  }

  async list (limit, offset) {
    const [total, providers] = await Promise.all([
      Provider.countDocuments({ status: true }),
      Provider.find()
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('role')
    ])
    return { total, providers }
  }

  async findOne (id) {
    const provider = await Provider.findById(id).populate('role')
    if (!provider) {
      throw new Error(`Provider ${id} not found`)
    }
    return { provider }
  }

  async findOneByEmail (email) {
    return await Provider.findOne({ email }).populate('role')
  }

  async create (data) {
    let role = ''
    if (data.role) {
      role = await this.roleService.findByName(data.role)
    } else {
      role = await this.roleService.findByName('PROVIDER_ROLE')
    }
    if (data.email) {
      const provider = await Provider.findOne({ email: data.email })
      if (provider) { throw new Error(`Email ${data.email} already exists`) }
    }
    const provider = new Provider({ ...data, role })
    await provider.save()
    // const token = await generateJwt({ uuid: provider.id, name: provider.name })
    return {
      //   token,
      provider
    }
  }

  async update (id, data) {
    if (data.email) {
      const emailInUse = await Provider.findOne({ email: data.email })
      if (emailInUse) { throw new Error(`Email ${data.email} already exists`) }
    }
    const provider = await Provider.findByIdAndUpdate(id, data, {
      new: true
    }).populate('role')
    return { provider }
  }

  async delete (id) {
    const provider = await Provider.findByIdAndUpdate(
      id,
      { status: false },
      { new: true }
    )
    return { provider }
  }
}

module.exports = { ProviderService }
