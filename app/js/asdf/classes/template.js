define([
	'lodash'
	], function (_){

	// _.templateSettings.interpolate = /${([\s\S]+?)}/g;


	var ns,
			ipRegEx = /\$\{(\w+)\}/g;
			// ipRegEx = /\$\{+(\w)\}/mg;

		// ipRegEx = /\$\{+\}/mg;

	// constructor for Templates
	function Templates(){
		var self = this;

		this.__internal__ = {
			// tplNodeList: document.querySelectorAll('script[type="text/asdf-template"]'),
			tplNodeList: document.querySelectorAll('[data-template]'),
			tplNodeArr: [],
			templates: {}
		};

		console.log('tplNodeList', this.__internal__.tplNodeList);
		
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

	};

	// constructor for Template
	function Template(node){

		console.dir(node);
		this.id = node.id;
		this.originalDomNode = node;
		this.asdfType = 'asdfTemplate';

		this.insertionPoints = {};

		this.processInsertionPoints(node);
	};

	// what is the best way to process the insertion points, and 
	// child nodes?
	Template.prototype.processInsertionPoints = function(node){
		console.log('called');
		var self = this;
		// detect if insertion points are being used in various parts
		// of the node, like classNames, attributes, innerText, etc.
		
		console.time('cn');
		for(var i = 0, l = node.childNodes.length; i < l; i++){
			var cn = node.childNodes[i];

			// text child nodes
			if(cn.nodeName == '#text' && cn.data.indexOf('${') >= 0){
				console.log('text node has insertionPoint');
				this.insertionPointHandlers['innerText'].call(this, cn);
			};
			// classNames on nodes
			if(cn.classList && cn.classList.length > 0){
				this.insertionPointHandlers['className'].call(this, cn);
			};

		}
		console.timeEnd('cn');
		console.log(this);

	};

	Template.prototype.insertionPointHandlers = {
		innerText: function(node){
			console.log('reached innerText insertionPointHandler');
			console.log(this);
			console.dir(node);

			// parse the nodeValue of the node.
			var ipNamesArr = getIPNamesFromStr(node.nodeValue);

			for (var i = 0; i < ipNamesArr.length; i++) {
				this.insertionPoints[ipNamesArr[i]] = new InsertionPoint({
					id: ipNamesArr[i],
					location: 'innerText',
					index: '',
					node: node,
					updateIPValueCallback: function(val){
						console.log('reached updateIPValueCallback', val);
					}

				})
			};
		},
		className: function(node){
			var cl = node.classList;
			console.log('reached className insertionPointHandler');
			for(var j = 0, len = cl.length; j < len; j++){
				if(ipRegEx.test(cl[j])){
					var ipName = cl[j].slice(2, cl[j].lastIndexOf('}'));
					this.insertionPoints[ipName] = new InsertionPoint({
						id: ipName,
						location: 'className',
						node: node,
						updateIPValueCallback: function(classArr){
							console.log('reached updateIPValueCallback for className', classArr);
							console.log(this);
							// remove the insertionPoint, since we already have a reference to it's domnode
							this.node.classList.remove('${' + this.id + '}');
							var classStr = classArr.join(' ');

							this.node.className =  (' ' + classStr);

							console.log(classStr);
						}
					});
				}
			}
		}
	}

	Template.prototype.updateData = function(data){
		console.dir(data.asdfHome.internal.value);

		if(data.asdfHome && data.asdfType == 'asdfObject'){
			console.log('a liveVar that has an object in it...');
			for(var key in data.asdfHome.internal.value){
				if(this.insertionPoints[key]){
					this.insertionPoints[key].updateIPValue(data.asdfHome.internal.value[key]);	
				}
			}

		}
		
	}

	// returns an array of insertionPoint names.
	function getIPNamesFromStr(str){

		return str.match(ipRegEx).map(function(ip){
			return ip.slice(2, ip.lastIndexOf('}'));
		});
	}

	function InsertionPoint(data){
		this.id = data.id;
		this.location = data.location;
		this.node = data.node;
		this.updateIPValueCallback = data.updateIPValueCallback;

		if(data.index){
			this.index = data.index
		}
	}

	InsertionPoint.prototype.updateIPValue = function(val){
		console.log('updateIPValue ', val);
		console.log(this);
		this.updateIPValueCallback.call(this, val);
	}



	ns = new Templates();

	return ns;
});