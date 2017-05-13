/**
  * @author Gabriel Mochi Ribeiro <gmochi56@icloud.com>,
  * @author Moraes Couto <davimcouto@segredodaraposa.com.br>
  */

'use strict';

//  Requirements
var User = require.main.require('./src/user'),
    Topics = require.main.require('./src/topics'),
    winston = module.parent.require('winston'),
    watsonDev = require('watson-developer-cloud');

// Global variables
var userSearch = {
    query: 'Watson', //!!!This query value will be the same in the username if it haven't been created before!!!
    searchBy: 'username'
};

//  Methods
var Watson = {};

// This method will be called even the app load
Watson.init = function() {
  // Search if the bot that you named really exists, if not, will be created a user to serve as a bot
  User.search(userSearch, function(err, search) {
    if (err) {
      return winston.error('[Watson] encountered a problem while verify if the user exists', err.message);
    }
    else {
      if (search.matchCount === 0) {
        var userSettings = {
          username: userSearch.query,
          email: 'email', // Here you can change the e-mail as you want
          password: 'shhhhh!!!!' // Here you can change the password as you want
        };

        User.create(userSettings, function(err, uid) {
          if (err) {
            return winston.error('[Watson] encountered a problem while create the user', err.message);
          }
        });
      }
    }
  });
};

// This method will be called even an user makes a new post or reply
Watson.response = function(postData) {
  var conversation = watsonDev.conversation({
    username: 'xxxxxxxxxxxxxxxxxxxxx',
    password: 'secrete.',
    version: 'v1',
    version_date: '2016-09-20'
  });

  var context = {};

  var params = {
    workspace_id: 'a05393b7-d022-4bed-ba76-012042930893',
    input: {'text': postData.content},
    context: context
  };

  // Call the Watson Conversation service to give an response 
  conversation.message(params, function(err, response) {
    if (err) {
      return winston.error('[Watson] encountered a problem on the coginition of the recieved message: ', err.message);
    }
    else {
      // Search if the bot was created, if not, the service won't be able to respond
      User.search(userSearch, function(err, search) {
        if (err) {
          return winston.error('[Watson] encountered a problem while verify if the user exists: ', err.message);
        }
        else {
          // If a user to serve as bot was found, let's response it
          if (search.matchCount > 0 && postData.uid != search.users[0].uid) {
            var payload = {
              tid: postData.tid,
              uid: search.users[0].uid,
              toPid: postData.pid,
              content: response.output.text[0],
              timestamp: Date.now()
            };

            // Reply the User's topic with the Conversation service response
            Topics.reply(payload, function(err) {
              if (err) {
                return winston.error('[Watson] encountered a problem while send the response/reply: ', err.message);
              }
            });
          }
        }
      });
    }
  });
};

module.exports = Watson;
