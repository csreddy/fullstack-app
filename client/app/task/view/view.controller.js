'use strict';

angular.module('task.controllers')
    .controller('viewTaskCtrl', ['$scope', '$location', '$timeout', '$q', 'Task', 'config', 'Flash', 'currentUser', 'modalService', 'ngProgress',

        function($scope, $location, $timeout, $q, Task, config, Flash, currentUser, modalService, ngProgress) {

            $scope.changes = {};
            $scope.updatedBy = currentUser || {};
            $scope.showSubscribe = true;
            $scope.showUnsubscribe = false;
            $scope.config = config.data || {};
            $scope.hasAttachments = false;
            $scope.accordion = {};
            $scope.accordion.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };
            $scope.statuses = ['Not Yet Started', 'In Progress', 'Completed'];
            $scope.proceduralTaskTypes = [
                'Requirements Task',
                'Functional Specification Task',
                'Test Specification Task',
                'Test Automation Task',
                'Documentation Task'
            ];
            $scope.relationTypes = [
                'Requirements Task',
                'Functional Specification Task',
                'Test Specification Task',
                'Test Automation Task',
                'Documentation Task',
                'Sub-task'
            ];
            var oldCopy;
            var id = $location.path().replace('/task/', '');

            $scope.days = _.range(1, 101);


            // for calendar   
            $scope.cal = {
                open: function(when, $event) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    $scope.cal.fromOpened = (when === 'from') ? true : false;
                    $scope.cal.toOpened = (when === 'to') ? true : false;
                },
                format: 'MM-dd-yyyy'
            };


            Task.get(id).then(function(response) {

                    console.log(response.data);

                    $scope.task = response.data;
                    oldCopy = JSON.parse(JSON.stringify(response.data));
                    console.log('oldCopy', oldCopy);

                    // need specical handling for 'priority' and 'assignTo' for 
                    // pre-selecting values and binding selection from the UI to model
                    // in dropdown becuase the model is object and not string
                    var index = _.findIndex($scope.config.priority, $scope.task.priority);
                    $scope.task.priority = $scope.config.priority[index];
                    index = _.findIndex($scope.config.users, $scope.task.assignTo);
                    $scope.task.assignTo = $scope.config.users[index];

                    // if the current user has already subscribed then show Unsubscribe else show Subscribe
                    var subscribers = $scope.task.subscribers;
                    for (var i = 0; i < subscribers.length; i++) {
                        if (subscribers[i].username === currentUser.username) {
                            $scope.showSubscribe = false;
                            $scope.showUnsubscribe = true;
                            break;
                        }
                    }
                    // if the current user is task reporter or task assignee then do not show subscribe/unsubscribe because 
                    // they are subscribed by default and not allowed to unsubscribe
                    if (currentUser.username === $scope.task.assignTo.username || currentUser.username === $scope.task.submittedBy.username) {
                        $scope.showSubscribe = false;
                        $scope.showUnsubscribe = false;
                    }

                    if ($scope.task.attachments.length > 0) {
                        $scope.hasAttachments = true;
                    }

                    subTasks(id);

                },
                function(response) {
                    if (response.status === 404) {
                        $location.path('/404');
                        Flash.addAlert('danger', 'Task not found');
                    } else {
                        Flash.addAlert('danger', response.data.error.message);
                    }

                });

            //an array of files selected
            $scope.files = [];

            //listen for the file selected event
            $scope.$on('fileSelected', function(event, args) {
                $scope.$apply(function() {
                    //add the file object to the scope's files collection
                    $scope.files.push(args.file);
                });
            });

            // update task 
            $scope.updateTask = function() {
                ngProgress.start();

                $scope.$watch('task.priority', function() {
                    console.log('task.priority', $scope.task.priority);
                });


                $scope.task.updatedBy = {
                    username: currentUser.username,
                    email: currentUser.email,
                    name: currentUser.name
                };
                // oldCopy.subscribers = $scope.task.subscribers.push(oldCopy.updatedBy);
                $scope.task.svninfo = {};

                for (var j = 0; j < $scope.files.length; j++) {
                    var fileuri = '/task/' + oldCopy.id + '/attachments/' + $scope.files[j].name;
                    if ($scope.task.attachments.indexOf(fileuri) > -1) {
                        var modalOptions = {
                            showCloseButton: true,
                            showActionButton: false,
                            closeButtonText: 'Ok',
                            headerText: 'File Exists!',
                            bodyText: 'File with name <b>' + fileuri + '</b> is already attached to this task'
                        };
                        modalService.showModal({}, modalOptions);
                    } else {
                        $scope.task.attachments.push(fileuri);
                    }
                }

                // Task.watch2($scope, $scope.task);

                Task.update($scope.task, oldCopy, $scope.files).success(function() {
                    // reset watchers
                    //  $scope.task.changes = {};
                    $scope.files = [];
                    $scope.task.comment = '';
                    subTasks($scope.task.id);
                    Flash.addAlert('success', '<a href=\'/task/' + $scope.task.id + '\'>' + 'Task-' + $scope.task.id + '</a>' + ' was successfully updated');
                    Task.get(id).then(function(response) {
                        $scope.task = response.data;
                    }, function(error) {
                        Flash.addAlert('danger', error.message);
                    });
                    ngProgress.complete();
                }).error(function(error) {
                    Flash.addAlert('danger', error.message);
                });

            };

            // create procedural tasks
            $scope.createProceduralTask = function(proceduralTaskType) {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Create',
                    headerText: 'Confirm',
                    bodyText: 'Are you sure you want to create ' + proceduralTaskType + ' for ' + '<a href=\'/task/' + id + '\'>' + 'Task-' + id + '</a>'
                };
                modalService.showModal({}, modalOptions).then(function() {
                    Task.count().success(function(response) {
                        var task = {};
                        task.id = response.count + 1;
                        task.kind = 'Task';
                        task.title = proceduralTaskType + ' for ' + $scope.task.title;
                        task.description = 'Implement ' + task.title;
                        task.days = null;
                        task.status = $scope.statuses[0];
                        task.period = {
                            startDate: null,
                            endDate: null
                        };


                        task.period = task.priority = null;
                        task.category = $scope.task.category;
                        task.severity = $scope.task.severity;
                        task.version = $scope.task.version;
                        task.tofixin = $scope.task.tofixin;
                        task.submittedBy = {
                            username: currentUser.username,
                            email: currentUser.email,
                            name: currentUser.name
                        };
                        task.assignTo = {};
                        task.subscribers = [task.submittedBy];
                        task.attachments = [];
                        task.parent = {
                            type: proceduralTaskType,
                            id: id
                        }
                        task.proceduralTasks = {
                            'Requirements Task': [],
                            'Functional Specification Task': [],
                            'Test Specification Task': [],
                            'Test Automation Task': [],
                            'Documentation Task': []
                        };
                        task.subTasks = [];
                        task.createdAt = new Date();
                        task.modifiedAt = new Date();
                        task.changeHistory = [];

                        var updates = [Task.create(task, []).then(), Task.insertProceduralTask(id, proceduralTaskType, task.id).then()];
                        $q.all(updates).then(function(response) {
                            ngProgress.complete();

                            $scope.message = "<span class='label label-danger'><span class='glyphicon glyphicon-bullhorn'></span> Created Task-" + task.id+"</span>"; 
                            // show message for 5 seconds and hide
                            $timeout(function() {
                                $scope.message = '';
                            }, 5000);
                            //  Flash.addAlert('success', '<a href=\'/task/' + task.id + '\'>' + 'Task-' + task.id + '</a>' + ' was successfully created'); 
                            Task.get(id).then(function(response) {
                                $scope.task = response.data;
                                subTasks(id);
                            }, function(error) {
                                Flash.addAlert('danger', 'Oops! Could not get task detals. Reload the page.')
                            })

                        }, function(error) {
                            Flash.addAlert('danger', 'Oops! Could not create the task. Please try again.');
                        });
                    }).error(function(error) {
                        Flash.addAlert('danger', 'Oops! could not get task count');
                    });
                }, function(error) {
                    // do nothing
                });
            };


            $scope.createSubTask = function() {
                var modalOptions = {
                    closeButtonText: 'Cancel',
                    actionButtonText: 'Create',
                    headerText: 'Confirm',
                    bodyText: 'Are you sure you want to create sub task for ' + '<a href=\'/task/' + id + '\'>' + 'Task-' + id + '</a>'
                };
                modalService.showModal({}, modalOptions).then(function() {
                    Task.count().success(function(response) {
                        var task = {};
                        task.id = response.count + 1;
                        task.kind = 'Task';
                        task.title = $scope.task.subtaskTitle;
                        task.description = 'Implement ' + task.title;
                        task.days = null;
                        task.status = $scope.statuses[0];
                        task.period = {
                            startDate: null,
                            endDate: null
                        };


                        task.period = task.priority = null;
                        task.category = $scope.task.category;
                        task.severity = $scope.task.severity;
                        task.version = $scope.task.version;
                        task.tofixin = $scope.task.tofixin;
                        task.parent = id;
                        task.submittedBy = {
                            username: currentUser.username,
                            email: currentUser.email,
                            name: currentUser.name
                        };
                        task.assignTo = {};
                        task.subscribers = [task.submittedBy];
                        task.attachments = [];
                        task.parent = {
                            type: $scope.relationTypes[5],
                            id: id
                        };
                        task.proceduralTasks = {
                            'Requirements Task': [],
                            'Functional Specification Task': [],
                            'Test Specification Task': [],
                            'Test Automation Task': [],
                            'Documentation Task': []
                        };
                        task.subTasks = [];
                        task.createdAt = new Date();
                        task.modifiedAt = new Date();
                        task.changeHistory = [];

                        Task.createSubTask(id, task).then(function(response) {
                            ngProgress.complete();

                            $scope.message = "<span class='label label-danger'><span class='glyphicon glyphicon-bullhorn'></span> Created Task-" + task.id+"</span>"; 
                            // show message for 5 seconds and hide
                            $timeout(function() {
                                $scope.message = '';
                            }, 5000);
                            //  Flash.addAlert('success', '<a href=\'/task/' + task.id + '\'>' + 'Task-' + task.id + '</a>' + ' was successfully created'); 
                            Task.get(id).then(function(response) {
                                $scope.task = response.data;
                                subTasks(id);
                            }, function(error) {
                                Flash.addAlert('danger', 'Oops! Could not get task detals. Reload the page.')
                            })
                        }, function(error) {
                            Flash.addAlert('danger', 'Oops! Could not create the task. Please try again.');
                        });
                    }).error(function(error) {
                        Flash.addAlert('danger', 'Oops! could not get task count');
                    });
                }, function(error) {
                    // do nothing
                })
            };


            // subscribe to the task
            $scope.subscribe = function() {
                //$scope.task.subscribers.push($scope.updatedBy);
                var subscribe = {
                    id: id,
                    user: {
                        name: currentUser.name,
                        email: currentUser.email,
                        username: currentUser.username
                    }
                };
                Task.subscribe(subscribe).then(function() {
                    $scope.showSubscribe = false;
                    $scope.showUnsubscribe = true;
                    Flash.addAlert('success', 'You have subscribed to ' + '<a href=\'/#/task/' + $scope.task.id + '\'>' + 'Task-' + $scope.task.id + '</a>');
                }, function(error) {
                    Flash.addAlert('danger', error.data);
                });
            };
            // unsubscribe the task
            $scope.unsubscribe = function() {
                var unsubscribe = {
                    id: id,
                    user: {
                        name: currentUser.name,
                        email: currentUser.email,
                        username: currentUser.username
                    }
                };

                Task.unsubscribe(unsubscribe).then(function() {
                    // if the current user is task reporter or task assignee then do not show subscribe/unsubscribe because 
                    // they are subscribed default and cannot unsubscribe
                    if (currentUser.username === $scope.task.submittedBy.username || currentUser.username === $scope.task.assignTo.username) {
                        $scope.showSubscribe = false;
                        $scope.showUnsubscribe = false;
                    } else {
                        $scope.showSubscribe = true;
                        $scope.showUnsubscribe = false;
                    }
                    Flash.addAlert('success', 'You have unsubscribed from ' + '<a href=\'/#/task/' + $scope.task.id + '\'>' + 'Task-' + $scope.task.id + '</a>');
                }, function(error) {
                    Flash.addAlert('danger', error);
                });
            };

            // private functions
            function subTasks(id) {
                Task.getSubTasks(id).then(function(response) {
                    $scope.task.subTasks = response.data;
                    console.log($scope.task.subTasks);
                }, function(error) {
                    // console.log(error);
                    Flash.addAlert('danger', 'Oops! Could not retrieve sub tasks')
                });
            }
        }

    ]);