'use strict';

//  Requirements
var winston = module.parent.require('winston');
var watsonDev = module.parent.require('watson-developer-cloud');
var Posts = module.parent.require('./posts');

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
    if (err)
      return winston.info(err);
    else {
      winston.info(JSON.stringify(response, null, 2));
      Posts.setPostFields(postData.pid, response, function(err, setPostFields){
        if (err) {
          return winston.info(err + 'ON setPostField');
        }
        else {
          winston.info(setPostFields);
        }
      });
    }
  });
}

module.exports = Watson;
