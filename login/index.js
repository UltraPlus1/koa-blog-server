const Router = require('koa-router') // router
const login = require('./login')
const register = require('./register')
const router = new Router()

router.use(login.routes(),login.allowedMethods())
router.use(register.routes(),register.allowedMethods())

exports = module.exports = router
