const Koa = require('koa') // koa
const koaCors = require('koa2-cors') // 跨域
const body = require('koa-body') // json 解析和文件解析
const Router = require('koa-router') // router
const koaJwt = require('koa-jwt') // koa-jwt 用于校验token 等
const jwtoken = require('jsonwebtoken') //用于jwt的真伪的验证
const config = require('./config/secret') // 用于jwt 的加密 解密 验证
const loginRouter = require('./login/index') // 登录相关的页面的路由
const articleRouter = require('./article/index') // 文章相关的页面路由
const SECRET = config.SECRET
const options = config.Options
const app = new Koa()
const router = new Router()
app.use(koaCors())
app.use(body())

//401 用户没有权限，需要登录
app.use((ctx, next) => {
    if (ctx.header && ctx.header.authorization) {
        const parts = ctx.header.authorization.split(' ');
        if (parts.length === 2) {
            //取出token
            const scheme = parts[0];
            const token = parts[1];
            // 加拦截层
            if (/^Bearer$/i.test(scheme)) {
                try {
                    //jwt.verify方法验证token是否有效
                    let vresult = jwtoken.verify(token, SECRET, {
                        complete: true
                    });
                    // jwt.verify 验证成功签发token
                    const user = vresult.payload?.user;
                    const userId = vresult.payload?.userId;
                    if(user&&userId){
                        const payload = {
                            user:user,
                            userId:userId
                        }
                        const token = jwtoken.sign(payload,SECRET,options);
                        ctx.response.set('Authorization','Bearer '+ token)
                    }
                } catch (error) {
                    console.log(error)
                    // //token过期 生成新的token
                    // const newToken = getToken(user);
                    // //将新token放入Authorization中返回给前端
                    // ctx.res.setHeader('Authorization', newToken);
                }
            }
        }
    }

    return next().catch(err => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body =
                'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }});
});


//校验JWT  token 是否过期
app.use(koaJwt({secret:SECRET}).unless({
    path:['/login',"/register","/register/sendValidCode"]
}))

router.use(loginRouter.routes(),loginRouter.allowedMethods())
router.use(articleRouter.routes(),articleRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())
app.listen(8080,()=>{console.log('API is running on http://localhost:8080/login')})

