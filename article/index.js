/**
 * 文章模块
 */
const Router = require('koa-router') // router
const article = new Router()
const mongoose = require("mongoose");
const marked = require("marked");
const hljs = require("highlight.js");
const articleSchema = require("../schema/article");
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("connect success");
});
const Article = db.model('Article',articleSchema)
// 添加文章的时候渲染markdown 文档
const renderer = new marked.Renderer()
marked.setOptions({
    renderer: renderer,
    gfm: true,
    pedantic: false,
    sanitize: false,
    tables: true,
    breaks: false,
    smartLists: true,
    smartypants: false,
    highlight: function (code) {
        return hljs.highlight('javascript',code).value;
    }
});
// 登录接口
article.post('/article/create',async (ctx)=>{
    const currentTime = new Date()
    const title = ctx.request.body?.title;
    let content = ctx.request.body?.content;
    const label = ctx.request.body?.label;
    const summary =ctx.request.body?.summary;
    if(title&&content){
        let newArticle =new Article({
            title: title,
            author: 'Mason',
            createTime: currentTime,
            updateTime: null,
            label: label,
            content: marked(content),
            rawContent:content,
            summary:summary,
        })
        let isError = false
        newArticle.save((err,obj)=>{
            isError = err
            if(err){
                return console.error(err)
            }else {
                console.log(obj.title);
            }
        })
        if(isError){
            ctx.body={
                message: '未知错误',
                status: 500
            }
        }else{
            ctx.body={
                message: '新建成功',
                status: 200
            }
        }
    }else{
        ctx.body={
            message:"请将信息补充完整再提交！",
            status:500
        }
    }
})

exports =module.exports = article