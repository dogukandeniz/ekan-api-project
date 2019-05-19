
module.exports = function (mongoose) {

    mongoose.connect('mongodb://dogukan:abc123@ds151076.mlab.com:51076/heroku_5m2dr5vg', {   useCreateIndex: true,useNewUrlParser: true })
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected')
    })
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err)
    })


    mongoose.Promise = global.Promise

}