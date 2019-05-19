const Director = require('../models/Director')
module.exports = function (mongoose) {

    return {

        SetRouting: function (router) {

            router.post('/api/director', this.getDirector)
            router.get('/api/director_films', this.getFilmsOfDirector)
            router.get('/api/director/:director_id', this.getFilmOfDirector)
            router.get('/api/directors/:director_id', this.updateDirector)

        },
        getDirector: function (req, res, next) {

            const director = new Director(req.body)
            const promise = director.save()

            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json(err)
            });
        },
        updateDirector: function (req, res, next) {
            const promise = Director.findByIdAndUpdate(req.params.director_id, req.body, { new :true })
            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })
        },
        getFilmsOfDirector: function (req, res, next) {

            const promise = Director.aggregate([
                {
                    $lookup: {
                        from: 'movies',
                        localField: '_id',
                        foreignField: 'director_id',
                        as: 'movies'
                    }
                },
                {
                    $unwind: {
                        path: '$movies',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            _id: '$_id',
                            name: '$name',
                            surname: '$surname',
                            bio: '$bio'
                        },
                        movies: {
                            $push: '$movies'
                        }
                    }
                },
                {
                    $project: {
                        _id: '$_id._id',
                        name: '$_id.name',
                        surname: '$_id.surname',
                        bio: '$_id.bio',
                        movies: '$movies'
                    }
                }
            ])

            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })

        },
        getFilmOfDirector: function (req, res, next) {

            const promise = Director.aggregate([
                {
                    $match: {
                        '_id': mongoose.Types.ObjectId(req.params.director_id)
                    }
                },
                {
                    $lookup: {
                        from: 'movies',
                        localField: '_id',
                        foreignField: 'director_id',
                        as: 'movies'
                    }
                },
                {
                    $unwind: {
                        path: '$movies',
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $group: {
                        _id: {
                            _id: '$_id',
                            name: '$name',
                            surname: '$surname',
                            bio: '$bio'
                        },
                        movies: {
                            $push: '$movies'
                        }
                    }
                },
                {
                    $project: {
                        _id: '$_id._id',
                        name: '$_id.name',
                        surname: '$_id.surname',
                        bio: '$_id.bio',
                        movies: '$movies'
                    }
                }
            ])

            promise.then((data) => {
                res.json(data)
            }).catch((err) => {
                res.json(err)
            })

        }

    }
}