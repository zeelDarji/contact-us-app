const app = require("express")()
const bodyParser = require("body-parser")
const sendMail = require("./mailer")
const mysql = require("mysql")
require("dotenv").config()

const port = process.env.PORT || 3000

app.set("views", "views")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
})

app.get("/", (req, res) => {
  res.render("contact-us.ejs")
})

app.post("/contactUs", async (req, res) => {
  const username = req.body.username
  const phone = req.body.phone
  const email = req.body.email
  const message = req.body.message
  const sql = `INSERT INTO users (username, phone, email, message) VALUES ('${username}', '${phone}', '${email}', '${message}')`
  con.query(sql, function (err, result) {
    if (err) throw err
  })
  const mailOption = {
    data: {
      username: `${username}`,
      phone: `${phone}`,
      email: `${email}`,
      message: `${message}`,
    },
  }
  await sendMail(mailOption, "user-added").catch((error) => {
    logger.error("Send Mail :", error)
  })
  res.render("contact-us.ejs")
})

app
  .listen(port, () => {
    console.log(`App is running on port: ${port}`)
  })
  .on("error", (e) => {
    logger.error("Unable start server : ", e)
  })
