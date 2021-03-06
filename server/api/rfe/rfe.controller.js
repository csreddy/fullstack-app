'use strict';

var fs = require('fs');
var flash = require('connect-flash');
var marklogic = require('marklogic');
var conn = require('../../config/db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var p = marklogic.patchBuilder;
var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: 'RFE',
    serializers: {
        req: bunyan.stdSerializers.req
    }
});
var _ = require('lodash');
var async = require('async');
var _this = this;

// Get list of rfes
exports.index = function(req, res) {
    res.json([]);
};

// get rfe count
exports.count = function(req, res) {
    res.locals.errors = req.flash();

    db.documents.query(
        q.where(
            q.collection('rfes')
        )
        .slice(1, 1)
        .withOptions({
            debug: true,
            categories: 'metadata'
        })
    ).result(function(response) {
        // console.log(response);
        res.status(200).json({
            count: response[0].total
        });
    });
};

// get rfe details by id
exports.id = function(req, res) {
    res.locals.errors = req.flash();
    console.log(res.locals.errors);
    var uri = '/rfe/' + req.params.id + '/' + req.params.id + '.json';
    db.documents.probe(uri).result(function(document) {
        // console.log('document at ' + uri + ' exists: ' + document.exists);
        if (document.exists) {
            db.documents.read({
                uris: [uri]
            }).result(function(response) {
                //     console.log('from '+ uri, response);
                if (response.length === 1) {
                    res.status(200).json(response[0].content);
                }
            }, function(error) {
                res.status(error.statusCode).json({
                    error: 'error occured while retrieving ' + uri + '\n' + error
                })
            });

        } else {
            res.status(404).json({
                error: 'could not find rfe ' + req.params.id
            });
            //  res.redirect('/404'); 

        }
    }, function(error) {
        res.status(error.statusCode).json({
            error: 'could not find rfe ' + req.params.id
        });
    })

};

exports.new = function(req, res) {
    'use strict';
    console.log('inside NEW TASK');
    //console.log('FILES', req.files);
    var attachments = req.files;
    var errors = false;
    var id;
    var collections = ['rfes'];
    if (typeof req.body.rfe === 'object') {
        id = req.body.rfe.id;
        collections.push(req.body.rfe.submittedBy.username);
    } else {
        id = JSON.parse(req.body.rfe).id;
        collections.push(JSON.parse(req.body.rfe).submittedBy.username);
    }

      if (!id) {
        return res.status(500).json({error: 'rfe id was null'})
    }

    var uri = '/rfe/' + id + '/' + id + '.json';
    db.documents.write([{
        uri: uri,
        category: 'content',
        contentType: 'application/json',
        collections: collections,
        content: req.body.rfe
    }]).result(function(response) {
        console.log('wrote:\n    ' +
            response.documents.map(function(document) {
                return document.uri;
            }).join(', ')
        );
        res.send(200);
    }, function(error) {
        res.status(error.statusCode).json(error);
    });

    for (var file in attachments) {
        console.log(attachments[file]);
        var doc = {
            uri: '/rfe/' + id + '/attachments/' + attachments[file].originalname,
            category: 'content',
            contentType: attachments[file].mimetype,
            content: fs.createReadStream(attachments[file].path)
        };

        db.documents.write(doc).result(function(response) {
            console.log('wrote:\n ', JSON.stringify(response.documents[0]));
            res.send(200);
        }, function(error) {
            errors = true;
            res.send(400, {
                message: 'file upload failed. Try again'
            });
        });
    }

    for (var file in attachments) {
        // delete file from uploads dir after successfull upload
        fs.unlink(attachments[file].path, function(err) {
            if (err) throw err;
        });
    }

};

exports.update = function(req, res) {
    console.log('Inside update....');
    console.log(req.body);
    // res.json(req.body);
    var from = JSON.parse(req.body.old);
    var to = JSON.parse(req.body.rfe);
    var file = req.files;
    var uri = '/rfe/' + from.id + '/' + from.id + '.json';
    var updates = []
    var updateTime = new Date();

    var changes = {
        time: updateTime,
        updatedBy: {
            name: to.updatedBy.name,
            email: to.updatedBy.email,
            username: to.updatedBy.username
        },
        change: {},
        files: []
    }

    console.log('FILES', req.files);

    for (var prop in to) {
        switch (prop) {
            case 'status':
                if (from.status && from.status !== to.status) {
                    updates.push(p.replace('/status', to.status));
                    switch (to.status) {
                        case 'New':
                        case 'Verify':
                        case 'Test':
                        case 'Fix':
                        // remove these if they already exist
                        updates.push(p.remove('/shippedAt'))
                        updates.push(p.remove('/shippedBy'))
                        updates.push(p.remove('/closedAt'))
                        updates.push(p.remove('/closedBy'))
                        break;
                        case 'Ship':
                            if (from.shippedAt) {
                                updates.push(p.replace('/shippedAt', updateTime))
                            } else {
                                updates.push(p.insert('/createdAt', 'after', {
                                    shippedAt: updateTime
                                }));
                            }
                            if (from.shippedBy) {
                                updates.push(p.replace('/shippedBy', updateTime))
                            } else {
                                updates.push(p.insert('/submittedBy', 'after', {
                                    shippedBy: changes.updatedBy
                                }));
                            }
                            break;
                        case 'Closed':
                            if (from.closedAt) {
                                updates.push(p.replace('/closedAt', updateTime))
                            } else {
                                updates.push(p.insert('/createdAt', 'after', {
                                    closedAt: updateTime
                                }));
                            }
                            if (from.closedBy) {
                                updates.push(p.replace('/closedBy', updateTime))
                            } else {
                                updates.push(p.insert('/submittedBy', 'after', {
                                    closedBy: changes.updatedBy
                                }));
                            }
                            break;
                        default:
                            // do nothing       
                    }

                    changes.change.status = {
                        from: from.status,
                        to: to.status
                    };
                }
                break;
            case 'severity':
                if (from.severity !== to.severity) {
                    updates.push(p.replace('/severity', to.severity));
                    changes.change.severity = {
                        from: from.severity,
                        to: to.severity
                    };
                }
                break;
            case 'category':
                if (from.category !== to.category) {
                    updates.push(p.replace('/category', to.category));
                    changes.change.category = {
                        from: from.category,
                        to: to.category
                    };
                }
                break;
            case 'priority':
                if (from.priority.level !== to.priority.level) {
                    updates.push(p.replace('/priority/level', to.priority.level));
                    updates.push(p.replace('/priority/title', to.priority.title));
                    changes.change.priority = {
                        from: from.priority,
                        to: to.priority
                    };
                }
                break;
            case 'version':
                if (from.version !== to.version) {
                    updates.push(p.replace('/version', to.version));
                    changes.change.version = {
                        from: from.version,
                        to: to.version
                    };
                }
                break;
            case 'tofixin':
                if (from.tofixin !== to.tofixin) {
                    updates.push(p.replace('/tofixin', to.tofixin));
                    changes.change.tofixin = {
                        from: from.tofixin,
                        to: to.tofixin
                    };
                }
                break;
            case 'fixedin':
                if (from.fixedin !== to.fixedin) {
                    updates.push(p.replace('/fixedin', to.fixedin));
                    changes.change.fixedin = {
                        from: from.fixedin,
                        to: to.fixedin
                    };
                }
                break;
            case 'days':
                if (from.days !== to.days) {
                    updates.push(p.replace('/days', to.days));
                    changes.change.days = {
                        from: from.days,
                        to: to.days
                    };
                }
                break;
            case 'period':
                if (from.period.startDate !== to.period.startDate) {
                    updates.push(p.replace('/period/startDate', to.period.startDate));
                    changes.change.startDate = {
                        from: from.period.startDate,
                        to: to.period.startDate
                    };
                }
                if (from.period.endDate !== to.period.endDate) {
                    updates.push(p.replace('/period/endDate', to.period.endDate));
                    changes.change.endDate = {
                        from: from.period.endDate,
                        to: to.period.endDate
                    };
                }
                break;
            case 'assignTo':
                if (from.assignTo.username !== to.assignTo.username) {
                    updates.push(p.replace('/assignTo/username', to.assignTo.username));
                    updates.push(p.replace('/assignTo/email', to.assignTo.email));
                    updates.push(p.replace('/assignTo/name', to.assignTo.name));
                    for (var i = 0; i < to.subscribers.length; i++) {
                        // check if the user has already subscribed
                        if (to.subscribers[i].username === to.assignTo.username) {
                            break;
                        }
                        // if user has not subscribed then subscribe at the last iteration
                        if (i === to.subscribers.length - 1) {
                            updates.push(p.insert("array-node('subscribers')", 'last-child', to.assignTo));
                        }
                    }

                    changes.change.assignTo = {
                        from: from.assignTo,
                        to: to.assignTo
                    };

                }
                break;
            case 'comment':
                if (to.comment.length > 0) {
                    changes.comment = to.comment;
                }
                break;
            case 'subscribers':
                var userIndex = _.findIndex(from.subscribers, function(user) {
                    return user.username == changes.updatedBy.username;
                });
                if (userIndex === -1) {
                    updates.push(p.insert("array-node('subscribers')", 'last-child', changes.updatedBy))
                }
                break;
            case 'svninfo':
                if (true) {
                    // TODO
                }
                break;
            default:
                break;
                // do nothing
        }

    }

    if (Object.keys(req.files).length > 0) {
        for (var file in req.files) {
            var fileObj = {
                name: req.files[file].originalname,
                uri: '/rfe/' + to.id + '/attachments/' + req.files[file].originalname
            }
            updates.push(p.insert("array-node('attachments')", 'last-child', fileObj));
            changes.files.push(fileObj);
        }
    }


    if (Object.keys(req.files).length > 0) {
        for (var file in req.files) {
            console.log(req.files[file]);
            var doc = {
                uri: '/rfe/' + to.id + '/attachments/' + req.files[file].originalname,
                category: 'content',
                contentType: req.files[file].mimetype,
                content: fs.createReadStream(req.files[file].path)
            };

            db.documents.write(doc).result(function(response) {
                console.log('wrote:\n ', JSON.stringify(response.documents[0]));
                // res.send(200);
            }, function(error) {
                errors = true;
                res.send(400, {
                    message: 'file upload failed. Try again'
                });
            });
        }

        for (var i in req.files) {
            // delete file from uploads dir after successfull upload
            fs.unlink(req.files[i].path, function(err) {
                if (err) throw err;
            });
        }
    }

    updates.push(p.insert("array-node('changeHistory')", 'last-child', changes))

    db.documents.patch(uri, updates).result(function(response) {
        res.status(200).json({
            message: 'rfe updated'
        })
    }, function(error) {
        console.log(error);
        res.status(500).json({
            message: 'rfe update failed\n' + error
        })
    });

};

exports.insertSubTask = function(req, res) {
    var uri = '/rfe/' + req.body.parentTaskId + '/' + req.body.parentTaskId + '.json';
    db.documents.probe(uri).result(function(response) {
        if (response.exists) {
            db.documents.patch(uri, p.insert("array-node('subTasks')", 'last-child', parseInt(req.body.subTaskId))).result(function(response) {
                res.status(200).json({
                    message: 'Sub Task inserted'
                })
            }, function(error) {
                res.status(error.statusCode).json(error);
            });
        } else {
            res.status(404).json({
                message: 'Parent task ' + req.body.parentTaskId + ' does not exist'
            })
        }
    });
};

exports.insertProceduralTask = function(req, res) {
    // rfe because, procedural tasks can be added for RFEs only
    var uri = '/rfe/' + req.body.parentTaskId + '/' + req.body.parentTaskId + '.json';
    db.documents.probe(uri).result(function(response) {
        if (response.exists) {
            db.documents.patch(uri, p.insert("proceduralTasks/array-node(\"" + req.body.proceduralTaskType + "\")", 'last-child', parseInt(req.body.proceduralTaskId))).result(function(response) {
                res.status(200).json({
                    message: 'Procedural Task inserted'
                })
            }, function(error) {
                res.status(error.statusCode).json(error);
            });
        } else {
            res.status(404).json({
                message: 'RFE ' + req.body.parentTaskId + ' does not exist. '
            })
        }
    });
};

exports.subtasks = function(req, res, next) {
    var uri = '/rfe/' + req.params.id + '/' + req.params.id + '.json'
        // check if doc exists
    db.documents.probe(uri).result(function(response) {
        if (response.exists) {
            // do nothing, proceed further
        } else {
            res.redirect('/404');
            next();
        }
    });

    db.documents.read({
        uris: [uri]
    }).result(function(document) {
        console.log('document', document);
        var subTasks = document[0].content.subTasks;
        var subTaskDocUris = [];
        if (subTasks.length > 0) {
            subTasks = subTasks.sort();
            for (var i = 0; i < subTasks.length; i++) {
                subTaskDocUris.push('/task/' + subTasks[i] + '/' + subTasks[i] + '.json')
            }
        }

        if (subTaskDocUris.length > 0) {
            db.documents.read({
                uris: subTaskDocUris
            }).result(function(documents) {
                //  console.log('documents', documents);
                subTasks = [];
                if (documents.length > 0) {
                    for (var i = 0; i < documents.length; i++) {
                        subTasks.push({
                            id: documents[i].content.id,
                            title: documents[i].content.title,
                            note: documents[i].content.note,
                            status: documents[i].content.status,
                            category: documents[i].content.category,
                            days: documents[i].content.days,
                            period: {
                                startDate: documents[i].content.period.startDate,
                                endDate: documents[i].content.period.endDate
                            },
                            version: documents[i].content.version,
                            tofixin: documents[i].content.tofixin,
                            proceduralTasks: documents[i].content.proceduralTasks,
                            subTasks: documents[i].content.subTasks,
                            assignTo: documents[i].content.assignTo
                        })
                    }
                }

                res.status(200).json(subTasks)
            }, function(error) {
                res.status(error.statusCode).json(error)
            })
        } else {
            res.status(200).json([])
        }

    }, function(error) {
        res.status(error.statusCode).json(error);
    })
};

exports.subscribe = function(req, res) {
    var uri = '/rfe/' + req.body.id + '/' + req.body.id + '.json';
    db.documents.patch(uri, p.insert("array-node('subscribers')", 'last-child', req.body.user)).result(function(response) {
        res.status(200).json({
            message: 'RFE subscribed'
        })
    }, function(error) {
        res.status(error.statusCode).json(JSON.stringify(error));
    });
};


exports.unsubscribe = function(req, res) {
    console.log('unsubscribe', req.body);
    var uri = '/rfe/' + req.body.id + '/' + req.body.id + '.json';
    db.documents.patch(uri, p.remove("subscribers[username eq '" + req.body.user.username + "']")).result(function(response) {
        res.status(200).json({
            message: 'RFE unsubscribed'
        })
    }, function(error) {
        res.status(400).json({
            message: error
        });
    });
};


exports.getParentAndSubTasks = function(req, res) {
    var version = req.params.version;
    var criteria = [];
    var parents = [];
    var subtasks = [];
    if (version === 'all') {
        criteria = [q.collection('rfes'), q.collection('tasks'), q.scope('parent', q.value('taskId', ''))]
    } else {
        criteria = [q.collection('rfes'), q.collection('tasks'), q.value('version', version), q.scope('parent', q.value('taskId', ''))]
    }

    function formatDoc(result) {
        return {
            id: result.content.id,
            title: result.content.title,
            note: result.content.note,
            status: result.content.status,
            days: result.content.days,
            period: {
                startDate: result.content.period.startDate,
                endDate: result.content.period.endDate
            },
            version: result.content.version,
            tofixin: result.content.tofixin,
            proceduralTasks: result.content.proceduralTasks,
            subTasks: result.content.subTasks
        }
    }

    function getParentTasks(criteria) {
        db.documents.query(
            q.where(criteria)
            .orderBy(
                q.sort('id', 'ascending')
            )
            .slice(1, 99999) // q.extract(['/id', '/title', '/status','/days', '/version', '/tofixin', '/note'])
            .withOptions({
                debug: true,
                metrics: true,
                category: 'content'
            })
        ).result(function(result) {
            result.shift() // remove metadata info from the result set
            for (var i = 0; i < result.length; i++) {
                parents.push(formatDoc(result[i]))
            }

            async.each(parents, function(parent, callback) {
                var uris = []
                for (var i = 0; i < parent.subTasks.length; i++) {
                    uris.push('/task/' + parent.subTasks[i] + '/' + parent.subTasks[i] + '.json')
                };

                // for each parent, get their corresponding sub tasks

                db.documents.read({
                    uris: uris
                }).result(function(result) {
                    var subtasks = [];
                    for (var i = 0; i < result.length; i++) {
                        subtasks.push(formatDoc(result[i]))
                    };
                    console.log('subTasks', subtasks);
                    parent.subTasks = subtasks;
                    callback();
                }, function(error) {
                    callback();
                });
            }, function(error) {
                if (error) res.status(error.statusCode).json(error);
                res.status(200).json(parents)
            })

            // res.status(200).json(parents)    
        }, function(error) {
            res.status(error.statusCode).json(error);
        })
    }

    function getSubTasks(parent, callback) {
        var uris = []
        subtasks = [];
        for (var i = 0; i < parent.subTasks.length; i++) {
            uris.push('/task/' + parent.subTasks[i] + '/' + parent.subTasks[i] + '.json')
        };
        db.documents.read({
            uris: uris
        }).result(function(result) {
            for (var i = 0; i < result.length; i++) {
                subtasks.push(formatDoc(result[i]))
            };
            console.log('subTasks', subtasks);
            parent.subTasks = subtasks;
            callback();
        }, function(error) {
            console.log(error);
        })
    }

    getParentTasks(criteria)

};