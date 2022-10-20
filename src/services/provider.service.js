const { Provider } = require('../models')
const { generateJwt } = require('../helpers')

class ProviderService {
  constructor (roleService) {
    this.roleService = roleService
  }

  async list (limit, offset) {
    const [total, providers] = await Promise.all([
      Provider.countDocuments({ status: true }),
      Provider.find({ status: true })
        .skip(Number(offset))
        .limit(Number(limit))
        .populate('role')
    ])
    return { total, providers }
  }

  async findOne (id) {
    const provider = await Provider.findById(id).populate('role')
    if (!provider) { throw new Error(`Provider ${id} not found`) }
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
    const provider = new Provider({ ...data, role })
    await provider.save()
    // const token = await generateJwt({ uuid: provider.id, name: provider.name })
    return {
    //   token,
      provider
    }
  }

  async update (id, data) {
    const provider = await Provider.findByIdAndUpdate(id, data, { new: true }).populate(
      'role'
    )
    return { provider }
  }

  async delete (id) {
    return await Provider.findByIdAndUpdate(id, { status: false }, { new: true })
  }
}

module.exports = { ProviderService }
