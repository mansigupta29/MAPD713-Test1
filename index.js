var SERVER_NAME = 'games-api'
var PORT = 3002;
var HOST = '127.0.0.1';


var restify = require('restify')

  // Get a persistence engine for the games
  , gamesSave = require('save')('games')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME })

server.listen(PORT, HOST, function () {
    console.log('Server started at %s', server.name, server.url)
    console.log('Resources:')
    console.log(' /games')
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all games in the system
server.get('/games', function (req, res, next) {

    // Find every entity within the given collection
    gamesSave.find({}, function (error, games) {

        // Return all of the games in the system
        res.send(games)
    })
})

// Create a new game
server.post('/games', function (req, res, next) {

    // Make sure title is defined
    if (req.params.title === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('title must be supplied'))
    }
    if (req.params.platform === undefined) {
        // If there are any errors, pass them to next in the correct format
        return next(new restify.InvalidArgumentError('platform must be supplied'))
    }
    var newGame = {
        title: req.params.title,
        platform: req.params.platform
    }

    // Create the game using the persistence engine
    gamesSave.create(newGame, function (error, game) {

        // If there are any errors, pass them to next in the correct format
        if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

        // Send the game if no issues
        res.send(201, game)
    })
})


