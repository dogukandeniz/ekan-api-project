
const User = require('../models/user');
const Movie = require('../models/movie');


module.exports = function (_, mongoose) {


    return {

        SetRouting: function (router) {

            router.post('/api/movie', this.indexPage);
            router.get('/api/movies', this.getAllMovies);
            router.get('/api/movie/top10', this.getTop10);
            router.get('/api/movie/:movie_id', this.getMoviebyId);
            router.put('/api/movie/:movie_id', this.updateMoviebyId);
            router.delete('/api/movie/:movie_id', this.deleteMoviebyId);
            router.delete('/api/movie/:movie_id', this.deleteMoviebyId);
            router.get('/api/movie/:between/:start_year/:end_year', this.getBetween2Years);






        },
        indexPage: function (req, res, next) {

            const movie = new Movie(req.body)
            const promise = movie.save()

            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })

        },
        getTop10: function (req, res, next) {

            const promise = Movie.find({}).limit(10).sort({ imdb_score: -1 })

            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })
        },
        getAllMovies: function (req, res, next) {

            const promise = Movie.aggregate([
                {
                    $lookup: {
                        from :'directors',
                        localField: 'director_id',
                        foreignField:'_id',
                        as: 'director'
                    }
                },{
                    $unwind: '$director'
                }

            ])
            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })
        },
        getMoviebyId: function (req, res, next) {

            const promise = Movie.findById(req.params.movie_id);
            req.flash('msg1', 'Movie is not found')
            promise.then((data) => {
                if (!data)
                    res.json(req.flash('msg1'))
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })
        },
        updateMoviebyId: function (req, res, next) {
            const promise = Movie.findByIdAndUpdate(
                req.params.movie_id,
                req.body,
                {
                    new: true
                });

            promise.then((data) => {
                if (!data)
                    next({ message: 'The movie was not found' })
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })

        },
        deleteMoviebyId: function (req, res, next) {
            const promise = Movie.findByIdAndRemove(
                req.params.movie_id);

            promise.then((data) => {
                if (!data)
                    next({ message: 'The movie was not found' })
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })

        },
        getBetween2Years: function (req, res, next) {
            const { start_year, end_year } = req.params

            const promise = Movie.find(
                {
                    year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
                }
            )

            promise.then((data) => {
                res.send(data)
            }).catch((err) => {
                res.send(err)
            })
        }

    }
}