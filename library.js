'use strict';

//  Requirements
var User = module.parent.require('./user'),
    winston = module.parent.require('winston'),
    watsonDev = require('watson-developer-cloud'),

//  Methods
    Watson = {};

Watson.response = function(postData) {
  var conversation = watsonDev.conversation({
    username: 'c9d9cc99-b3e5-44f5-a234-ccae1578e8ae',
    password: 'xUtHqarwWpUk',
    version: 'v1',
    version_date: '2016-09-20'
  }),
      context = {},
      params = {
        workspace_id: '25dfa8a0-0263-471b-8980-317e68c30488',
        input: {'text': 'hahaha'},
        context: context
      };

  conversation.message(params, function
    (err, response) {
    if (err)
      return winston.error(err);
    else
      winston.log(JSON.stringify(response, null, 2));
  });
}

module.exports = Watson;
