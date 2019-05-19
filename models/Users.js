const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UsersSchema = new Schema({

    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: {type: String, default: ''},
    enrollType: { type: String,default: ''},
    userImage: {type: String, default:'default.png'},
  

})


module.exports = mongoose.model('user', UsersSchema)