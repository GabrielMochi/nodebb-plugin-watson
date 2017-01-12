'use strict';

//  Requirements
var User = module.parent.require('./user'),
var winston = module.parent.require('winston'),
var watsonDev = require('watson-developer-cloud');

//  Methods
var Watson = {};

Watson.response = function(postData) {
  var conversation = watsonDev.conversation({
    username: 'c9d9cc99-b3e5-44f5-a234-ccae1578e8ae',
    password: 'xUtHqarwWpUk',
    version: 'v1',
    version_date: '2016-09-20'
  });

  var context = {};

  var params = {
    workspace_id: 'a05393b7-d022-4bed-ba76-012042930893',
    input: {'text': 'hahaha'},
    context: context
  };

  conversation.message(params, function
    (err, response) {
    if (err)
      return console.log(err);
    else
      console.log(JSON.stringify(response, null, 2));
  });
}

module.exports = Watson;
