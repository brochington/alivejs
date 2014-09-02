define([
	'asdf/classes/pubsub',
	'asdf/classes/livePropertyObject'
	], function (ps, lpo){

	var liveFunctionValues = {},
		lpoi = lpo.__internal__;


	lpo.liveFunc = function(funcName, initFunc, initArgs, initContext){

		Object.defineProperty(liveFunctionValues, funcName, {
			value: new LiveFunc({
				name: funcName,
				liveFunc: initFunc,
				initArgs: initArgs,
				initContext: initContext
			})
		});

		if(!lpo[funcName]){
			Object.defineProperty(lpo, funcName, {
				get: function(){
					console.log('getting from liveFunc');
					if(liveFunctionValues[funcName]){
						return liveFunctionValues[funcName].value;
					}
				},
				set: function(val){
					// what will this be used for...
				}
			});
		}
	};

	// constructor function for LiveFunc class
	function LiveFunc(data){
		var self = this;

		this.internal = {
			name: data.name,
			value: data.value, // this is the function that is being used.
			initArgs: data.initArgs || null,
			liveFunc: data.liveFunc,
			initContext: data.initContext || window,
			asdfWrapperFunc: null
		};

		Object.defineProperty(this, 'name', {
			get: function(){
				console.log('getting name');
			},
			set: function(val){	
				console.log('setting name: ');
				console.dir(val);
			}
		});

		Object.defineProperty(this, 'value', {
			get: function(){
				console.log('getting value');

				return self.internal.asdfWrapperFunc;
			},
			set: function(val){
				console.log('setting value');
				console.dir(val);
			}
		});

		this.internal.asdfWrapperFunc = this.createWrapperFunction();

		// evaluate the initFunc to get a starting value, then set it to the 
		// internal.value prop.
		lpoi.monitoringLiveThings = true;
		this.internal.value = this.internal.liveFunc.apply(self.internal.initContext, self.internal.initArgs);
		lpoi.monitoringLiveThings = false;
		
		// subscribe to all 
		for (var i = 0; i < lpoi.monitoringLiveThingsArr.length; i++) {
			var v = lpoi.monitoringLiveThingsArr[i];

			ps.subscribe(v.internal.name, self.updateLiveFunc.bind(self));
		};

		lpoi.monitoringLiveThingsArr = [];

	};

	LiveFunc.prototype.updateLiveFunc = function(argsArray){
		var self = this;
		// reevaluate function...

		this.internal.value = this.internal.liveFunc.apply(self.internal.initContext, self.internal.initArgs);
	};

	LiveFunc.prototype.createWrapperFunction = function(){
		var wrapperFunc = new Function(),
			self = this;

		wrapperFunc = function(){
			return self.internal.value;
		};

		return wrapperFunc;
	}

	return lpo;
});