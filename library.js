'use strict';

//  Requirements
var Topics = require.main.require('./src/topics'),
    winston = module.parent.require('winston'),
    watsonDev = require('watson-developer-cloud');

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
    input: {'text': postData.content},
    context: context
  };

  conversation.message(params, function(err, response) {
    if (err) {
      return winston.error('[Watson] encountered a problem on the coginition of the recieve message:', err.message);
    }
    else {
      var payload = {
        tid: postData.tid,
        uid: 2,
        toPid: postData.pid,
        content: response.output.text[0],
        timestamp: Date.now()
      };

      Topics.reply(payload, function(err) {
        if (err) {
          return winston.error('[Watson] encountered a problem while send the response/reply', err.message);
        }
      });
    }
  });
}

module.exports = Watson;
