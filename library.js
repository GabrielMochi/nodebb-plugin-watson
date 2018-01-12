/**
  * @author Gabriel Mochi Ribeiro <gmochi56@icloud.com>,
  * @author Davi Moraes Couto <davimcouto@segredodaraposa.com.br>
  */

'use strict';

//  Requirements
const User = require.main.require('./src/user');
const Topics = require.main.require('./src/topics');
const winston = module.parent.require('winston');
const watsonDev = require('watson-developer-cloud');

// Global variables
var userSearch = {
    query: 'Watson', //!!!This query value will be the same in the username if it haven't been created before!!!
    searchBy: 'username'
};

var conversation = watsonDev.conversation({
  username: 'xxxxxxxxxxxxxxxxxxxxx',
  password: 'secrete.',
  version: 'v1',
  version_date: '2016-09-20'
});

//  Watson methods
var Watson = {};

// This method will be called even the app load
Watson.init = () => {
  // Search if the bot that you named really exists, if not, will be created a user to serve as a bot
  User.search(userSearch, (err, search) => {
    if (err) {
      winston.error('[Watson] encountered a problem while verify if the user exists', err.message);
    } else {
      if (search.matchCount === 0) {
        let userSettings = {
          username: userSearch.query,
          email: 'email', // Here you can change the e-mail as you want
          password: 'shhhhh!!!!' // Here you can change the password as you want
        };

        User.create(userSettings, (err, uid) => {
          if (err) {
            winston.error('[Watson] encountered a problem while create the user', err.message);
          }
        });
      }
    }
  });
};

// This method will be called even an user makes a new post or reply
Watson.response = (postData) => {
  let params = {
    workspace_id: 'a05393b7-d022-4bed-ba76-012042930893',
    input: { text: postData.content },
    context: {}
  };

  // Call the Watson Conversation service to give an response 
  conversation.message(params, (err, response) => {
    if (err) {
      winston.error('[Watson] encountered a problem on the coginition of the recieved message: ', err.message);
    } else {
      // Search if the bot was created, if not, the service won't be able to respond
      User.search(userSearch, (err, search) => {
        if (err) {
          winston.error('[Watson] encountered a problem while verify if the user exists: ', err.message);
        } else {
          // If a user to serve as bot was found, let's response it
          if (search.matchCount > 0 && postData.uid != search.users[0].uid) {
            let payload = {
              tid: postData.tid,
              uid: search.users[0].uid,
              toPid: postData.pid,
              content: response.output.text[0],
              timestamp: Date.now()
            };

            // Reply the User's topic with the Conversation service response
            Topics.reply(payload, (err) => {
              if (err) {
                winston.error('[Watson] encountered a problem while send the response/reply: ', err.message);
              }
            });
          }
        }
      });
    }
  });
};

module.exports = Watson;
