
module.exports = function (mongoose) {
 
    mongoose.connect('mongodb://localhost:27017/Udemy', {   useCreateIndex: true,useNewUrlParser: true })
    mongoose.connection.on('open', () => {
        console.log('MongoDB: Connected')
    })
    mongoose.connection.on('error', (err) => {
        console.log('MongoDB: Error', err)
    })


    mongoose.Promise = global.Promise

}