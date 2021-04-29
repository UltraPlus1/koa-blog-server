/**
 * 登录模块
 */
const Router = require('koa-router') // router
const Jwtoken = require('jsonwebtoken') // 用于生成JWT Token
const login = new Router()
const config = require('../config/secret')
const SECRET = config.SECRET
const Options = config.Options

// 模拟从数据库拿数据
const fakeValid = {
    user: "Mason",
    password: "zhang123121@",
    userId:"213123"
}
// 模拟校验函数
const validUser = (username,password)=>{
    if(username === fakeValid.user && password === fakeValid.password){
        return true
    }else{
        return false
    }
}

// 登录接口
login.post('/login',async (ctx)=>{

    // 获取账号和密码
    const username = ctx.request.body?.username;
    const password = ctx.request.body?.password;

    if(validUser(username,password)){
        const Payload = {
            user:fakeValid.user,
            userId:fakeValid.userId
        }
        // 生成 Jwt
        const token = Jwtoken.sign(Payload,SECRET,Options)
        // 尝试 token
        console.log(token)
        // 将jwt Token 塞进 authorization 里面
        ctx.response.set('authorization','Bearer '+ token)
        ctx.body={
            message:"登录成功",
            status:200
        }
    }else{
        // ctx.throw(401)
        ctx.body={
            message:"认证失败，密码或用户名错误",
            status:401
        }
    }
})

exports =module.exports = login