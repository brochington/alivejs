define([
	'asdf/classes/livePropertyObject'
	], function (lpo){

	var liveFunctionValues = {};


	lpo.liveFunc = function(funcName, initFunc, initArgs, initContext){

		Object.defineProperty(liveFunctionValues, funcName, {
			value: new LiveFunc({
				name: funcName,
				liveFunc: initFunc,
				initArgs: initArgs,
				initContext: initContext
			})
		});

		console.log(liveFunctionValues);

		if(!lpo[funcName]){
			Object.defineProperty(lpo, funcName, {
				get: function(){
					console.log('getting from liveFunc');
					if(liveFunctionValues[funcName]){
						return liveFunctionValues[funcName].value;
					}
				},
				set: function(val){

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

		console.log(this.internal.asdfWrapperFunc);

		// evaluate the initFunc to get a starting value, then set it to the 
		// internal.value prop.
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