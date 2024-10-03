const experss = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()

const authRouter = require('./routers/auth')
const app = experss()

const testSchema = require('./models/testSchema')
const testModel = mongoose.model('TestTheaTre', testSchema)

const testScreen = require('./models/testScreen')
const testScreenModel = mongoose.model('TestScreen', testScreen)

const testMovie = require('./models/testMovie')
const testMovieModel = mongoose.model('TestMovie', testMovie)

const testShow = require('./models/testShow')
const testShowModel = mongoose.model('TestShow', testShow)

const testSingleSeat = require('./models/testSingleSeat')
const testSingleSeatModel = mongoose.model('TestSingleSeat', testSingleSeat)


const testPayment = require('./models/testPayment')
const testPaymentModel = mongoose.model('TestPayment', testPayment)


const port = 3000
const MONGO_URL = process.env.MONGO_URL

app.use(bodyParser.json())
app.use('/user', authRouter)

app.get('/ping', (req, res) => {
    res.send('ping test passed')
})

app.get('/', (req, res) => {
    res.send('base home')
})

app.get('/theatre/addTest', (req, res) => {
    const newTheatre = new testModel({ theatreID: "TH001", screenCount: 3})
    newTheatre.save()
        .then((savedTheater) => {
            res.send('Theater Added')
        }).catch((e) => {
            res.send(e)
        })
})

app.post('/theatre/add', async (req, res) => {
    const screencount = req.body.screenCount
    const name = req.body.name
    let theatreID = "-1"

    try {
        const theatreCount = await testModel.countDocuments()
        console.log(theatreCount)
        theatreID = "TH00" + (theatreCount + 1)
    }
    catch(error) {
        console.error(error)
        res.send(error)
    }

    if(theatreID !== "-1"){
        const newTheatre = new testModel({ theatreID: theatreID, screenCount: screencount, name: name})
    newTheatre.save()
        .then((savedTheater) => {
            res.send('Theater Added')
        }).catch((e) => {
            res.send(e)
        })
    }
})

app.get('/theatre/fetch', async (req, res) => {
    
    try {
        const theatreData = await testModel.find({})
        res.send(theatreData)
    } catch(error) {
        res.send(error)
    }
})

app.delete('/theatre/remove', async (req, res) => {
    const screencount = req.body.screenCount
    const name = req.body.name
    const theatreID = req.body.theatreID
    
    const updatedTheatre = await testModel.findOneAndDelete(
        {theatreID: theatreID},
        req.body,
        {new: true});

        console.log(updatedTheatre)

    res.send(updatedTheatre)
})

app.put("/theatre/update", async (req, res) => {
    const screencount = req.body.screenCount
    const name = req.body.name
    const theatreID = req.body.theatreID
    
    const updatedTheatre = await testModel.findOneAndReplace(
        {theatreID: theatreID},
        req.body,
        {new: true});

    res.send(updatedTheatre)
})

app.post('/screens/add', async (req, res) => {
    const theatreID = req.body.theatreID
    const seats = req.body.seats

    let screenID = "-1"

    try {
        const screenCount = await testScreenModel.countDocuments({theatreID:theatreID})
        console.log(screenCount)
        screenID = theatreID + "_SC00" + (screenCount + 1)
    }
    catch(error) {
        console.error(error)
        res.send(error)
    }

    if(screenID !== "-1"){
        const newScreen = new testScreenModel({ theatreID: theatreID, screenID: screenID, seats: seats})
    newScreen.save()
        .then((savedScreen) => {
            res.send('Screen Added' + savedScreen)
        }).catch((e) => {
            res.send(e)
        })
    }
})

app.get('/screens/fetch', async (req, res) => {
    try {
        const theatreID = req.body.theatreID

        if(theatreID != null){
            const theatreData = await testScreenModel.find({theatreID:theatreID})
            res.send(theatreData)
        } else {
            res.send(error)
        }
    } catch(error) {
        res.send(error)
    }
})

app.delete("/screens/remove", async (req, res) => {
    const screenID = req.body.screenID
    
    const updatedTheatre = await testScreenModel.findOneAndDelete(
        {screenID: screenID},
        req.body,
        {new: true});

        console.log(updatedTheatre)

    res.send(updatedTheatre)
})

app.put("/screen/update", async (req, res) => {
    const count = req.body.count
    const screenID = req.body.screenID
    
    const updatedTheatre = await testModel.findOneAndReplace(
        {screenID: screenID},
        req.body,
        {new: true});

    res.send(updatedTheatre)
})

app.post('/shows/add', async (req, res) => {
    const theatreID = req.body.theatreID
    const screenID = req.body.screenID
    const movieID = req.body.movieID
    const date = req.body.date
    const time = req.body.time
    let seats = -1
    let showID = "-1"

    try {
        const showCount = await testShowModel.countDocuments({})
        console.log(showCount)
        showID = "SHOW00" + (showCount + 1)

        const screenDoc = await testScreenModel.find({screenID})
        if(screenDoc.length > 0){
            seats = screenDoc[0].seats
            console.log(seats)
        }
    }
    catch(error) {
        console.error(error)
        res.send(error)
    }

    // return res.send("ABC")

    if(showID !== "-1" && seats != -1){
        const newShow = new testShowModel({ theatreID, screenID, movieID, date, time, showID})
        console.log(newShow)

    newShow.save()
        .then(async (savedShow) => {

            for(let v = 1; v <= seats; ++v){
                const newSeat = new testSingleSeatModel({seatID : v, available : true, showID, price : 100, sold: false, inBuffer: false})
                console.log(newSeat)
                await newSeat.save().then((seat) =>{
                    console.log(seat)
                }).catch(e => console.log(e))
            }

            res.send('Show Added' + savedShow)

        }).catch((e) => {
            res.send(e.toString())
        })
    }

})

app.put('/shows/modify', async (req, res) => {
    const theatreID = req.body.theatreID
    const screenID = req.body.screenID
    const movieID = req.body.movieID
    const date = req.body.date
    const time = req.body.time
    let showID = req.body.showID



        const newShow = new testShowModel({ theatreID, screenID, movieID, date, time, showID})
        console.log(newShow)

    newShow.findOneAndReplace({showID}, req.body)
        .then(async (replacedShow) => {

            res.send('Show Added' + replacedShow)

        }).catch((e) => {
            res.send(e)
        })
    }
)

app.delete('/shows/delete', async (req, res) => {
    const theatreID = req.body.theatreID
    const screenID = req.body.screenID
    const movieID = req.body.movieID
    const date = req.body.date
    const time = req.body.time
    let showID = req.body.showID



        const newShow = new testShowModel({ theatreID, screenID, movieID, date, time, showID})
        console.log(newShow)

    newShow.findOneAndDelete({showID}, req.body)
        .then(async (replacedShow) => {

            res.send('Show Added' + replacedShow)

        }).catch((e) => {
            res.send(e)
        })
    }
)


app.post("/movie/add", async (req, res) => {
    const name = req.body.name
    const description = req.body.description
    const screenTime = req.body.screenTime

    let movieID = "-1"

    try {
        const movieCount = await testMovieModel.countDocuments({})
        console.log(movieCount)
        movieID = "MOV00" + (movieCount + 1)
    }
    catch(error) {
        console.error(error)
        res.send(error)
    }

    if(movieID !== "-1"){
        const newMovie = new testMovieModel({ name, description, movieID, screenTime})
    newMovie.save()
        .then((savedMovie) => {
            res.send('Screen Added' + savedMovie)
        }).catch((e) => {
            res.send(e)
        })
    }

})


// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// User level

app.get('/shows/live', async (req, res) => {
    // Get all, live shows, get the movies and return the movie.

    const liveShows = await testShowModel.aggregate([
        {
            $group: {
                _id: "$movieID"
            }
        }
    ])

    console.log(liveShows)

    if(liveShows.length > 0){
        let movieIDs = []
        for(let v = 0; v < liveShows.length; ++v) {
            movieIDs.push(liveShows[v]._id)
        }

        // console.log(movieIDs)

        const movies = await testMovieModel.find({ movieID : { $in: movieIDs}
            // movieId: { $in: movieIDs}
            // movieId: movieIDs[0]
        })

        res.send(movies)

    } else {
        res.send("No Live shows")
    }

    // res.send(liveShows)
})

app.get('/shows/live/movie', async (req, res) => {
    const movieID = req.body.movieID

    const liveShowsForMovie = await testShowModel.find({movieID})

    console.log(liveShowsForMovie)

    res.send(liveShowsForMovie)
})

app.get('/shows/live/fetchSeats', async (req, res) => {
    const showID = req.body.showID

    const seats = await testSingleSeatModel.find({showID})

    res.send(seats)

})

app.get('/shows/live/bookSeats', async (req, res) => {
    const showID = req.body.showID
    const seatIDs = req.body.seatIDs

    console.log(showID)
    console.log(seatIDs)

    const seatStatus = await testSingleSeatModel.find({
        showID,
        seatID: { $in: seatIDs},
        sold: false,
        inBuffer: false,
        available: true
    })

    if(seatStatus.length == seatIDs.length) {
        let ids = []
        let seats = []
        for(let v = 0; v < seatStatus.length; ++v) {
            // seatStatus[0].inBuffer = false
            ids.push(seatStatus[v]._id)
            seats.push(seatStatus[v].seatID)
        }

        // const seatInBuffer = await testSingleSeatModel.findByIdAndUpdate({
        //     // _id : {$in : ids}
        //     ids
        // })

        const seatInBuffer = await testSingleSeatModel.updateMany(
            { _id: {$in : ids}},
            { $set: { inBuffer: true}}
        )

        console.log(seatInBuffer)

        // seats are now in buffer
        // make the purchase

        //if purchase is successful
        const transactionID = "ABC_123"
        const userID = "PBCS"

        const seatInSold = await testSingleSeatModel.updateMany(
            { _id: {$in : ids}},
            { $set: { inBuffer: false, sold: true, available: false}}
        )

        console.log(seatInSold)

        const transaction = new testPaymentModel({transactionID, userID, showID, seats})
        transaction.save()
            .then((transactionStatus) => {
                res.send(transactionStatus)
            }).catch((e) => res.send(e))

        
    } else {
        res.send('seat not available')
    }

    // console.log(seatStatus)
    // res.send(seatStatus)
})

app.listen(port, () => {
    console.log("Setting up server")
    console.log("Connecting to Mongo")

    mongoose.connect(MONGO_URL)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.log('Error connecting Mongo Server'. err))

    console.log(`Server started at port ${port}`)
})