const Koa = require('koa') // koa
const koaCors = require('koa2-cors') // 跨域
const body = require('koa-body') // json 解析和文件解析
const Router = require('koa-router') // router
const koaJwt = require('koa-jwt') // koa-jwt 用于校验token 等
const config = require('./config/secret')
const loginRouter = require('./login/index') // 登录相关的页面的路由
const SECRET = config.SECRET
const app = new Koa()
const router = new Router()
app.use(koaCors())
app.use(body())

//401 用户没有权限，需要登录
app.use(function(ctx, next){
    return next().catch((err) => {
        if (err.status == 401) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
});

//校验JWT  token 是否过期
app.use(koaJwt({secret:SECRET}).unless({
    path:['/login',"/register","/register/sendValidCode"]
}))

router.use(loginRouter.routes(),loginRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())
app.listen(8080,()=>{console.log('API is running on http://localhost:8080/login')})

