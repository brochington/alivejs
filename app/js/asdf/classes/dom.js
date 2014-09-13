define([
	'lodash',
	'vendor/lazy',
	'asdf/classes/utility',
	'asdf/classes/template',
	'asdf/classes/pubsub',
	'asdf/classes/bindings'
	], function (_, Lazy, utils, tpl, ps, bindings){

	var ns = {
			playgroundNodeList: null, // holds the playground NodeList.
			playgrounds: [], // array of references to playground dome nodes. 
			asdfTemplateNodes: [],
			asdfTemplates: {},
		},
		domNodeCacheObj = {}, // stores references to Dom nodes.
		domObjects = {};

	function DomObj(domNode) {
		var self = this;

		this.__internal__ = {
			domNode: domNode,
			styleObj: {},
			computedStyles: window.getComputedStyle(domNode),
			lastStyleValues: {},
			styleKeys: Object.keys(domNode.style),
			renderConfigObj: null
		};

		this.__internal__.styleKeys.forEach(function(v, i, arr){
			Object.defineProperty(self.__internal__.lastStyleValues, v, {
				value: self.__internal__.computedStyles[v]
			})

			Object.defineProperty(self.__internal__.styleObj, v, {
				value: new DomStyleObj(v)
			});

			Object.defineProperty(self, v, {
				get: function(){
					consoele.log('get DomObj');
					return self.__internal__.computedStyles[v];
				},
				set: function(val){
					var varType = utils.determineType(val);

					if(varType === 'String' || varType === 'Number' || varType === 'Boolean'){

						self.updateStyle({
							style: v, 
							value: val
						});
					}
				}
			})
		});
	};

	DomObj.prototype.rawDomNode = function(){
		return this.__internal__.domNode;
	};

	DomObj.prototype.updateStyles = function(){

		this.styleObj.styleUpdateArr.forEach(function(v, i, arr){

		});
	};

	DomObj.prototype.updateStyle = function(data){
		var i = this.__internal__;

		// save value of last style. (why?)
		i.lastStyleValues[data.style] = i.computedStyles[data.style];
		// set the css prop val;
		i.domNode.style[data.style] = data.value;

		i.computedStyles = window.getComputedStyle(i.domNode);
	};

	DomObj.prototype.replaceInnerHTML = function(data){
		// NOTE: this should use document fragments to help reduce render times...
		// console.log(this.__internal__.domNode.innerHTML);
		this.__internal__.domNode.innerHTML = data;
	};

	DomObj.prototype.appendChild = function(data){
		// this.__internal__.domNode.appendChild(data);

		this.__internal__.domNode.insertAdjacentHTML('beforeend', data);
	};

	// An Array of Dom Objects, Used in handling of classes, and Id's.
	function DomObjArray(data, template, propName, propType){
		var self = this,
			testObj = {};


		this.__internal__ = {
			DomObjArr: [new DomObj(data)],
			template: template || null,
			templateInstance: null,
			configObj: null,
			propName: propName,
			propType: propType
		};

		// add properties of the style names to the DomObjArray
		this.__internal__.DomObjArr[0].__internal__.styleKeys.forEach(function (v, i, arr){
			Object.defineProperty(self, v, {
				get: function(){

					// return an object that has the dom nodes, and the values associated with
					// the style prop that has been asked for.
				},
				set: function(val){
					self.updateStyleProp(v, val);
				}
			})
		})
		// create properties on the main node for each style property.
	};
	// set the prototype of the DomObjArray so that it can access array methods.
	DomObjArray.prototype = new Array();

	// a method created to be able to safely add a domNode to a DomObjArray
	DomObjArray.prototype.pushDomNode = function(domNode){
		// console.log('reached pushDomNode');
		this.push(domNode);

		this.__internal__.DomObjArr.push(new DomObj(domNode));
	};

	DomObjArray.prototype.getDomNodes = function(){
		 var tempArr = [];

		 for(var i = 0, l = this.__internal__.DomObjArr.length; i<l; i++){
		 	tempArr.push(this.__internal__.DomObjArr[i].__internal__.domNode);
		 }

		return tempArr;
	}

	//TODO: directives/databinding can be placed on the DomObjArray.prototype...

	DomObjArray.prototype.updateStyleProp = function(propName, val){
		// console.log('updating: ', propName, val, this);

		for(var i = 0, l = this.__internal__.DomObjArr.length; i<l;i++){
			var domObj = this.__internal__.DomObjArr[i];
				
			if(propName !== 'length'){
				domObj.updateStyle({
					style: propName, 
					value: val
					}
				);	
			}
		}
	};

	DomObjArray.prototype.updateAllDom = function(){
		console.log('updateAllDom');
	};

	DomObjArray.prototype.setDomObjConfig = function(configObj){
		// set configObj 
		this.__internal__.configObj = configObj || null;

		// setting template used inside of domNode being targeted with DomObjArray.
		if(configObj.template){
			this.__internal__.template = configObj.template;
			this.__internal__.templateInstance = configObj.template.createTplInstance(this, configObj);
		};


		// cycle through the properties sent to the d.list object.
		// need to make sure they are done in the right sequence...
		if(configObj.parentData){
			this.setDomObjConfigHandlers['parentData'].call(this, configObj);
		}
		if(configObj.template){
			this.setDomObjConfigHandlers['template'].call(this, configObj);
		}
		if(configObj.data){
			this.setDomObjConfigHandlers['data'].call(this, configObj);
		}
		if(configObj.each){
			this.setDomObjConfigHandlers['each'].call(this, configObj);
		}
		// this is where we can add more 'directives/bindings'.
		// TODO: Figure out some way to allow users to add there own...
		// maybe gather the ones added to the prototype?
		// console.log(this);
		for(var prop in configObj){
			//TODO: get rid of this, and do some proper checking.
			if(prop !== 'template' && prop !== 'data' && prop !== 'each' && prop !== 'parentData'){
				this.setDomObjConfigHandlers[prop].call(this, configObj);	
			}
		}

		// trigger adding of all Dom nodes to actual Dom
		// this.updateAllDom();
		this.__internal__.templateInstance.pushNodeToDom();

	};

	DomObjArray.prototype.setDomObjConfigHandlers = {
		data: function(){
			// data can (should?) be a liveVar/liveFunc
		},
		template: function(){
			var tpl = this.__internal__.template,
				co = this.__internal__.configObj,
				tpli = this.__internal__.templateInstance;

			if(tpl && tpl.asdfType == 'asdfTemplate'){
				// console.log('template: ', this);
				if(co.data && co.data.asdfType == 'asdfObject'){
					for(var key in co.data.asdfHome.internal.value){
						// if the key name matches an insertion point...
						if(tpli.insertionPoints[key]){
							tpli.insertionPoints[key].updateIPValue(co.data.asdfHome.internal.value[key]);
						}
					}
					console.log(co.data.asdfHome.internal.name);
					ps.subscribe(co.data.asdfHome.internal.name, tpli.updateData.bind(tpli, co.data, this));
				} 

				// tpli.pushNodeToDom();
			};
		},
		each: function(){
			var co = this.__internal__.configObj;

			if(co.data){
				if(co.each.insert){
					//subscribe to changes in the insert d.whatever.
					ps.subscribe('DomObjArray_' + co.each.insert.__internal__.propName, this.processForEachInsert.bind(this));
				}
			}
		},
		parentData: function(){
			//
		},
	}

	DomObjArray.prototype.processForEachInsert = function(propName){
		var self = this,
			tempTpliArr = [],
			cdoa = domObjects[propName],
			co = this.__internal__.configObj,
			destDom = null,
			attrToUse = co.each.data || cdoa.__internal__.configObj.parentData,
			clone = this.__internal__.templateInstance.instanceNodeClone;

		console.log(this);
		console.log(domObjects[propName]);

		for(var i = 0, l = co.data[attrToUse].length; i<l;i++){
			var tplInstance = cdoa.__internal__.template.createTplInstance(cdoa, cdoa.__internal__.configObj, 'insert');

			destDom = null;

			if(cdoa.__internal__.propType == 'class'){
				console.log('processing as class');
				destDom = clone.getElementsByClassName(propName);
			}
			
			for(var key in cdoa.__internal__.templateInstance.insertionPoints){
				console.log();
				tplInstance.domInsertPoint = destDom;
				tplInstance.attrToUse = attrToUse;
				tplInstance.insertionPoints[key].updateIPValue(co.data[attrToUse][i][key]);
				
			}	
			console.log(co.data.asdfHome.internal.name);
			ps.subscribe(co.data.asdfHome.internal.name, tplInstance.updateData.bind(tplInstance, co.data[attrToUse], this));
			tplInstance.insertNodeToDom();

		}
	}

	// Constructor for styles obj.
	function DomStyleObj(styleName){
		
		this.styleName = styleName;
	};

	function getStyleName(styleName){
		console.log(styleName);
		return styleName;
	};

	// Playground Contructor
	function Playground(domNode){

		this.domNode = domNode;

		this.fillDomNodeCacheArr(domNode);
	};

	Playground.prototype.fillDomNodeCacheArr = function(domNode, template){
		if(domNode && domNode.children){
			for(var i = 0; i < domNode.children.length; i++){
				var child = domNode.children[i];

				if(child){
					this.processDomNodeAsProp(child, template);
				}
				if(domNode.children[i].children){
					this.fillDomNodeCacheArr(domNode.children[i], template);
				};
			}
		}
	}

	Playground.prototype.processDomNodeAsProp = function(domNode, template){
		if(domNode.id && !ns.hasOwnProperty(domNode.id)){
			this.defineDomNodeAsProp(domNode, domNode.id, template, 'id');
		}
		if(domNode.classList.length > 0){
			for(var i = 0, l = domNode.classList.length; i<l; i++){
				var className = domNode.classList[i];

				//check to see if className has already been added to 
				// the ns object.
				if(ns.hasOwnProperty(className)){
					domObjects[className].pushDomNode(domNode);
					// add className to appropriate objects. 
				
				} else{
					this.defineDomNodeAsProp(domNode, className, template, 'class');
				}

			}
		}
	}

	Playground.prototype.defineDomNodeAsProp = function(domNode, propName, template, propType){
		var self = this;

		Object.defineProperty(domNodeCacheObj, propName, {
			value: domNode
		});

		Object.defineProperty(domObjects, propName, {
			value: new DomObjArray(domNode, template, propName, propType)
		});

		Object.defineProperty(ns, propName, {
			get: function(){
				return domObjects[propName];
			},
			set: function(val){
				domObjects[propName].setDomObjConfig(val);
				console.log(propName, val);
				console.log('DomObjArray_' + propName);
				ps.publish('DomObjArray_' + propName, [propName]);
			}
		});
		// set an array value in the newly created DomObjArray as part of
		// the init process.
		domObjects[propName].push(domNode);
	}

	function processTemplateDom(){

		if(tpl){
			for(var i=0,l=tpl.__internal__.tplKeys.length;i<l;i++){
				var key = tpl.__internal__.tplKeys[i],
				 	template = tpl.__internal__.templates[key];

				Playground.prototype.fillDomNodeCacheArr(template.originalDomNode, template);
				// I would like to add some kind of reference to the template so
				// that we know which template it belongs in/to.
			}
		}
	}

	// It doesn't make sense to make a d domeNode for EVERY
	// dom node on the page, so we create playgrounds, where
	// all the elements inside are created on the d object. 
	function initAsdfPlaygrounds(){
		//NOTE: ns.playgroundNodeList is a NodeList, NOT an array!
		ns.playgroundNodeList = document.querySelectorAll('[data-playground]');

		for(var i = 0; i < ns.playgroundNodeList.length; i++){
			var node = ns.playgroundNodeList[i];
			// fillDomNodeCacheArr(node);
			// ns.playgrounds.push(node);
			ns.playgrounds.push(new Playground(node))
		};
	};

	function initDom(){
		initAsdfPlaygrounds();
		processTemplateDom();
	};

	// maybe this should be an IIFE instead?
	initDom();

	return ns;
});