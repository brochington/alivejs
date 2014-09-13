define([
	'lodash'
	], function (_){

	var ns,
			ipRegEx = /\$\{(\w+)\}/g;
			ipSimpleRegEx = /\$\{(\w+)\}/;

	// constructor for Templates, which is a collection of Template objects.
	function Templates(){
		var self = this;

		this.__internal__ = {
			// tplNodeList: document.querySelectorAll('script[type="text/asdf-template"]'),
			tplNodeList: document.querySelectorAll('[data-template]'),
			tplNodeArr: [],
			tplKeys:[],
			templates: {}
		};
		
		for(var i = 0; i < this.__internal__.tplNodeList.length; i++){
			var node = this.__internal__.tplNodeList[i];

			// populate standard arr with template nodes so that we have something
			// to iterate over with methods like forEach, map, and such.
			this.__internal__.tplNodeArr.push(node);

			// populate internal templates object, that will serve as the target for
			// getters/setters on the main Templates object. 
			Object.defineProperty(this.__internal__.templates, node.attributes['data-template'].value, {
				value: new Template(node)
			});
		};

		// define properties on main Templates Object for each of the templates.
		this.__internal__.tplNodeArr.forEach(function(v, i, arr){

			self.__internal__.tplKeys.push(v.attributes['data-template'].value);

			Object.defineProperty(self, v.attributes['data-template'].value, {
				get: function(){
					return self.__internal__.templates[v.attributes['data-template'].value];
				},
				set: function(val){

				}
			})	
		});

	};

	Templates.prototype.getTemplateKeys = function(){
		var keysArr = [];
		for(var key in this.__internal__.templates){
			keysArr.push(key);
		}

		return keysArr;
	}

	// constructor for Template
	function Template(node){
		var self = this,
			nodeClone = node.cloneNode(true);

		// NOTE: removing the data-template attr, but it might
		//       be better to just use the contents instead.
		nodeClone.removeAttribute('data-template');

		this.id = node.attributes['data-template'].value; 
		this.originalDomNode = node;
		this.templateDomNodeClone = nodeClone;
		this.asdfType = 'asdfTemplate';
		this.insertionPoints = {};
		this.changesArr = [];
		this.instances = [];
		this.instancesCounter = 0;

	};

	Template.prototype.createTplInstance = function(domObjArr, configObj, type){
		var templateInstance = new TemplateInstance({
			originTemplate: this,
			id: this.instancesCounter++,
			domObjArr: domObjArr,
			originalConfigObj: configObj,
			type: type
		});

		this.instances.push(templateInstance);

		return templateInstance;
	};

	// constructor function for Template Instance
	function TemplateInstance(data){
		var nodeClone = data.originTemplate.originalDomNode.cloneNode(true);

		nodeClone.removeAttribute('data-template'); // make sure we can see it...

		this.originTemplate = data.originTemplate;
		this.id = data.id;
		this.domObjArray = data.domObjArr;
		this.instanceNodeClone = nodeClone;
		this.insertionPoints = {};
		this.domInsertPoint = null;
		this.attrToUse = null;
		this.originalConfigObj = data.originalConfigObj;
		this.type = data.type;

		this.processInsertionPoints(this.instanceNodeClone);
	}

	TemplateInstance.prototype.processInsertionPoints = function(node){
		var self = this;
		// detect if insertion points are being used in various parts
		// of the node, like classNames, attributes, innerText, etc.
		
		for(var i = 0, l = node.childNodes.length; i < l; i++){
			var cn = node.childNodes[i];

			// text child nodes
			if(cn.nodeName == '#text' && cn.data.indexOf('${') >= 0){
				this.insertionPointHandlers['innerText'].call(this, cn);
			};
			// classNames on nodes
			if(cn.classList && cn.classList.length > 0){
				this.insertionPointHandlers['className'].call(this, cn);
			};
		}

		if(node.children.length > 0){
			for(var i = 0,l=node.children.length;i<l;i++){
				this.processInsertionPoints(node.children[i]);
			}
		}
	}

	TemplateInstance.prototype.insertionPointHandlers = {
		innerText: function(node){
			var ipNamesArr = getIPNamesFromStr(node.nodeValue);

			for(var i = 0; i < ipNamesArr.length; i++) {
				this.insertionPoints[ipNamesArr[i]] = new InsertionPoint({
					id: ipNamesArr[i],
					idLength : ipNamesArr[i].length,
					originalIP : '${' + ipNamesArr[i] + '}',
					location: 'innerText',
					index: '',
					node: node,
					template: this,
					previousIPValue: null,
					start: null,
					end: null,
					updateIPValueCallback: function(val){
						var self = this,
							strToReplace = this.previousIPValue ? this.previousIPValue : this.originalIP;

						this.node.nodeValue = this.node.nodeValue.replace(strToReplace, val);
						this.previousIPValue = val;
					}
				})
			};
		},
		className: function(node){
			var cl = node.classList;

			for(var j = 0, len = cl.length; j < len; j++){
				var regExtest = ipSimpleRegEx.test(cl[j]);

				if(regExtest){
					var ipName = cl[j].slice(2, cl[j].lastIndexOf('}'));
					this.insertionPoints[ipName] = new InsertionPoint({
						id: ipName,
						location: 'className',
						node: node,
						previousClassNames: [],
						updateIPValueCallback: function(classArr){
							var self = this,
								classNameStr = this.node.className,
								newClassesStr = classArr.join(' '),
								prevClassStr = this.previousClassNames.join(' ');

							classNameStr = removeIPfromStr(classNameStr,  this.id) + ' ';



							// remove all the classes from the previous class array.
							for(var i = 0, l = this.previousClassNames.length; i <l; i++){
								if(classNameStr.indexOf(this.previousClassNames[i]) >= 0){
									classNameStr = classNameStr.split(this.previousClassNames[i]).join(' ');

									if(classNameStr.indexOf(' ') == 0){
										classNameStr = classNameStr.substr(1);
									}
								}
							}

							// add the new classes to the string with the previous classes omitted.
							classNameStr += classArr.join(' '); 

							// add the new class string to the dome node.
							// TODO: className isn't being created correctly, adding a lot of extra 
							// spaces to the class name.
							this.node.className = classNameStr;

							// make sure we save the previous class names.
							this.previousClassNames = classArr;
						}
					});
				}
			}
		}
	}

	TemplateInstance.prototype.updateData = function(data, domObjArray){
		console.log('updateData', domObjArray);
		console.log(this);
		console.log(data);
		if(data.asdfHome && data.asdfType == 'asdfObject'){
			for(var key in data.asdfHome.internal.value){
				if(this.insertionPoints[key]){
					this.insertionPoints[key].updateIPValue(data.asdfHome.internal.value[key]);	
				}
			}
		}
		if(this.type == 'insert'){
			for(var key in this.insertionPoints){
				console.log(key);
				// console.log(data.asdfHome.internal.value[this.attrToUse]);
				console.log(this.attrToUse);

				if(this.insertionPoints[key]){

					// this.insertionPoints[key].updateIPValue(data.asdfHome.internal.value[this.attrToUse][key]);	
				}
			}
			this.insertNodeToDom();	
		} else {
			this.pushNodeToDom();			
		}	
	}

	TemplateInstance.prototype.pushNodeToDom = function(){
		var nodes = this.domObjArray.getDomNodes();

		for (var i = 0; i < nodes.length; i++) {
			nodes[i].appendChild(this.instanceNodeClone);
		};
	}

	TemplateInstance.prototype.insertNodeToDom = function(){
		console.log('insertNodeToDom');
		var nodes = this.domObjArray.getDomNodes();
		console.log(nodes);
		console.log(this);

		for (var i = this.domInsertPoint.length - 1; i >= 0; i--) {
			this.domInsertPoint[i].appendChild(this.instanceNodeClone);
			// console.log(this.domInsertPoint[i].);
		};
	}

	// returns an array of insertionPoint names.
	function getIPNamesFromStr(str){

		return str.match(ipRegEx).map(function(ip){
			return ip.slice(2, ip.lastIndexOf('}'));
		});
	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	// returns a string with the insertioPoint name removed.
	function removeIPfromStr(str, ipName){
		var newStr = str.split('${' + ipName + '}').join('');

		if(newStr.indexOf(' ') == 0){
			newStr = newStr.substr(1);
		}
		return newStr;
	}

	function InsertionPoint(data){

		for(var key in data){
			this[key] = data[key];
		}
	}

	InsertionPoint.prototype.updateIPValue = function(val){
		this.updateIPValueCallback.call(this, val);
	}



	ns = new Templates();

	return ns;
});