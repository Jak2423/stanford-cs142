/* jshint node: true */

/*
 * This builds on the webServer of previous projects in that it exports the current
 * directory via webserver listing on a hard code (see portno below) port. It also
 * establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test          - (Same as /test/info)
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).  Good
 *                   for testing database connectivity.
 * /test/counts   -  Returns the population counts of the cs142 collections in the database.
 *                   Format is a JSON object with properties being the collection name and
 *                   the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the database.
 * /user/list     -  Returns an array containing all the User objects from the database.
 *                   (JSON format)
 * /user/:id      -  Returns the User object with the _id of id. (JSON format).
 * /photosOfUser/:id' - Returns an array with all the photos of the User (id). Each photo
 *                      should have all the Comments on the Photo (JSON format)
 *
 */

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

var express = require('express');
var app = express();

const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');

var fs = require('fs');

const processFormBody = multer({ storage: multer.memoryStorage() }).single('uploadedphoto');

// Load the Mongoose schema for User, Photo, and SchemaInfo
var User = require('./schema/user.js');
var Photo = require('./schema/photo.js');
var SchemaInfo = require('./schema/schemaInfo.js');

var cs142password = require('./cs142password.js');

app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: false }));
app.use(bodyParser.json());

// XXX - Your submission should work without this line. Comment out or delete this line for tests and before submission!
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project7', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

app.get('/', function (request, response) {
	response.send('Simple web server of files from ' + __dirname);
});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * To accept URLs with /test/<something> and return the something in request.params.p1
 * If implement the get as follows:
 * /test or /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 * /test/counts - Return an object with the counts of the different collections in JSON format
 */
app.get('/test/:p1', function (request, response) {
	// Express parses the ":p1" from the URL and returns it in the request.params objects.

	var param = request.params.p1 || 'info';

	if (param === 'info') {
		// Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
		SchemaInfo.find({}, function (err, info) {
			if (err) {
				// Query returned an error.  We pass it back to the browser with an Internal Service
				// Error (500) error code.
				console.error('Doing /user/info error:', err);
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (info.length === 0) {
				// Query didn't return an error but didn't find the SchemaInfo object - This
				// is also an internal error return.
				response.status(500).send('Missing SchemaInfo');
				return;
			}

			// We got the object - return it in JSON format.
			response.end(JSON.stringify(info[0]));
		});
	} else if (param === 'counts') {
		// In order to return the counts of all the collections we need to do an async
		// call to each collections. That is tricky to do so we use the async package
		// do the work.  We put the collections into array and use async.each to
		// do each .count() query.
		var collections = [
			{ name: 'user', collection: User },
			{ name: 'photo', collection: Photo },
			{ name: 'schemaInfo', collection: SchemaInfo },
		];
		async.each(
			collections,
			function (col, done_callback) {
				col.collection.countDocuments({}, function (err, count) {
					col.count = count;
					done_callback(err);
				});
			},
			function (err) {
				if (err) {
					response.status(500).send(JSON.stringify(err));
				} else {
					var obj = {};
					for (var i = 0; i < collections.length; i++) {
						obj[collections[i].name] = collections[i].count;
					}
					response.end(JSON.stringify(obj));
				}
			},
		);
	} else {
		// If we know understand the parameter we return a (Bad Parameter) (400) status.
		response.status(400).send('Bad param ' + param);
	}
});

/*
 * URL /user/list - Return all the User object.
 */
app.get('/user/list', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		User.find({}, '_id first_name last_name activity', function (err, data) {
			var users = [];
			var commentCount = 0;

			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (data.length === 0) {
				response.status(500).send('Missing user list');
				return;
			}

			users = JSON.parse(JSON.stringify(data));

			async.each(
				users,
				function (user, callbackUsers) {
					Photo.find({ user_id: user._id }, function (error, photos) {
						user.countOfPhotos = photos.length;
					});

					Photo.find({}, function (error, allPhotos) {
						var photos = JSON.parse(JSON.stringify(allPhotos));

						photos.forEach((photo) => {
							photo.comments.forEach((comment) => {
								if (comment.user_id === user._id) {
									commentCount++;
								}
							});
						});
						user.countOfComments = commentCount;
						commentCount = 0;

						callbackUsers(error);
					});
				},
				function (error) {
					if (error) {
						response.status(500).send(JSON.stringify(error));
					} else {
						response.status(200).send(users);
					}
				},
			);
		});
	} else {
		response.status(401).send('User not logged in');
	}
});
/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var id = request.params.id;
		var user = {};

		User.findById(id, (err, data) => {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (data === null) {
				console.log(`User with _id: ${id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			user = JSON.parse(JSON.stringify(data));
			response.status(200).send(user);
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

/*
 * URL /photosOfUser/:id - Return the Photos for User (id)
 */
app.get('/photosOfUser/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var id = request.params.id;
		var photos = {};

		Photo.find({ user_id: id }, (err, data) => {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}

			if (data.length === 0) {
				console.log(`Photos of user with _id: ${id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			photos = JSON.parse(JSON.stringify(data));

			async.each(
				photos,
				function (photo, callbackPhoto) {
					async.each(
						photo.comments,
						function (comment, callbackComment) {
							User.findById(
								comment.user_id,
								'first_name last_name _id',
								function (error, userInfo) {
									comment.user = userInfo;
									callbackComment(error);
								},
							);
						},
						function (error) {
							if (error) {
								callbackPhoto(error);
							} else {
								callbackPhoto();
							}
						},
					);
				},
				function (error) {
					if (error) {
						response.status(500).send(JSON.stringify(error));
					} else {
						response.status(200).send(photos);
					}
				},
			);
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

app.get('/commentsOfUser/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var id = request.params.id;
		var photos = [];
		var comments = [];

		Photo.find({}, function (err, data) {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (data.length === 0) {
				console.log(`Comments of user with _id: ${id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			photos = JSON.parse(JSON.stringify(data));

			photos.forEach((photo) => {
				photo.comments.forEach((comment) => {
					if (comment.user_id === id) {
						let obj = {};
						obj._id = comment._id;
						obj.file_name = photo.file_name;
						obj.photo_id = photo._id;
						obj.comment = comment.comment;
						obj.date_time = comment.date_time;
						obj.user_id = comment.user_id;
						comments.push(obj);
					}
				});
			});

			response.status(200).send(comments);
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

app.get('/photo/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var id = request.params.id;
		var photo = {};

		Photo.findById(id, (err, data) => {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (data === null) {
				console.log(`Photo with _id: ${id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			photo = JSON.parse(JSON.stringify(data));

			async.each(
				photo.comments,
				function (comment, callbackComment) {
					User.findById(
						comment.user_id,
						'first_name last_name _id',
						function (error, userInfo) {
							comment.user = userInfo;
							callbackComment(error);
						},
					);
				},
				function (error) {
					if (error) {
						response.status(500).send(JSON.stringify(error));
					} else {
						response.status(200).send(photo);
					}
				},
			);
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

//Project 7
app.post('/admin/login', function (request, response) {
	User.findOne({ login_name: request.body.login_name }, function (err, data) {
		if (err) {
			response.status(500).send(JSON.stringify(err));
			return;
		}
		if (data === null) {
			console.log(`User with login name: ${request.body.login_name} not found.`);
			response.status(400).send('Not found');
			return;
		}

		var isMatch = cs142password.doesPasswordMatch(
			data.password_digets,
			data.salt,
			request.body.password,
		);

		if (isMatch) {
			request.session.user_id = data._id;
			request.session.login_name = data.login_name;
			data.activity = 'user logged in';
			data.save();
			response.status(200).send(JSON.parse(JSON.stringify(data)));
		} else {
			response.status(401).send('Password incorrect');
		}
	});
});

app.post('/admin/logout', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		User.findById(request.session.user_id, function (err, data) {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (data === null) {
				console.log(`User with _id: ${request.session.user_id} not found.`);
				response.status(400).send('Not found');
				return;
			}
			data.activity = 'user logged out';
			data.save();
		});
		delete request.session.user_id;
		delete request.session.login_name;

		request.session.destroy(function (err) {
			response.status(500).send(JSON.stringify(err));
		});
		response.status(200).send('User logged out');
	} else {
		response.status(400).send('User not logged in');
	}
});

app.post('/commentsOfPhoto/:photo_id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		User.findById(request.session.user_id, function (err, data) {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			data.activity = 'added a comment';
			data.save();
		});

		var photo_id = request.params.photo_id;
		Photo.findById(photo_id, function (err, data) {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (data === null) {
				console.log(`Photo with _id: ${photo_id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			var comment = {
				comment: request.body.comment,
				date_time: Date.now(),
				user_id: request.session.user_id,
			};
			data.comments.push(comment);

			data.save();
			response.status(200).send('Comment added');
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

app.post('/photos/new', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		processFormBody(request, response, function (err) {
			if (err || !request.file) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			const timestamp = new Date().valueOf();
			const filename = 'U' + String(timestamp) + request.file.originalname;

			User.findById(request.session.user_id, function (error, data) {
				if (error) {
					response.status(500).send(JSON.stringify(error));
					return;
				}
				data.activity = filename;
				data.save();
			});

			fs.writeFile(`./images/${filename}`, request.file.buffer, function (error) {
				if (error) {
					response.status(500).send(JSON.stringify(error));
					return;
				}

				Photo.create(
					{
						file_name: filename,
						date_time: Date.now(),
						user_id: request.session.user_id,
						comments: [],
					},
					function (e) {
						if (e) {
							response.status(400).send(JSON.stringify(e));
							return;
						}
						response.status(200).send('Photo uploaded');
					},
				);
			});
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

app.post('/user', function (request, response) {
	User.findOne({ login_name: request.body.login_name }, function (err, data) {
		if (err) {
			response.status(500).send(JSON.stringify(err));
			return;
		}

		if (data !== null) {
			response.status(400).send('User already exist');
			return;
		}
		var pwd = cs142password.makePasswordEntry(request.body.password);

		User.create(
			{
				first_name: request.body.first_name,
				last_name: request.body.last_name,
				location: request.body.location,
				description: request.body.description,
				occupation: request.body.occupation,
				login_name: request.body.login_name,
				password_digets: pwd.hash,
				salt: pwd.salt,
				activity: 'registered as a user',
			},
			function (error) {
				if (error) {
					response.status(400).send(JSON.stringify(error));
					return;
				}
				response.status(200).send('User registered. Please login now');
			},
		);
	});
});

//Project 8
app.delete('/photo/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var id = request.params.id;

		Photo.findByIdAndDelete(id, function (err, data) {
			if (err) {
				response.status(400).send(JSON.stringify(err));
				return;
			}
			if (data === null) {
				console.log(`Photo with _id: ${id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			fs.unlink(`./images/${data.file_name}`, function (error) {
				if (error) {
					response.status(500).send(JSON.stringify(error));
					return;
				}
				response.status(200).send('Photo deleted');
			});
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

app.delete('/comment/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var photo_id = request.params.id;
		var comment_id = request.body.comment_id;

		Photo.findById(photo_id, function (err, data) {
			if (err) {
				response.status(400).send(JSON.stringify(err));
				return;
			}
			if (data === null) {
				console.log(`Photo with _id: ${photo_id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			var index = data.comments.findIndex((comment) => comment._id === comment_id);
			data.comments.splice(index, 1);
			data.save();

			response.status(200).send('Comment deleted');
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

app.delete('/delete/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var id = request.params.id;
		Photo.updateMany({}, { $pull: { comments: { user_id: id } } }, function (err) {
			if (err) {
				response.status(400).send(JSON.stringify(err));
				return;
			}
			console.log('Comments of user deleted');
		});

		Photo.deleteMany({ user_id: id }, function (err) {
			if (err) {
				response.status(400).send(JSON.stringify(err));
				return;
			}
			console.log('Photos of user deleted');
		});

		User.deleteOne({ _id: id }, function (err) {
			if (err) {
				response.status(400).send(JSON.stringify(err));
				return;
			}
			response.status(200).send('User account deleted');
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

app.post('/like/:id', function (request, response) {
	if (request.session.login_name && request.session.user_id) {
		var photo_id = request.params.id;
		var user_id = request.session.user_id;

		Photo.findById(photo_id, function (err, data) {
			if (err) {
				response.status(500).send(JSON.stringify(err));
				return;
			}
			if (data === null) {
				console.log(`Photo with _id: ${photo_id} not found.`);
				response.status(400).send('Not found');
				return;
			}

			var index = data.likedBy.indexOf(user_id);

			if (request.body.like) {
				if (index >= 0) {
					response.status(400).send('User already liked this photo');
					return;
				}
				data.likedBy.push(user_id);
			} else {
				if (index === -1) {
					response.status(400).send('User have not like this photo');
					return;
				}
				data.likedBy.splice(index, 1);
			}
			data.save();
			response.status(200).send();
		});
	} else {
		response.status(401).send('User not logged in');
	}
});

var server = app.listen(3000, function () {
	var port = server.address().port;
	console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
