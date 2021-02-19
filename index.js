const Koa = require('koa') // koa
const koaCors = require('koa2-cors') // 跨域
const body = require('koa-body') // json 解析和文件解析
const Router = require('koa-router') // router
const koaJwt = require('koa-jwt') // koa-jwt 用于校验token 等
const Jwtoken = require('jsonwebtoken') // 用于生成JWT Token

const SECRET = "2134124esadasdwacxz71290@7281983471……&*@#！……&@"

const Options = {
    issuer:"www.biologyscience.cn",
    expiresIn: '10m',
    algorithm:"HS256"
}

const app = new Koa()
const router = new Router()
app.use(koaCors())
app.use(body())
//401 用户没有权限，需要登录
app.use(function(ctx, next){
    return next().catch((err) => {
        if (401 == err.status) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
});

// 登录接口和注册接口不需要 token
app.use(koaJwt({secret:SECRET}).unless({path:['/login']}))


router.post('/login',async (ctx)=>{

    ctx.body = {
        token:"hello!!world!!"
    }
    // 用户名 和密码 ，需要做校验 ，待留明天
    const Payload = {
        user:"admin",
        userId:'21321'
    }
    // 生成 Jwt
    const token = Jwtoken.sign(Payload,SECRET,Options)
    console.log(token)
    console.log(Jwtoken.decode(token))
    // 将jwt Token 塞进 Authorization 里面
    ctx.response.set('Authorization','Bearer '+ token)

    console.log(ctx.request.body)
})

app.use(router.routes()).use(router.allowedMethods())
app.listen(8080,()=>{console.log('API is running on http://localhost:8080/login')})