/**
 * 注册模块
 */
const Router = require('koa-router') // router
const Jwtoken = require('jsonwebtoken') // 用于生成JWT Token
const Mail = require('../mail/index') // 引入邮件模块
const redis = require('redis') // 引入Redis
const random = require('string-random') // 生成随机位数的随机字符串
const register = new Router()
const config = require('../config/secret')

const redisClient =new redis.createClient()

redisClient.on("error", function(error) {
    console.error(error);
});
redisClient.on("ready",()=>{
    console.log("Redis ready!!")
})
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
}).post('/register/sendValidCode',async (ctx)=>{
    const email = ctx.request.body?.email;
    console.log(email)
    if(email){
        const validCode = random(6,{letters:false})
        const result =await Mail.sendMail(email,validCode)// 发送邮件并获得发送结果
        if(result === 'success'){
            redisClient.set(email,validCode)
            redisClient.expire(email,300)//验证码过期时间5分钟
        }else{
            console.log("Email error")
        }
    }
})

exports =module.exports = register;