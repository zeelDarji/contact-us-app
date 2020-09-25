const ejs = require("ejs")
const nodemailer = require("nodemailer")
require("dotenv").config()

const transport = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
}
const transporter = nodemailer.createTransport(transport)

const getTemplate = (mail, templateName) => {
  return ejs
    .renderFile(
      `${__dirname}/../views/emailTemplates/${templateName}.ejs`,
      mail.data
    )
    .catch((error) => {
      console.log("Email template error: ", error)
      return false
    })
}

function sendMail(mail, templateName) {
  let isSent = false
  return getTemplate(mail, templateName)
    .then((htmlOutput) => {
      if (htmlOutput) {
        const mailOptions = {
          from: process.env.SMTP_FROM,
          to: process.env.SMTP_FROM,
          subject: "User added!",
          html: htmlOutput,
        }
        return transporter
          .sendMail(mailOptions)
          .then((body) => {
            if (body) {
              isSent = true
            }
            return body
          })
          .catch((error) => {
            console.log("Send Email : ", error)
            return isSent
          })
      }
      return isSent
    })
    .catch((error) => {
      console.log("Error  : ", error)
      return isSent
    })
}

module.exports = sendMail
