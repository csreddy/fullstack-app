'use strict';

angular.module('task.controllers', ['angularFileUpload', 'textAngular', 'ngProgress'])
    .controller('newTaskCtrl', ['$scope', '$q', '$location', 'config', 'currentUser', 'Task', 'RFE', 'Flash', 'ngProgress', 'Common',
        function($scope, $q, $location, config, currentUser, Task, RFE, Flash, ngProgress, Common) {
           $location.search({}).replace();
            $scope.task = {};
            $scope.task.parent = {};
            $scope.task.period = {
                startDate: stringify(new Date()),
                endDate: ''
            };
            $scope.submittedBy = {
                username: currentUser.username,
                name: currentUser.name,
                email: currentUser.email
            };
            $scope.config = {};
            $scope.config = config.data;
            $scope.accordion = {};
            $scope.accordion.status = {
                taskInfo: true
            };

            $scope.task.files = [];
            $scope.task.days = 1;
            $scope.relatedTo = [];
            $scope.relationTypes = [
                'Requirements Task',
                'Functional Specification Task',
                'Test Specification Task',
                'Test Automation Task',
                'Documentation Task',
                'Sub-task'
            ];

            $scope.days = _.range(1, 101);

               // sort users
            $scope.config.users = _.sortBy($scope.config.users, 'name');
          

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


            //listen for the file selected event
            $scope.$on('fileSelected', function(event, args) {
                $scope.$apply(function() {
                    //add the file object to the scope's files collection
                    $scope.task.files.push(args.file);
                });
            });

            $scope.createNewTask = function() {
                if ($scope.taskForm.$valid) {
                    // Submit as normal
                    submitTask();
                } else {
                    $scope.taskForm.submitted = true;
                }
            };


            this.submitTask = function() {
                submitTask();
            };

            this.stringify = function(date) {
                stringify(date);
            };


            /* private functions */
            function submitTask() {
                console.log('submit new task');
                ngProgress.start();
                Task.getNewId().success(function(response) {
                    var task = {};
                    task.id = response.nextId;
                    task.kind = 'Task';
                    task.title = $scope.task.title;
                    task.description = Common.linkifyBugId($scope.task.description);
                    task.note = $scope.task.note;
                    task.days = $scope.task.days;
                    task.status = $scope.config.status[0];
                    /*if ($scope.task.period.startDate > new Date()) {
                        task.status = $scope.config.status[0];
                    }
                    if ($scope.task.period.startDate <= new Date()) {
                        task.status = $scope.config.status[0];
                    }*/


                    task.period = $scope.task.period;
                    task.priority = $scope.task.priority;
                    task.category = $scope.task.category;
                    task.severity = $scope.task.severity;
                    task.version = $scope.task.version;
                    task.tofixin = $scope.task.tofixin;
                    task.fixedin = '';
                    task.parent = {};
                    task.parent.parentId = $scope.task.parent.parentId || null;
                    task.parent.type = $scope.task.parent.type || null;

                    task.submittedBy = {
                        username: currentUser.username,
                        email: currentUser.email,
                        name: currentUser.name
                    };
                    task.assignTo = $scope.task.assignTo;
                    task.subscribers = [];
                    task.subscribers.push(task.submittedBy);
                    if (task.assignTo.username !== task.submittedBy.username) {
                        task.subscribers.push(task.assignTo);
                    }
                    task.attachments = [];
                    console.log('task', task);
                    for (var i = 0; i < $scope.task.files.length; i++) {
                        task.attachments[i] = {
                            name: $scope.task.files[i].name,
                            uri: '/task/' + task.id + '/attachments/' + $scope.task.files[i].name
                        };
                    }

                    task.includeInTaskList = true;
                    task.proceduralTasks = {
                        'Requirements Task': [],
                        'Functional Specification Task': [],
                        'Test Specification Task': [],
                        'Test Automation Task': [],
                        'Documentation Task': []
                    };
                    task.subTasks = [];
                    task.tags = [task.category, task.assignTo.username, task.submittedBy.username];
                    task.createdAt = new Date();
                    task.modifiedAt = new Date();
                    task.changeHistory = [];
                    var updates = [Task.create(task, $scope.task.files).then()];
                    if (task.parent.parentId) {
                        task.parent.taskOrRfe = $scope.task.parent.taskOrRfe.toLowerCase();
                        switch (task.parent.taskOrRfe) {
                            case 'rfe':
                                if ($scope.relationTypes.indexOf(task.parent.type) > -1 && task.parent.type !== 'Sub-task') {
                                    updates.push(RFE.insertProceduralTask(task.parent.parentId, task.parent.type, task.id).then());
                                } else {
                                    updates.push(RFE.insertSubTask(task.parent.parentId, task.id).then());
                                }
                                break;
                            case 'task':
                                if ($scope.relationTypes.indexOf(task.parent.type) > -1 && task.parent.type !== 'Sub-task') {
                                    updates.push(Task.insertProceduralTask(task.parent.parentId, task.parent.type, task.id).then());
                                } else {
                                    updates.push(Task.insertSubTask(task.parent.parentId, task.id).then());
                                }
                                break;
                            default:
                                // do nothing   
                                break;
                        }


                    }

                    $q.all(updates).then(function(response) {
                        ngProgress.complete();
                        $location.path('/task/' + task.id);
                        Flash.addAlert('success', '<a href=\'/task/' + task.id + '\'>' + 'Task-' + task.id + '</a>' + ' was successfully created');
                    }, function(error) {
                        ngProgress.complete();
                        Flash.addAlert('danger', ' Oops! Could not create the task. ' + error.data.message +
                            'You can associate ' + task.parent.type +' to RFE only')
                    });
                }).error(function(error) {
                    ngProgress.complete();
                    Flash.addAlert('danger', 'Oops! cound not get new Task Id');
                });

            }

            function stringify(d) {
                var dateStr = d.getFullYear() + '-';
                var month = d.getMonth() + 1;
                dateStr = (month < 10) ? dateStr + '0' + month + '-' : dateStr + month + '-';
                dateStr = (d.getDate() < 10) ? dateStr + '0' + d.getDate() : dateStr + d.getDate();
                return dateStr;
            }
        }
    ]);