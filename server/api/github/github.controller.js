'use strict';

var marklogic = require('marklogic');
var conn = require('../../config/db-config.js').connection;
var db = marklogic.createDatabaseClient(conn);
var q = marklogic.queryBuilder;
var p = marklogic.patchBuilder;
var request = require('request');
var async = require('async');
var _ = require('lodash');

var bug = require('../bug/bug.controller');

var bugList = "https://api.github.com/repos/marklogic/java-client-api/issues/";
var githubAuth = {
    user: 'sudhakarsjce@gmail.com',
    pass: '****'
}
var githubLabels = {
    all: ['Bug', 'Enhancement', 'Task', 'new', 'verify', 'test', 'fix', 'ship', 'closed', 'external', 'will not fix', 'catastrophic', 'critical', 'major', 'minor', 'aesthetic', 'performance'],
    kind: ['Bug', 'Enhancement', 'Task'],
    status: ['new', 'verify', 'test', 'fix', 'ship', 'closed', 'external', 'will not fix'],
    severity: ['catastrophic', 'critical', 'major', 'minor', 'aesthetic', 'performance']
}

// Get list of githubs
exports.index = function(req, res) {
    res.json([]);
};

exports.listTransformedGitHubBugs = function(req, res) {
    var _project = req.query.project || null;
    var _sort = req.query.sort || 'created';
    var _order = req.query.order || 'asc';
    var _page = req.query.page || 1;
    var _per_page = req.query.per_page || 25;
    var finalResult = []
        // url: 'https://api.github.com/repos/marklogic/' + req.query.project + '/issues?page=' + _page + '&per_page=' + _per_page,
    var options = {
        url: 'https://api.github.com/search/issues?q=repo:marklogic/' + _project + '&sort=' + _sort + '&order=' + _order + '&page=' + _page + '&per_page=' + _per_page,
        headers: {
            'User-Agent': req.query.project
        },
        auth: githubAuth
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
            return res.send(error);
        }

        if (!error && response.statusCode === 200) {
            var issues = JSON.parse(response.body)

            async.waterfall([
                    // get events and comments for all bugs and return the final processes list of bugs
                    function getEventsAndCommentsForAllBugs(callback) {
                        issues.forEach(function getEventsAndComments(issue, index) {
                            // for each bug, get comments and events
                            async.parallel([

                                function getEvents(parallelCallback) {
                                    var options = {
                                        url: issue.events_url,
                                        headers: {
                                            'User-Agent': getProjectNameFromURL(issue.events_url)
                                        },
                                        auth: githubAuth
                                    };
                                    request(options, function(error, response, body) {
                                        if (error) {
                                            console.log('ERROR', error);
                                            parallelCallback(error)
                                        }
                                        if (response.statusCode === 200) {
                                            // console.log('events:', body);
                                            parallelCallback(null, body)

                                        }


                                    })
                                },
                                function getComments(parallelCallback) {
                                    var options = {
                                        url: issue.comments_url,
                                        headers: {
                                            'User-Agent': getProjectNameFromURL(issue.comments_url)
                                        },
                                        auth: githubAuth
                                    };
                                    request(options, function(error, response, body) {
                                        if (error) {
                                            console.log('ERROR', error);
                                            parallelCallback(error)
                                        }
                                        if (response.statusCode === 200) {
                                            //  console.log('comments:', body);
                                            parallelCallback(null, body)
                                        }


                                    })
                                }
                            ], function attachEventsAndComments(err, result) {
                                if (err) {
                                    console.log('ERROR:', err);
                                    callback(err);
                                }
                                console.log('parallel process done');
                                var bugtrackItem = _.cloneDeep(issue);
                                issue.eventList = JSON.parse(result[0]);
                                issue.commentList = JSON.parse(result[1]);

                                bugtrackItem.changeHistory = processEventList(issue.eventList);
                                var commentList = processCommentList(issue.commentList);
                                commentList.forEach(function(comment) {
                                    bugtrackItem.changeHistory.push(comment);
                                })

                                bugtrackItem.changeHistory = sortChangeHistory(bugtrackItem.changeHistory);

                                var newBug = convertToBugtrackItem(bugtrackItem)
                                finalResult.push(newBug);

                                console.log('finalResult length = ', finalResult.length);
                                if (finalResult.length === issues.length) {
                                    callback(null, finalResult)
                                }
                            }) // parallel end
                        }) // forEach end
                    }
                ],
                function processedBugs(err, result) {
                    if (err) {
                        res.send(err);
                    }
                    console.log('waterfall done');
                    console.log('LENGTH = ', result.length);
                    res.send(result);
                }) // waterfall end

        } // if end
    }) // request end

}

exports.listGitHubBugs = function(req, res) {
    var _project = req.query.project || null;
    var _sort = req.query.sort || 'created';
    var _order = req.query.order || 'asc';
    var _page = req.query.page || 1;
    var _per_page = req.query.per_page || 25;
    var _transform = req.query.transform || false;

    var finalResult = []
        //console.log('url:', 'https://api.github.com/repos/marklogic/' + req.query.project + '/issues?page=' + _page + '&per_page=' + _per_page);
        // https://api.github.com/search/issues?q=repo:marklogic/java-client-api&sort=created&order=asc&page=1&per_page=10
    var options = {
        url: 'https://api.github.com/search/issues?q=repo:marklogic/' + _project + '&sort=' + _sort + '&order=' + _order + '&page=' + _page + '&per_page=' + _per_page + '&transform=' + _transform,
        headers: {
            'User-Agent': req.query.project
        },
        auth: githubAuth
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
            return res.send(error);
        }

        if (!error && response.statusCode === 200) {
            var issues = JSON.parse(body).items
            var finalResult = [];
            async.times(issues.length, function(n, next) {
                getEventsAndComments(issues[n], function(err, issue) {
                    if (_transform) {
                        finalResult.push(convertToBugtrackItem(issue));
                    } else {
                        finalResult.push(issue);
                    }
                    next(err, issue);
                })
            }, function(err, issues) {
                if (err) {
                    res.send(err)
                }
                res.send(finalResult)
            })

        } // if end

    }) // request end
}

exports.transformAndLoadGitHubBugs = function(req, res) {
    var _project = req.query.project || null;
    var _sort = req.query.sort || 'created';
    var _order = req.query.order || 'asc';
    var _page = req.query.page || 1;
    var _per_page = req.query.per_page || 25;

    var finalResult = []
        //console.log('url:', 'https://api.github.com/repos/marklogic/' + req.query.project + '/issues?page=' + _page + '&per_page=' + _per_page);
        // https://api.github.com/search/issues?q=repo:marklogic/java-client-api&sort=created&order=asc&page=1&per_page=10
    var options = {
        url: 'https://api.github.com/search/issues?q=repo:marklogic/' + _project + '&sort=' + _sort + '&order=' + _order + '&page=' + _page + '&per_page=' + _per_page,
        headers: {
            'User-Agent': req.query.project
        },
        auth: githubAuth
    };

    request(options, function(error, response, body) {
        if (error) {
            console.log(error);
            return res.send(error);
        }

        if (!error && response.statusCode === 200) {
            var issues = JSON.parse(body).items
            var transformedIssues = [];
            async.times(issues.length, function(n, next) {
                getEventsAndComments(issues[n], function(err, issue) {
                    transformedIssues.push(convertToBugtrackItem(issue));
                    next(err, issue);
                })
            }, function(err, issues) {
                if (err) {
                    res.send(err)
                }

                var cargo = async.cargo(function(tasks, callback) {
                    for (var i = 0; i < tasks.length; i++) {
                        insertIssueIntoBugtrack(tasks[i], req, res, function(err, result) {
                            if (err) {
                                res.send(err)
                            }
                            //  console.log('result:', result);
                            finalResult.push(result)
                            // console.log('finalResult:' + finalResult.length + 'transformedIssues.length:' + transformedIssues.length);
                            if (finalResult.length === transformedIssues.length) {
                                res.send(_.sortBy(finalResult, 'id'))
                            }
                        });
                    }
                    callback();
                }, 1);

                transformedIssues.forEach(function(issue) {
                    cargo.push(issue);
                })
            })

        } // if end

    }) // request end
}





exports.getGitHubIssue = function(req, res) {
    var _project = req.query.project || null;
    var _issueId = req.query.id || null;
    var _transform = req.query.transform || false;
    var _url = 'https://api.github.com/repos/marklogic/' + _project + '/issues/' + _issueId + '&transform=' + _transform
    var options = {
        url: _url,
        headers: {
            'User-Agent': _project
        },
        auth: githubAuth
    };
    async.waterfall([

        function(waterfallCallback) {
            getIssue(options, waterfallCallback);
        },
        function(issue, waterfallCallback) {
            getEventsAndComments(issue, waterfallCallback)
        }
    ], function end(err, item) {
        if (err) {
            return res.status(404).json({
                error: 'Not Found'
            })
        }
        if (_transform) {
            res.send(convertToBugtrackItem(item));
        } else {
            res.send(item);
        }

    })
};

exports.transformGitHubIssue = function(req, res) {
    var _project = req.query.project || null
    var _issueId = req.query.id || null
    var _url = 'https://api.github.com/repos/marklogic/' + _project + '/issues/' + _issueId;
    var options = {
        url: _url,
        headers: {
            'User-Agent': _project
        },
        auth: githubAuth
    };
    async.waterfall([

        function(waterfallCallback) {
            getIssue(options, waterfallCallback);
        },
        function(issue, waterfallCallback) {
            getEventsAndComments(issue, waterfallCallback)
        },
        function(issue, waterfallCallback) {
            convertToBugtrackItem(issue, waterfallCallback)
        },
        function(transformedItem, waterfallCallback) {
            attachNewBugtrackId(transformedItem, req, waterfallCallback);
        }

    ], function end(err, item) {
        if (err) {
            return res.status(404).json({
                error: 'Not Found'
            })
        }
        res.send(item);
    })
};


exports.loadGitHubIssue = function(req, res) {
    var _project = req.query.project || null
    var _issueId = req.query.id || null
    var _url = 'https://api.github.com/repos/marklogic/' + _project + '/issues/' + _issueId;
    var options = {
        url: _url,
        headers: {
            'User-Agent': _project
        },
        auth: githubAuth
    };
    async.waterfall([

        function(waterfallCallback) {
            getIssue(options, waterfallCallback);
        },
        function(issue, waterfallCallback) {
            getEventsAndComments(issue, waterfallCallback)
        },
        function(issue, waterfallCallback) {
            convertToBugtrackItem(issue, waterfallCallback)
        },
        function(transformedItem, waterfallCallback) {
            attachNewBugtrackId(transformedItem, req, waterfallCallback);
        }

    ], function end(err, item) {
        if (err) {
            return res.status(404).json({
                error: 'Issue not found'
            })
        }
        insertIssueIntoBugtrack(item, req, res, function(err, result) {
            if (err) {
                res.send(err);
            }
            res.send(result);
        });
    })
};

function insertTransformedGitHubIssue(issue, req, res) {
    async.waterfall([

        function(issue, waterfallCallback) {
            attachNewBugtrackId(issue, req, waterfallCallback);
        }

    ], function end(err, item) {
        if (err) {
            return res.status(404).json({
                error: 'Not Found'
            })
        }
        insertIssueIntoBugtrack(item, req, res, function(err, result) {
            if (err) return err;
            return result;
        });
    })
}


function getGitHubUserInfo(username, callback) {
    var _url = 'https://api.github.com/users/' + username;
    var options = {
        url: _url,
        /*headers: {
            'User-Agent': _project
        },*/
        auth: githubAuth
    };
    request(options, function(err, response, body) {
        if (err) {
            if (callback) {
                callback(err)
            } else {
                return err;
            }
        }
        if (response.statusCode === 200) {
            var _body = JSON.parse(body)
            var userInfo = {
                username: username,
                name: _body.name,
                email: _body.email
            }
            if (callback) {
                callback(null, userInfo)
            } else {
                return userInfo;
            }
        } else {
            if (callback) {
                callback({
                    error: 'could not get user info'
                })
            } else {
                return {
                    error: 'could not get user info'
                };
            }
        }
    })
}

function insertIssueIntoBugtrack(item, req, res, callback) {
    console.log('called insertIssueIntoBugtrack');
    var action = {
        githubId: item.github.issueId,
        bugtrackId: item.id,
        message: null
    }
    async.waterfall([

        function checkIfBugExists(callback) {
            isBugExistsInBugtrack(item, callback);
        },
        function insertOrUpdate(bug, callback) {
            var baseUri = req.protocol + '://' + req._remoteAddress + ':' + req.headers.host.replace(/(\S*:)(\d*)/, '$2')
            var key = null;
            var options = {};
            options.method = 'POST';


            if (bug) {
                // TODO: update existing bug & also preserve any changes that were made in bugtrack
                action.message = 'updated existing issue';
                action.bugtrackId = bug.id
                callback(null, bug);
            } else {
                action.message = 'created new issue';
                switch (item.kind) {
                    case 'Bug':
                        options.uri = baseUri + '/api/bugs/new';
                        options.json = {
                            bug: item
                        };
                        createNewBug(item, req, callback)
                        break;
                    case 'Task':
                        options.uri = baseUri + '/api/tasks/new';
                        options.json = {
                            task: item
                        };
                        createNewTask(item, req, callback)
                        break;
                    case 'RFE':
                        options.uri = baseUri + '/api/rfes/new';
                        options.json = {
                            rfe: item
                        };
                        createNewRFE(item, req, callback)
                        break;
                    default:
                        console.log('Issue #' + item.github.issueId + ' kind is unknown');
                        return res.status(500).json({
                            error: 'Issue #' + item.github.issueId + ' kind is unknown'
                        })
                }
            }

        }
    ], function done(err, result) {
        if (err) {
            console.log(err);
            return res.send(err)
        }
        //return res.status(200).json(action);
        console.log('result----', result);
        action.bugtrackId = result.id
        return callback(null, action);
    })
}

function attachNewBugtrackId(issue, req, callback) {
    request.get(req.protocol + '://' + req._remoteAddress + ':' + req.headers.host.replace(/(\S*:)(\d*)/, '$2') + '/api/common/nextId', function(err, response, body) {
        if (callback) {
            if (err) {
                return callback(err);
            }
            issue.id = JSON.parse(body).nextId

            return callback(null, issue);
        } else {
            if (err) {
                return err;
            }
            issue.id = JSON.parse(body).nextId
            return issue;
        }
    })
}


function getIssue(options, callback) {
    request(options, function(err, response, body) {
        if (err) {
            console.log(err);
            return callback(err)
        }

        if (JSON.parse(body).message === 'Not Found') {
            return callback(JSON.parse(body).message, null)
        } else {
            return callback(null, JSON.parse(body));
        }
    });
}


function getEventsAndComments(issue, callback) {
    //  console.log('issue', issue);
    async.parallel({
        eventList: function(parallelCallback) {
            var options = {
                url: issue.events_url,
                headers: {
                    'User-Agent': getProjectNameFromURL(issue.events_url)
                },
                auth: githubAuth
            };
            request(options, function(error, response, body) {
                if (error) {
                    console.log('ERROR from eventList', error);
                    parallelCallback(error)
                }
                if (response.statusCode === 200) {
                    // console.log('events:', body);
                    parallelCallback(null, body)

                }
            })
        },
        commentList: function(parallelCallback) {
            var options = {
                url: issue.comments_url,
                headers: {
                    'User-Agent': getProjectNameFromURL(issue.comments_url)
                },
                auth: githubAuth
            };
            request(options, function(error, response, body) {
                if (error) {
                    console.log('ERROR from commentList', error);
                    parallelCallback(error)
                }
                if (response.statusCode === 200) {
                    //  console.log('comments:', body);
                    parallelCallback(null, body)
                }
            })
        }
    }, function attachEventsAndComments(err, result) {
        if (err) {
            console.log('ERROR from attachEventsAndComments', err);
            if (callback) {
                return callback(err)
            }
            return err
        }
        issue.eventList = JSON.parse(result.eventList);
        issue.commentList = JSON.parse(result.commentList);

        // console.log('Issue:', issue);
        if (callback) return callback(null, issue)
        return issue;

    })
}


function isBugExistsInBugtrack(bug, callback) {
    db.documents.query(
        q.where(
            q.parsedFrom('gh:' + bug.github.issueId, q.parseBindings(q.range(q.pathIndex('/github/issueId'), q.bind('gh'))))
        ))
        .result(function(result) {
            //console.log('result', result);

            if (result.length === 0) {
                return callback(null, null)
            } else {
                var _uri = result[0].uri
                console.log('search result', _uri);
                if (_uri) {
                    console.log('bug exists');
                    return callback(null, result[0].content)
                } else {
                    console.log('bug does not exist');
                    return callback(null, null);
                }
            }
        }, function(err) {
            return callback(err)
        })
}


function getNextId(req, callback) {
    request.get(req.protocol + '://' + req._remoteAddress + ':' + req.headers.host.replace(/(\S*:)(\d*)/, '$2') + '/api/common/nextId', function(err, response, body) {
        if (callback) {
            if (err) {
                console.log(err);
                return callback(err);
            }
            return callback(null, JSON.parse(body).nextId)
        } else {
            if (err) {
                console.log(err);
                return err;
            }
            return JSON.parse(body).nextId;
        }


    })
}

function createNewBug(bug, req, callback) {
    // insert new bug
    async.waterfall([

        function getId(waterfallCallback) {
            getNextId(req, waterfallCallback)
        },
        function insert(id, waterfallCallback) {
            bug.id = parseInt(id);
            createBug(bug, req, waterfallCallback);
        }
    ], function end(err, result) {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}

// insert new task
function createNewTask(task, req, callback) {
    async.waterfall([

        function getId(waterfallCallback) {
            getNextId(req, waterfallCallback)
        },
        function insert(id, waterfallCallback) {
            task.id = parseInt(id);
            createTask(task, req, waterfallCallback);
        }
    ], function end(err, result) {
        if (err) {
            return callback(err)
        }
        console.log('create new Task', result);
        return callback(null, result)
    })
}
// insert new rfe
function createNewRFE(rfe, req, callback) {
    async.waterfall([

        function getId(waterfallCallback) {
            getNextId(req, waterfallCallback)
        },
        function insert(id, waterfallCallback) {
            rfe.id = parseInt(id);
            createRFE(rfe, req, waterfallCallback);
        }
    ], function end(err, result) {
        if (err) {
            return callback(err)
        }
        return callback(null, result)
    })
}

function createBug(bug, req, callback) {
    request({
        method: 'POST',
        uri: req.protocol + '://' + req._remoteAddress + ':' + req.headers.host.replace(/(\S*:)(\d*)/, '$2') + '/api/bugs/new',
        json: {
            'bug': bug
        }
    }, function(err, response, body) {
        if (callback) {
            if (err) {
                console.error('could not create bug-' + bug.id, err);
                return callback(err);
            }

            if (response.statusCode !== 200) {
                return callback({
                    error: 'could not create bug-' + bug.id
                })
            }

            console.log('bug created successfully');
            return callback(null, {
                id: bug.id,
                msg: 'bug-' + bug.id + ' created successfully'
            });
        } else {

            if (err) {
                console.error('could not create bug-' + bug.id, err);
                return err;
            }

            if (response.statusCode !== 200) {
                return {
                    error: 'could not create bug-' + bug.id
                }
            }
            console.log('bug created successfully');
            return {
                id: bug.id,
                msg: 'bug-' + bug.id + ' created successfully'
            }
        }

    })
}

function createTask(task, req, callback) {
    request({
        method: 'POST',
        uri: req.protocol + '://' + req._remoteAddress + ':' + req.headers.host.replace(/(\S*:)(\d*)/, '$2') + '/api/tasks/new',
        json: {
            'task': task
        }
    }, function(err, response, body) {
        if (callback) {
            if (err) {
                console.error('could not create task-' + task.id, err);
                return callback(err);
            }

            if (response.statusCode !== 200) {
                return callback({
                    error: 'could not create task-' + task.id
                })
            }

            console.log('task created successfully');
            return callback(null, {
                id: task.id,
                msg: 'task-' + task.id + ' created successfully'
            });
        } else {

            if (err) {
                console.error('could not create task-' + task.id, err);
                return err;
            }

            if (response.statusCode !== 200) {
                return {
                    error: 'could not create task-' + task.id
                }
            }
            console.log('task created successfully');
            return {
                id: task.id,
                msg: 'task-' + task.id + ' created successfully'
            }
        }

    })
}

function createRFE(rfe, req, callback) {
    request({
        method: 'POST',
        uri: req.protocol + '://' + req._remoteAddress + ':' + req.headers.host.replace(/(\S*:)(\d*)/, '$2') + '/api/rfes/new',
        json: {
            'rfe': rfe
        }
    }, function(err, response, body) {
        if (callback) {
            if (err) {
                console.error('could not create rfe-' + rfe.id, err);
                return callback(err);
            }

            if (response.statusCode !== 200) {
                return callback({
                    error: 'could not create rfe-' + rfe.id
                })
            }

            console.log('rfe created successfully');
            return callback(null, {
                id: rfe.id,
                msg: 'rfe-' + rfe.id + ' created successfully'
            });
        } else {

            if (err) {
                console.error('could not create rfe-' + rfe.id, err);
                return err;
            }

            if (response.statusCode !== 200) {
                return {
                    error: 'could not create rfe-' + rfe.id
                }
            }
            console.log('rfe created successfully');
            return {
                id: rfe.id,
                msg: 'rfe-' + rfe.id + ' created successfully'
            }
        }

    })
}

function getProjectNameFromURL(url) {

    return url.replace(/(https:\/\/api\.github\.com\/repos\/marklogic\/)(\S*)\/issues\/\S*/, '$2');
}

function processEventList(eventList) {
    var changeHistory = [];
    var change = {};
    eventList.forEach(function(eventItem) {
        switch (eventItem.event) {
            case 'labeled':
            case 'unlabeled':
                var changeName = null;
                if (githubLabels.kind.indexOf(eventItem.label.name) > -1) {
                    changeName = 'kind';
                }
                if (githubLabels.status.indexOf(eventItem.label.name) > -1) {
                    changeName = 'status';
                }
                if (githubLabels.severity.indexOf(eventItem.label.name) > -1) {
                    changeName = 'severity';
                }

                // enahncements are added as rfes
                if (eventItem.label.name === 'Enhancement') {
                    eventItem.label.name = 'RFE';
                }

                change = {
                    time: eventItem.created_at,
                    updatedBy: {
                        username: eventItem.actor.login,
                        name: eventItem.actor.login
                    }
                }
                change['change'] = {};
                change.change[changeName] = {
                    from: null,
                    to: eventItem.label.name
                }
                changeHistory.push(change);
                change = {}
                break;
            case 'assigned':
                change = {
                    time: eventItem.created_at,
                    updatedBy: {
                        username: eventItem.actor.login,
                        name: eventItem.actor.login
                    },
                    change: {
                        assignTo: {
                            from: null,
                            to: {
                                username: eventItem.assignee.login,
                                name: eventItem.assignee.login
                            }
                        }
                    }
                }
                changeHistory.push(change);
                change = {}
                break;
            case 'unassigned':
                change = {
                    time: eventItem.created_at,
                    updatedBy: {
                        username: eventItem.actor.login,
                        name: eventItem.actor.login
                    },
                    change: {
                        assignTo: {
                            from: {
                                username: eventItem.assignee.actor,
                                name: eventItem.assignee.actor,
                            },
                            to: {
                                "username": "nobody",
                                "email": "nobody@marklogic.com",
                                "name": "nobody nobody"
                            }
                        }
                    }

                }
                changeHistory.push(change);
                change = {}
                break;
            case 'milestoned':
                change = {
                    time: eventItem.created_at,
                    updatedBy: {
                        username: eventItem.actor.login,
                        name: eventItem.actor.login
                    },
                    change: {
                        tofixin: {
                            from: null,
                            to: eventItem.milestone.title
                        }
                    }

                }
                changeHistory.push(change);
                change = {}
                break;
            case 'referenced':
                change = {
                    time: eventItem.created_at,
                    updatedBy: {
                        username: eventItem.actor.login,
                        name: eventItem.actor.login
                    },
                    svn: {
                        revision: eventItem.commit_id
                    }
                }
                changeHistory.push(change);
                change = {}
                break;
            case 'renamed':
                change = {
                    time: eventItem.created_at,
                    updatedBy: {
                        username: eventItem.actor.login,
                        name: eventItem.actor.login
                    },
                    change: {
                        title: {
                            from: eventItem.rename.from,
                            to: eventItem.rename.to
                        }
                    }
                }
                changeHistory.push(change);
                change = {}
                break;
            case 'opened':
            case 'closed':
            case 'reopened':
                break;
            default:
                // do nothing
        }
    });
    return changeHistory;
}

function processCommentList(commentList) {
    commentList.forEach(function(commentItem, index) {
        commentList[index] = {
            time: commentItem.created_at,
            updatedBy: {
                username: commentItem.user.login,
                name: commentItem.user.login
            },
            files: [],
            comment: commentItem.body
        }
    });
    return commentList;
}


function sortChangeHistory(changeHistory) {
    return _.sortBy(changeHistory, 'time');
}


function convertToBugtrackItem(githubIssue, callback) {
    githubIssue.changeHistory = _.sortBy(_.flatten([processEventList(githubIssue.eventList), processCommentList(githubIssue.commentList)]), 'time');
    delete githubIssue.eventList;
    delete githubIssue.commentList;
    var bugtrackItem = {
        id: null,
        title: githubIssue.title,
        kind: getKind(githubIssue.labels),
        status: getStatus(githubIssue.labels),
        createdAt: githubIssue.created_at,
        shippedAt: null,
        closedAt: githubIssue.closed_at,
        updatedAt: githubIssue.updated_at,
        category: getProjectNameFromURL(githubIssue.url),
        severity: setSeverity(getSeverity(githubIssue.labels)),
        priority: {
            level: null,
            title: null
        },
        submittedBy: {
            username: githubIssue.user.login,
            name: githubIssue.user.login
        },
        assignTo: (function() {
            try {
                return {
                    username: githubIssue.assignee.login,
                    name: githubIssue.assignee.login
                }
            } catch (e) {
                return {
                    "username": "nobody",
                    "email": "nobody@marklogic.com",
                    "name": "nobody nobody"
                }
            }
        })(),

        tofixin: (function() {
            try {
                return githubIssue.milestone.title;
            } catch (e) {
                return '';
            }
        })(),
        description: githubIssue.body,
        samplequery: '',
        sampledata: '',
        stacktrace: '',
        platfrom: 'all',
        processors: '',
        memory: '',
        note: '',
        attachments: [],
        tags: [getProjectNameFromURL(githubIssue.url), githubIssue.user.login],
        subscribers: [{
                username: githubIssue.user.login,
                name: githubIssue.user.login
            },
            /*{
            username: githubIssue.assignee.login,
            name: githubIssue.assignee.login
        }*/
        ],
        clones: [],
        cloneOf: null,
        changeHistory: githubIssue.changeHistory,
        github: {
            issueId: githubIssue.number,
            url: githubIssue.html_url,
            endpoint: githubIssue.url
        }
    }

    if (bugtrackItem.kind === 'Task' || bugtrackItem.kind === 'RFE') {
        delete bugtrackItem.clones;
        delete bugtrackItem.cloneOf;
        bugtrackItem.proceduralTasks = {
            'Requirements Task': [],
            'Functional Specification Task': [],
            'Test Specification Task': [],
            'Test Automation Task': [],
            'Documentation Task': []
        };
        bugtrackItem.subTasks = []

    }
    if (callback) {
        return callback(null, bugtrackItem);
    } else {
        return bugtrackItem;
    }
}


function getKind(labels) {
    if (labels.length === 0) return ''
    var kind = null;
    labels.forEach(function(label) {
        if (label.name === 'Bug') {
            kind = 'Bug'
        }

        if (label.name === 'Enhancement') {
            kind = 'RFE'
        }
        if (label.name === 'Task') {
            kind = 'Task'
        }
    })
    return kind;
}


function getSeverity(labels) {
    if (labels.length === 0) return ''
    var severity = null;
    labels.forEach(function(label) {
        switch (label.name) {
            case 'catastrophic':
            case 'critical':
            case 'major':
            case 'minor':
            case 'aesthetic':
            case 'performance':
                severity = capitalize(label.name)
                break;
        }
    })
    return severity;
}

function getStatus(labels) {
    if (labels.length === 0) return ''
    var status = null;
    labels.forEach(function(label) {
        switch (label.name) {
            case 'new':
            case 'verify':
            case 'fix':
            case 'test':
            case 'ship':
            case 'closed':
            case 'will not fix':
            case 'external':
                status = capitalize(label.name)
                break;
        }
    })
    return status;
}

function setSeverity(label) {
    if (!label) return ''
    var severity = null;
    switch (label.toLowerCase()) {
        case 'catastrophic':
            severity = 'P1 - Catastrophic';
            break;
        case 'critical':
            severity = 'P2 - Critical';
            break;
        case 'major':
            severity = 'P3 - Major';
            break;
        case 'minor':
            severity = 'P4 -  Minor';
            break;
        case 'aesthetic':
            severity = 'P5 - Aesthetic';
            break;
        case 'performance':
            severity = 'Performance'
            break;
        default:
            severity = label;
    }
    return severity;
}

// capitalises the first letter in a string
function capitalize(s) {
    try {
        s = s.toString();
        return s[0].toUpperCase() + s.slice(1);
    } catch (e) {
        return ''
    }
}