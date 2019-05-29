const User = require('../models/Users')
const jwt = require('jsonwebtoken')
const multer = require('multer');
const upload = multer()
var ObjectId = require('mongodb').ObjectID
let configTop
module.exports = function (mongoose,async) {


    return {
        SetRouting: function (router, config) {
            configTop = config

            router.post('/user/register', this.registerUser);
            router.post('/user/authenticate', this.loginUser);
            router.get('/user/getUser', this.getUserDonor);
            router.put('/user/setTalepforDonor', this.setTalepForDonor);
            router.post('/api/user/imageUpload', this.userImageUpload);
            router.put('/user/updateUser', this.userUpdate);
            

        },
        registerUser: function (req, res, next) {

            const { username, password, email, enrollType, il, İlce, kanGrubu, hospital_name } = req.body


            const user = new User({ username, password, email, enrollType, il, İlce, kanGrubu, hospital_name })
            const promise = user.save()

            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json({ status: false, error: err })
            })


        },
        userUpdate: function (req, res, next) {

          


            const promise = User.findByIdAndUpdate(
                req.body._id,
                req.body,
                {
                    new: true
                });

            promise.then((data) => {
                if (!data)
                    next({ message: 'The user was not found' })
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })

        },
        setTalepForDonor: function (req, res, next) {


            async.waterfall([
                function(cb){
                    const isTelap = User.findOne({ "_id": ObjectId(req.body._id) },

                    { talepler: { $elemMatch: { username: req.body.username } } })
                    
                    isTelap.then((data,err)=> {
                          

                           cb(err,data.talepler.length)
                    })
            
                       
                },
                function(data,cb){
                        
                    if(data==0){
                    
                        const promise = User.updateOne(
                            { "_id": ObjectId(req.body._id) },
                            { $push: { talepler: { 'username': req.body.username, 'kanGrubu': req.body.kanGrubu } } },
                            { new: true });
                            
                        promise.then(data=> {
                          
                          
                        })
                       
                        cb(null,true)
                    }
                    else{
                      
                        cb(null,false)
                    }
                        
                },
                function(data,cb){
                           console.log(data)
                    if(data){
                    
                        const promise = User.updateOne(
                            { "_id": ObjectId(req.body.istek_id) },
                            { $push: { istekler: { 'username': req.body.istek_username, 'kanGrubu': req.body.istek_kanGrubu } } },
                            { new: true });
                            
                        promise.then(data=> {
                            res.json({status:true,data:data})
                        })
                    }
                    else{
                        res.json({status: false,error:'error'})
                    }
                        
                },

            ])

           

           




        },
       

        getUserDonor: function (req, res, next) {




            const promise = User.find({ "enrollType": 'donör' })

            promise.then((data) => {
                res.json(data)

            }).catch((err) => {
                res.json({ status: false, error: err })
            })


        },
        loginUser: function (req, res, next) {

            const { username, password } = req.body

            User.findOne({
                username,
                password
            }, (err, user) => {
                if (err)
                    throw err
                if (!user) {
                    res.json({
                        status: false,
                        message: 'Authentication failed,user not found'
                    })
                }
                else {
                    const payload = {
                        user
                    }
                    const token = jwt.sign(payload, configTop.api_secret_key, {
                        expiresIn: 720
                    })

                    res.json({
                        status: true,
                        token,
                        user

                    })

                }
            })
        },

        userImageUpload: function (req, res, next) {

            const token = req.query.token || req.headers['x-access-token'] || req.body.token
            const storage = multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, './uploads')
                },
                filename: function (req, file, cb) {
                    const extArray = file.mimetype.split("/");
                    const extension = extArray[extArray.length - 1];

                    cb(null, Date.now() + '.' + extension)
                }
            });


            console.log(req.file)

            const user = User.findByIdAndUpdate(req.decodde.user._id, { userImage: req.file.filename }, (err, data) => {
                if (err) {
                    console.log(err)
                } else {
                    res.json({ status: 1 })
                }
            })



        },

    }
}
