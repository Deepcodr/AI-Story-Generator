const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const deepai = require('deepai');
var session = require('express-session');
const MongoStore = require("connect-mongo");
const jwt = require('jsonwebtoken');
const JWTStrategy = require("passport-jwt").Strategy;
const cors = require('cors');
var passport = require('passport');
var LocalStrategy = require('passport-local');
const port = 5000;

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(cors({
    origin: 'http://localhost:3000',
}))


mongoose.connect('mongodb://127.0.0.1:27017/aistorygen');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));


db.once('open', function () {
    console.log("Connection Successful!");
});

app.use(session({
    secret: 'aistorygensecret',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        client: db.getClient(),
        dbName: 'aistorygen',
        collectionName: "sessions",
        stringify: false,
        autoRemove: "interval",
        autoRemoveInterval: 1
    })
}));

var UserSchema = mongoose.Schema({
    name: String,
    username: { type: String, unique: true },
    password: String,
    mobile: { type: Number, unique: true },
});

// var TagSchema = mongoose.Schema({ name: String })
var StorySchema = mongoose.Schema({
    username: String,
    prompt: String,
    story: String,
    upvotes: Number,
    // tags: [TagSchema]
}, { timestamps: true })

var FeedSchema = mongoose.Schema({
    username: String,
    storyId: { type: mongoose.ObjectId, unique: true }
}, { timestamps: true })

var UpvoteSchema = mongoose.Schema({
    username: String,
    storyId: { type: mongoose.ObjectId },
})

UpvoteSchema.index({ username: 1, storyId: 1 }, { unique: true });

var User = mongoose.model('User', UserSchema, 'user');
var Story = mongoose.model('Story', StorySchema, 'stories');
var Feed = mongoose.model('Feed', FeedSchema, 'feed');
var Upvote = mongoose.model('Upvote', UpvoteSchema, 'upvotes');

passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const query = User.where({ username: username });
    await query.findOne().then(function (user) {
        if (user.password === password) {
            cb(null, user, { status: 200, message: 'Login Successful.' });
        }
        else {
            cb(null, false, { status: 401, message: 'Incorrect username or password.' })
        }
    }).catch(function (err) {
        cb(null, false, { status: 401, message: 'User Does Not Exist' })
    });
}));

passport.use(new JWTStrategy(
    {
        jwtFromRequest: (req) => req.headers['x-access-token'],
        secretOrKey: 'examplesecret',
    },
    (payload, done) => {
        return done(null, payload);
    }
));

passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        cb(null, { id: user.id, username: user.username });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.post('/register', async (req, res) => {
    var user1 = new User(req.body);

    await user1.save().then(function (user) {
        if (user) {
            console.log(user.name + " saved to user collection.");
            res.send({status :200 , message : user.name });
        }
    }, function (err) {
        console.log(err);
        res.send({status : 500 , message : "Internal server error"});
    });
});

app.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.send({status : 401 , message :info.message});
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            var userobject = {
                username: user.username,
                mobile: user.mobile
            }
            var token = jwt.sign(userobject, 'examplesecret');
            req.session.jwt = token;
            return res.send({status: 200 , token :token});
        });
    })(req, res);
});

app.post('/logout', (req, res, next) => {
    req.session.destroy(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})

app.get('/session', (req, res) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err || !user) {
            res.send(false);
        } else {
            res.send(user);
        }
    })(req, res);
});

app.post('/generateStory', async (req, res) => {
    deepai.setApiKey('quickstart-QUdJIGlzIGNvbWluZy4uLi4K');
    var resp = await deepai.callStandardApi("text-generator", {
        text: req.body.prompt,
    });
    res.send(resp);
})

app.post('/savestory', async (req, res) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            res.send({ status: 401, message: "Not Authorized" });
        } else {
            var story = new Story(req.body);

            await story.save().then(function (story) {
                if (story) {
                    res.send({ status: 200, message: JSON.stringify(story) });
                }
            }, function (err) {
                console.log(err);
                res.send({ status: 500, message: "Internal server error" });
            });
        }
    })(req, res);
});

app.post('/sharestory', async (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            res.send({ status: 401, message: "Not Authorized" });
        } else {
            Story.where({ _id: req.body.storyId }).findOne().then((story) => {
                var feed = new Feed({ username: story.username, storyId: story['_id'] });

                feed.save().then(function (feed) {
                    if (feed) {
                        console.log(feed.username + " saved feed collection.");
                        res.send({ status: 200, message: JSON.stringify(feed) });
                    }
                }, function (err) {
                    console.log(err);
                    res.send({ status: 500, message: "Internal server error" });
                });
            }).catch(function (err) {
                res.send({ status: 500, message: 'Internal Server Error' });
            });
        }
    })(req, res);
})

app.get('/getfeed', (req, res, next) => {
    Feed.aggregate().lookup({ from: 'stories', localField: 'storyId', foreignField: '_id', as: 'feedstories' }).sort({ "createdAt": 1 }).then(function (result) {
        var feedstories = [];
        result.forEach(feed => {
            if (feed.feedstories.length === 1) {
                feedstories.push({
                    username: feed.feedstories[0].username,
                    storyid: feed.feedstories[0]['_id'],
                    story: feed.feedstories[0].story,
                    upvotes: feed.feedstories[0].upvotes,
                    creationtime: feed.feedstories[0].createdAt
                })
            }
        });
        res.send(feedstories);
    }).catch(function (err) {
        console.log(err);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    });
})

app.post('/upvote', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            res.send({ status: 401, message: "Not Authorized" });
        } else {
            Upvote.where({ username: user.username, storyId: req.body.storyid }).findOne().then((upvote) => {
                if (upvote) {
                    console.log("deupvoting");
                    Upvote.where({ username: user.username, storyId: req.body.storyid }).deleteOne().then((del) => {
                        if (del.deletedCount === 1) {
                            Story.where({ _id: req.body.storyid }).updateOne({ $inc: { upvotes: -1 } }).then((story) => {
                                Story.where({ _id: req.body.storyid }).findOne().then((story) => {
                                    res.send({ status: 200, message: story });
                                })
                            }).catch(function (err) {
                                res.send({ status: 500, message: 'Internal Server Error' });
                            });
                        }
                        else {
                            res.send({ status: 500, message: "Internal server error" });
                        }
                    })
                }
                else {
                    console.log("upvoting");
                    var upvote = new Upvote({ username: user.username, storyId: req.body.storyid });

                    upvote.save().then(function (upvote) {
                        if (upvote) {
                            Story.where({ _id: req.body.storyid }).updateOne({ $inc: { upvotes: 1 } }).then((story) => {
                                Story.where({ _id: req.body.storyid }).findOne().then((story) => {
                                    res.send({ status: 200, message: story });
                                })
                            }).catch(function (err) {
                                res.send({ status: 500, message: 'Internal Server Error' });
                            });
                        }
                    }, function (err) {
                        console.log(err);
                        res.send({ status: 500, message: "Internal server error" });
                    });
                }
            })
        }
    })(req, res);
})

app.get('/leaderboard', (req, res, next) => {
    let query = Story.find({}).sort({ 'upvotes': -1 })

    let promise = query.exec();

    promise.then(function (result) {
        var leaderboard = [];
        result.forEach(story => {
            leaderboard.push({
                username: story.username,
                storyid: story['_id'],
                story: story.story,
                upvotes: story.upvotes,
                creationtime: story.createdAt
            })
        });
        res.send(leaderboard);
    }).catch(function (err) {
        console.log(err);
        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    });
});

app.get('/mystories', (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user) => {
        if (err || !user) {
            res.send({ status: 401, message: "Not Authorized" });
        } else {
            let query = Story.find({ username: user.username }).sort({ 'createdAt': 1 })

            let promise = query.exec();

            promise.then(function (result) {
                var mystories = [];
                result.forEach(story => {
                    mystories.push({
                        username: story.username,
                        storyid: story['_id'],
                        story: story.story,
                        upvotes: story.upvotes,
                        creationtime: story.createdAt
                    })
                });
                res.send(mystories);
            }).catch(function (err) {
                console.log(err);
                res.status(500).send({ status: 500, message: 'Internal Server Error' });
            });
        }
    })(req,res);
})

app.listen(port, () => {
    console.log(`server started on ${port}`);
});