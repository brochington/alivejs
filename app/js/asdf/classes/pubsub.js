define(['lodash'], function (_){	
	var ns = {},
		topics = {},
		uid = 0;

	ns.addToTopics = function(topicName, callback){
		topics[topicName] =[];

		if(callback){ callback(); };
	};

	ns.publish = function(topicName, passedArgsArray){
		// console.log('publish!', topicName);
		var subscribers = topics[topicName];

		// console.dir(subscribers);

		// which is faster here? for loop, forEach, or lodash .each?
		// test using console timer. 
		if(topics[topicName]){
			topics[topicName].forEach(function (v, i, arr){

				subscribers[i].functionToCall(passedArgsArray);
			});
		}
	};

	ns.subscribe = function(topicName, functionToCall){
		// console.log('subscribe!');
		// console.dir(functionToCall);
		var token = ++uid;

		if(!topics[topicName]){ns.addToTopics(topicName)};

		topics[topicName].push({
			token: token,
			functionToCall: functionToCall,
			name: topicName
		});

		return token;	
	};

	ns.getTopics = function(){
		return topics;
	};

	ns.updateSubscribers = function(){

	};

	return ns;
})