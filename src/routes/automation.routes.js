const { Router } = require('express')
const { launchTest } = require('../helpers/automation-puppeter')
const router = Router()

router.get('/test', async (req, res, next) => {
  try {
    await launchTest({ clientUrl: process.env.CLIENT_URL })

    res.status(200).json({
      ok: true,
      msg: 'Test'
    })
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: 'Error inesperado'
    })
  }
})

module.exports = router
