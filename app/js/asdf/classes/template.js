define([
	'lodash'
	], function (_){

	// _.templateSettings.interpolate = /${([\s\S]+?)}/g;


	var ns = new Templates();

	// constructor for Templates
	function Templates(){
		var self = this;

		this.__internal__ = {
			tplNodeList: document.querySelectorAll('script[type="text/asdf-template"]'),
			tplNodeArr: [],
			templates: {}
		}
		
		for(var i = 0; i < this.__internal__.tplNodeList.length; i++){
			var node = this.__internal__.tplNodeList[i];

			// populate standard arr with template nodes so that we have something
			// to iterate over with methods like forEach, map, and such.
			this.__internal__.tplNodeArr.push(node);

			// populate internal templates object, that will serve as the target for
			// getters/setters on the main Templates object. 
			Object.defineProperty(this.__internal__.templates, node.id, {
				value: new Template(node)
			});
		};

		// define properties on main Templates Object for each of the templates.
		this.__internal__.tplNodeArr.forEach(function(v, i, arr){
			console.log(v.id);
			Object.defineProperty(self, v.id, {
				get: function(){
					console.log('getting tpl');
					return self.__internal__.templates[v.id];
				},
				set: function(val){
					console.log('setting tpl: ', val);
				}
			})	
		});

		

		// console.log(this.__internal__.tplNodeArr);

	};

	// constructor for Template
	function Template(node){
		this.id = node.id;
		this.originalScriptNode = node;
		this.domString = node.innerHTML;
		this.domStringCompiled = _.template(node.innerHTML);
		// domNode is a wrapper for the contents coming from the template. 
		// access its contents to be able to touch internal nodes. 
		// Might create a ${} to <> processor...
		this.domNodeWrapper = document.createElement('div'); 
		this.domNodeWrapper.insertAdjacentHTML('afterbegin', node.innerHTML);

		// console.dir(this.domNodeWrapper);
	};



	return ns;
});