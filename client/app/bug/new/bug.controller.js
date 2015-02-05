'use strict';

angular.module('bug.controllers', ['angularFileUpload', 'textAngular'])
    .controller('newBugCtrl', ['$scope', '$location', 'Bug', 'Config', 'Flash', 'User', 'config', 'currentUser', 'bugId',

        function($scope, $location, Bug, Config, Flash, User, config, currentUser, bugId) {
            // accordion interactions   
            $scope.status = {
                isFirstOpen: true,
                isFirstDisabled: false
            };

            $scope.config = {};
            $scope.config = config.data;
            $scope.submittedBy = currentUser;

            $scope.selectedItem = {
                value: 0,
                label: ''
            };

            //  $scope.Wrapper = Serv;
            $scope.relatedTo = [];

            $scope.relatedTasks = [
                'Requirements task for',
                'Functional Spec task for',
                'Test Specification task for',
                'Test Automation task for',
                'Documentation task for',
                'Sub-task of'
            ];

            // $scope.setKind = function(kind) {
            //     $scope.kind = kind;
            // };

            $scope.submitted = false;


            $scope.setQuery = function(samplequery) {
                $scope.samplequery = samplequery;
            };
            $scope.setSampledata = function(sampledata) {
                $scope.sampledata = sampledata;
            };
            $scope.setStacktrace = function(stacktrace) {
                $scope.stacktrace = stacktrace;
            };

            $scope.setCategory = function(category) {
                $scope.category = category;
            };

            $scope.setAssignTo = function(assignTo) {
                $scope.assignTo = JSON.parse(assignTo);
            };

            $scope.setSeverity = function(severity) {
                $scope.severity = severity;
            };

            $scope.setPriority = function(priority) {
                $scope.priority = JSON.parse(priority);
            };

            $scope.setToFixIn = function(tofixin) {
                $scope.tofixin = tofixin;
            };

            $scope.setRelation = function(relation) {
                $scope.relation = relation;
            };

            $scope.setRelatedTo = function(relatedTo) {
                if (relatedTo) {
                    var tokenizedTaskIds = relatedTo.split(',');
                    var taskIds = [];
                    for (var i = 0; i < tokenizedTaskIds.length; i++) {
                        if (!isNaN(parseInt(tokenizedTaskIds[i].replace(/ /g, '')))) {
                            taskIds[i] = parseInt(tokenizedTaskIds[i].replace(/ /g, ''));
                        }
                    }
                    $scope.relatedTo = taskIds;
                    console.log(taskIds);
                } else {
                    $scope.relatedTo = [];
                }
            };

            $scope.setVersion = function(version) {
                $scope.version = version;
            };

            $scope.setPlatform = function(platform) {
                $scope.platform = platform;
            };

            $scope.setMemory = function(memory) {
                $scope.memory = memory;
            };

            $scope.setProcessors = function(processors) {
                $scope.processors = processors;
            };

            $scope.setNote = function(note) {
                $scope.note = note;
            };

            $scope.setHeadline = function(headline) {
                $scope.headline = headline;
            };

            $scope.setSupportDescription = function(supportDescription) {
                $scope.supportDescription = supportDescription;
            };

            $scope.setWorkaround = function(workaround) {
                $scope.workaround = workaround;
            };

            $scope.setPublishStatus = function(publishStatus) {
                $scope.publishStatus = publishStatus || 'Not Ready';
            };

            $scope.setTickets = function(tickets) {
                if (tickets) {
                    var tokenizedTickets = tickets.split(',');
                    var ticketIds = [];
                    for (var i = 0; i < tokenizedTickets.length; i++) {
                        if (!isNaN(parseInt(tokenizedTickets[i].replace(/ /g, '')))) {
                            ticketIds[i] = parseInt(tokenizedTickets[i].replace(/ /g, ''));
                        }
                    }
                    $scope.tickets = ticketIds;
                } else {
                    $scope.tickets = [];
                }

            };

            $scope.setCustomerImpact = function(customerImpact) {
                $scope.customerImpact = customerImpact;
            };


            //an array of files selected
            $scope.files = [];

            //listen for the file selected event
            $scope.$on('fileSelected', function(event, args) {
                $scope.$apply(function() {
                    //add the file object to the scope's files collection
                    $scope.files.push(args.file);
                });
            });
            $scope.createNewBug = function() {
                if ($scope.bugForm.$valid) {
                    // Submit as normal
                    submitBug();
                } else {
                    $scope.bugForm.submitted = true;
                }
            };

            function submitBug() {
                var bug = {};

                bug.id = parseInt(bugId.data.count) + 1;
                bug.kind = $scope.kind || 'Bug';
                bug.createdAt = new Date();
                bug.modifiedAt = bug.createdAt;
                bug.status = $scope.config.status[1];
                bug.title = $scope.title;
                bug.submittedBy = {
                    username: $scope.submittedBy.username,
                    email: $scope.submittedBy.email,
                    name: $scope.submittedBy.name
                };
                bug.assignTo = $scope.assignTo;
                bug.description = $scope.description;
                bug.samplequery = $scope.samplequery;
                bug.sampledata = $scope.sampledata;
                bug.stacktrace = $scope.stacktrace;
                bug.category = $scope.category;
                bug.tofixin = $scope.tofixin;
                bug.fixedin = '';
                bug.severity = $scope.severity;
                bug.priority = $scope.priority;
                bug.version = $scope.version;
                bug.platform = $scope.platform || 'all';
                bug.memory = $scope.memory;
                bug.processors = $scope.processors;
                bug.note = $scope.note;
                bug.headline = $scope.headline;
                bug.subscribers = [];
                bug.subscribers.push({
                    email: $scope.submittedBy.email,
                    name: $scope.submittedBy.name,
                    username: $scope.submittedBy.username
                });
                if ($scope.assignTo.username !== $scope.submittedBy.username) {
                    bug.subscribers.push($scope.assignTo);
                }
                bug.attachments = [];
                for (var i = 0; i < $scope.files.length; i++) {
                    bug.attachments[i] = {
                        name: $scope.files[i].name,
                        uri: '/bug/' + bug.id + '/attachments/' + $scope.files[i].name
                    };
                }
                bug.relation = $scope.relation;
                bug.relatedTo = $scope.relatedTo || [];
                bug.clones = [];

                bug.supportDescription = $scope.supportDescription;
                bug.workaround = $scope.workaround;
                bug.publishStatus = $scope.publishStatus || 'Not Ready';
                bug.customerImpact = $scope.customerImpact;
                bug.tickets = $scope.tickets || [];
                bug.changeHistory = [];

                Bug.create(bug, $scope.files).success(function() {
                    $location.path('/');
                    Flash.addAlert('success', '<a href=\'/bug/' + bug.id + '\'>' + 'Bug-' + bug.id + '</a>' + ' was successfully created');
                }).error(function(response) {
                    Flash.addAlert('danger', response);
                });
            }
        }
    ]);