const router = require('express').Router()
const { userLogin } = require('../controllers/users')

router.post('/login',userLogin)

module.exports= router