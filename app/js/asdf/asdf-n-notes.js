// asdf usecase:

// Question: how am I going to take out logic from the template portion of the code?

// create forEach of a domNode... 

// Create a basic todo app, starting with a simple click on elements appends a dom node into another.

d.clickBtn = new asdfEvent('stuff', function(){console.log('stuff, man.')});


domNode.onclick = function(){
	console.log('traditional...');
	$('.something').append(templateThing);
};

a.newVar.events('appendDom', {
	click: function(ev, curried){

	},
	dragover: function(ev)

})

a.myVar = d.clickBtn.click('curryValue');

//controller replacement...

// example of 
<button type="button" class="clickBtn">Add Task</button>
<input type="textarea" class="someTextArea">

<div class="containerDom">
	hello, ${name}!
	${tasks}
</div>

// prevent showing of templates by assigning a 'display: none' to them?
<div class="task" data-asdfTemplate>
	task #${taskNumber}.
</div>

d.containerDom.forEach(d.task, [{taskNumber: 1},{taskNumber: 2}]);
// or
d.containerDom.forEach(d.task, a.tasks);

d.containerDom.forEach(/*d to repeat*/, /*array of objects with props to use in each d*/)
d.containerDom.ifElse(/*arg to evaluate*/, /*if true*/, /*else*/);
d.containerDom.show(a.showContainerDom);
d.containerDom.actions({
	show: a.showContainerDom,
	ifElse: [/*arg to evaluate*/, /*if true*/, /*else*/]
});

/*****************************************/
a.newVar('tasks', []);

a.tasks.events({
	click: function(ev, selfValue){
		selfValue.push(new Task(ev));
	}
});

// OR:

a.newVar('tasks', []).events({
	click: function(ev, selfValue){
		selfValue.push(new Task(ev));
	}
});

/*****************************************/

a.tasks = d.clickBtn.click;

d.containerDom.forEach(d.task, a.tasks);

a.newVar('inputValue', {
	get: function(){

	},
	set: function(val) {

	}
	internalValue: 
})


a.inputValue = d.someTextArea.value;


/*
NOTE: in a render method that is attached to the d.domNode, the properties should match
method names, and should essentially be the left hand side of a knockout binding.
This way they can be user created, and maybe allow for things like animations and such...
*/

// ideas for databinding method, 
a.live('contentListArr', [
	{first: 'Broch', last: 'Stilley'},
	{first: 'Elmo', last: 'Dude'},
	{first: 'Brad', last: 'Howard'}
]);

d.content_list.render({
	template: t.line_item, // this should be a liveVar too, able to be changed.
	foreach: a.contentListArr
});

/*
What am I going to do about embeded templates, and how are they going to get info from it's parent template?
Should I create some form of partial? 
*/

<div id="test-playground">
    <div id="my_container">

    </div>
</div>        

d.my_container.bindings({
	template: 'item',
	forEach: a.someArray,
});

// template 1
<script id="item" type="text/asdf-template">
    
</script>

/* TODO: 
	- scan templates when they are "gotten" so that the classes and ids are added to the d object.
	- handle both ids and classes.
*/

- No logic in the template!

// setting up info for d.someNode...
// get is an internal DomNode, set is something else....

// setting a property...
d.someNode.backgroundColor = 'blue';
// binding a liveVar to a dom style prop.
d.someNode.height = a.someHeight;
// 

/*******************************************************************************************************/
// sample todoApp...



function List(data){
	var self = this;

	this.listItems = [];

	data.listItems.forEach(function (v, i, arr){
		self.listItems.push(new ListItem(v));
	});
};

List.prototype.addListItem = function(data){
	this.listItems.push(new ListItem(data));
};

function ListItem(data){
	var self = this;

	this.text = data.text;
	this.isChecked = data.isChecked;
};

a.liveVar('list', new List(data));

// d.list is where the list will be placed in the dom
// d.add is scoped to the d.list.
d.list = {
	template: a.someTemplateName, // what template will be used for content in d.list
	data: a.list, // data to use in rendering of template 
	forEach: {
		data: a.list.listItems,
		template: t.list_item,
		insert: d.list_items
	},
	something: d.add.onClick
};

d.list.prototype.something = function(ev){

}

d.list_item = {
	template: self.template,
	data: self // this could be implied.
	updateCheck: d.checkbox1.onchange
};

//


// creates the function...
d.list_item.prototype.updateCheck = function(ev){

}

// triggers and updates the function...
d.list_item.updateCheck = d.checkbox_1.onchange;

a.list.onClick = function(ev){
	//update a.list in some special way...
}

a.list = d.list.onClick;



// template for list...
<script id="list" type="text/asdf-template">
	<button class="add">
	<div class="list_items"></div>
</script>

<script id="list_item" type="text/asdf-template">
    <span>${text}</span>
    <input class="checkbox_1" type="checkbox" value="${isChecked}"><>
</script>

// template for listItem.....





