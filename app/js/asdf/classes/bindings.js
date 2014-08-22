define([], function(){
	ns = new BindingObject();


	function BindingObject () {

	};

	BindingObject.prototype.test = function(){
		console.log('testing the BindingObject!!');
	};



	return ns;
});