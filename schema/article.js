const mongoose = require("mongoose");
const articleSchema = mongoose.Schema({
    id: { type: Number, index: true },
    title: String,//文章标题
    author: String,//作者
    createTime: Date,//创建时间
    updateTime: Date,//更新时间
    label: Array,//文章的标签
    content: String,//编译成html的content
    rawContent:String,//原始content
    summary: String,//文章小结
});



module.exports = articleSchema