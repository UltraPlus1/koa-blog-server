/**
 * 注册模块
 */
const Router = require('koa-router') // router
const Jwtoken = require('jsonwebtoken') // 用于生成JWT Token
const Mail = require('../mail/index') // 引入邮件模块
const register = new Router()
const config = require('../config/secret')
const Payload = {
    user:'Mason',
    userId:'12312'
}
const SECRET = config.SECRET
const Options = config.Options
// 注册接口
register.post('/register',async (ctx)=>{
    // 生成 Jwt
    const token = Jwtoken.sign(Payload,SECRET,Options)
    console.log(token)
    console.log("Register!!!!")
    ctx.response.body = "Register!!!"
})

exports =module.exports = register;