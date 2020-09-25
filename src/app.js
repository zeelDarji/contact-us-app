const app = require("express")()
const bodyParser = require("body-parser")
const sendMail = require("./mailer")
const MongoClient = require("mongodb").MongoClient
require("dotenv").config()

const port = process.env.PORT || 3000

app.set("views", "views")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.render("contact-us.ejs")
})

app.post("/contactUs", async (req, res) => {
  const username = req.body.username
  const phone = req.body.phone
  const email = req.body.email
  const message = req.body.message
  const client = new MongoClient(process.env.MONGODB_URL, { useNewUrlParser: true });
  client.connect(function (err, db) {
    if (err) throw err
    const dbo = db.db('test')
    const myobj = {username, phone, email, message}
    dbo.collection("users").insertOne(myobj, function (err, res) {
      if (err) throw err
      console.log("1 document inserted")
      db.close()
    })
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
