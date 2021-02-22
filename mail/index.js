// 邮件模块
"use strict";
const nodemailer = require("nodemailer");

/**
 * 
 * @param {String} receiver 邮件的接收方
 * @param {Number} ValidCode 注册的验证码 
 */
exports.sendMail =async function(receiver,ValidCode) {

    // 为QQ邮箱配置SMTP服务
    let transporter = nodemailer.createTransport({
        service: 'qq',
        secure: true, // 开启安全传输
        auth: {
            user: "1076536974@qq.com", // QQ邮箱名
            pass: "usshrmjmhjuybabb", // QQ邮箱生成的SMTP密码
        },
    });

    try {
        // 发送邮件
        let info = await transporter.sendMail({
            from: "1076536974@qq.com", // 发送方
            to: receiver, // 接收方
            subject: "验证码",// 邮件主题
            text: "验证码：" + ValidCode, // 邮件纯文本内容
            html: `<b>${ValidCode}</b>`, // 邮件html 内
        });

        // 打印邮件ID
        console.log("Message sent: %s", info.messageId);
        return "发送成功"
    } catch (e) {
        console.log(e)
        return "发送失败"
    }
}