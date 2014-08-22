define([
	'lodash'
	], function(_){
	var ns = {},
		typeArr = ['Undefined','String','Number','Boolean','Function',
						'Array','Date','Null','Object','Null','NaN'];

	ns.determineType = function(value){
		if(value.asdfType){
			return value.asdfType;
		};

		for(var i = 0;i<typeArr.length;i++){
			if(_[('is' + typeArr[i])](value)){
				// console.log(typeArr[i]);
				return typeArr[i];
			};
		};

		
	};

	ns.determineArgVals = function(args, amountToSkip){
		var argArr = Array.prototype.slice.call(args);

		for(var i = 0; i < amountToSkip; i++){
			argArr.shift();
		};
		
		return argArr;
	}

	return ns;
})