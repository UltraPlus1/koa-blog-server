/**
 * 注册模块
 */
// 引入邮件模块
const Mail = require('../mail/index')
// 试用邮件模块
async function main(){
    let result = await Mail.sendMail("1076536974@qq.com","123456")
}
main()