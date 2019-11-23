const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const router = express.Router()
const port = process.env.PORT || 3100
const mongoose = require('mongoose')

// setup database
mongoose.set('useUnifiedTopology', true)
mongoose.connect('mongodb://localhost:27017/apiusers', {useNewUrlParser: true})

const User = require('./models/users')

// kofigurasi body parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// middleware
router.use((req, res, next) => {
  console.log(`Middleware berjalan pada ${Date.now()}`)
  next()
})

// prefix api
app.use('/api', router)

router.get('/', (req, res) => {
  res.json({message: "anda di home"})
})

// grup prefix
// user post data and get all users
router.route('/users')
  .post((req, res) => {
    let user = new User()

    user.name = req.body.name
    user.password = req.body.password

    user.save(err => {
      (err) ? res.send(err) : res.json({message: "user berhasil dimasukkan"})
    })
  })
  .get((req, res) => {
    User.find((err, users) => {
      (err) ? res.send(err) : res.json(users)
    })
  })

// user get one by params, update one user by params, and delete one by params
router.route('/users/:name')
  .get((req, res) => {
    User.find({name: req.params.name}, (err, user) => {
      (err) ? res.send(err) : res.json(user)
    })
  })
  .put((req, res) => {
    User.updateOne({name: req.params.name}, {name: req.body.name}, err => {
      (err) ? res.send(err) : res.json({message: "user successfully updated!!!"})
    })
  })
  .delete((req, res) => {
    User.deleteOne({name: req.params.name}, err => {
      (err) ? res.send(err) : res.json({message: "user successfully removed!!!"})
    })
  })

app.listen(port, () => {
  console.log(`server run on ${port}`);
})
