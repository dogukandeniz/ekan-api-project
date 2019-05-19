'use strict'

const User = require('../models/user');

module.exports = function(_,mongoose) {
  
        return {

            SetRouting: function(router)  {
                
                    router.post('/new',this.indexPage),
                    router.get('/search',this.getUser),
                    router.get('/searchOne',this.searchOne)

            },
            indexPage:function(req,res)  {

                const book = new User({
                    username: 'Udemy Node.JSS',
                    fullname: 'dogukan denizd',
                    email: 'bora.dogukan36@gmail.com'
                })

                book.save((err,data) => {
                    if(err){
                        console.log(err)
                    }
                    res.json(data);
                })

            
            },
            getUser:function(req,res)  {
                
                User.find({},(err,data) => {
                    res.json(data)
                })
            },
            searchOne:function(req,res) {
                User.findOne({fullname:'dogukan denizd'},(err,data)=>{
                    res.json(data)
                })
            }

        }

}