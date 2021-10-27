import * as lsH from './ls.js';
//  import * as uH from './utilities.js';       //  not using but they are a good reference for exports

let todoList = [];      //  initialize the todoList to be an empty array

/**
 *  The Todos object will have all of the data and methods to manage a Todo object
 */
export default class Todos {
    constructor(id) {
        this.element = document.getElementById(id);
        this.key = this.element.id;
    }

    /**
     *
     */
    showToDoList(){
        getToDo(this.key);                          //  this will initialize our variable todoList to the current list of todos
        renderToDoList(this.element, todoList);     //  pass a list of todos to the render function
        if(todoList != null){
            this.addEventListeners();
        }
    }

    /**
     *
     */
    addToDo(){
        const task = document.getElementById('new-task');
        saveTodo(task, this.key);
        this.showToDoList();
    }

    /**
     *      addEventListeners
     *          for each task there are two events we need to track
     *          child 0 of the LI is the check box to indicate completed or not
     *          child 2 of the LI is the delete button
     */
    addEventListeners() {
        const ls = Array.from(this.element.children);       //  get an array of the LIs in the UL (the children)
        if (ls.length > 0 && ls[0].children[0]) {
        ls.forEach(item => {
            item.children[0].addEventListener('click', event =>  this.completeToDo(event.currentTarget.id) );
            item.children[2].addEventListener('click', event =>  this.removeItem(event.currentTarget.id)   );
        })}
    }

    /**
     *      completeToDo
     *          toggle the completed status of the selected task item
     * @param itId          element selected by the user
     */
    completeToDo(itId) {
        let t = todoList.findIndex(task => task.id == itId);       //  find the desired task using the unique timestamp for this LI
        todoList[t].completed = !todoList[t].completed;             //  toggle the completed status
        lsH.writeToLS(this.key, todoList);                          //  update LS
        markDone(itId);                                             //  change the class for this element to reflect the new status
    }

    /**
     *      filterToDos
     *          depending on the button pressed filter the list of todos
     * @param category      the id of the button pressed 'all', 'completed', 'active'
     */
    filterToDos(category){
        category = filterBy(category);
        const f = todoList.filter(task =>  (category != null) ? task.completed === category : task );
        renderToDoList(this.element, f);        //  now we have a list todos of the desired type
        this.addEventListeners();               //  since we wiped out all of the old HTML we need at attach event listeners for the new LIs
    }

    /**
     *      addTabListeners
     *          scan the page elements for any elements with class containing 'tab'
     *          these are our all, active and completed buttons.
     *          they need to respond by rendering a list of todos that match the category type
     */
    addTabListeners() {
        const lsT = Array.from(document.querySelectorAll('.tab'));
        lsT.forEach(tab => {
            tab.addEventListener('click', event => {
                for (let item in lsT) {
                    lsT[item].classList.remove('selected-tab');
                }
                event.currentTarget.classList.add('selected-tab');
                this.filterToDos(event.currentTarget.id);
            })
        })    
    }

    /**
     *      removeItem
     *          an LI has been clicked. remove from screen, LS and todoList
     * @param itID
     */
    removeItem(itID) {
        let t = todoList.findIndex(task => task.id == itID);
        todoList.splice(t, 1);
        lsH.writeToLS(this.key, todoList);
        this.showToDoList();
    }
}

/**
 *      filterBy
 *          We need to convert the id of the button pressed to match the category of the todo
 *              an active todo item has a completed status of false, completed has a status of true
 *              if we are looking for all todo tasks we will return null
 * @param category
 * @returns {null|boolean}
 */
function filterBy(category){
    switch(category){
        case 'active':      return  false;      //  the less code I write the less I have to debug
        case 'complete':    return  true;       //  so sue me if I have multiple return points in my method
        case 'all':         return  true;       //  so sue me if I have multiple return points in my method
        default :           return  null;       //  which by the way is not a good practice.
    }                                           //  but in code this small it is worth the gamble
}

/**
 *      getToDo
 *          read local storage and retrieve the previously saved todos
 *          if the LS key returns nothing then init the toDoList to []
 *          otherwise the LS contained a array of JSON todos. assign that to the todoList
 * @param key
 * @returns {*[]}
 */
function getToDo(key) {
    let ls = lsH.readFromLS(key);           //  ask LS for the value associated with the key
    todoList = ls === null ? [] : ls;       //  if nothing is return init todoList to an empty string else assign it the list from LS
    return todoList;
}

/**
 *      saveTodo
 *          create a new todo item and save to LS
 * @param task      the reference to our input field
 * @param key       key to our LS item where the todo list will be saved
 */
function saveTodo(task, key) {
    let t = getToDo(key);           //  this should NOT be necessary since the todoList is a global and should always be accurate
    let timestamp = Date.now();     //  this unique value will serve as the id for our todo item
    const newTodo = {id: timestamp, content: task.value, completed: false};     //  note we default to NOT completed
    t.push(newTodo);                //  save new task item to our big list of todos
    lsH.writeToLS(key,t);           //  save our list of all todo items
    task.value = '';                //  clear the text of the input field
    task.focus();                   //  for a nice touch keep the focus in the input field
}

/**
 *      renderToDoList
 *          Give this function a list of todos and the UL to which they should be added
 * @param unorderedList
 * @param ls
 */
function renderToDoList(unorderedList, ls) {
    unorderedList.innerHTML = '';                       //  let's clear out all old to-dos
    if(ls != null && ls.length > 0) {       //  Make sure we have some to dos to show
                                            //  one at a time grab a todo object an put it in our list
        ls.forEach(taskObject => unorderedList.innerHTML += renderOneToDo(taskObject) );
    }
    updateCount(ls);
}

/**
 *      renderOneToDo
 *          Some examples you will will show a combination of DOM methods (createElement) and plain old HTML
 *          I find that confusing.
 *          DOM is confusing by itself (I think)
 *          So I prefer just recreating HTML and stuffing that into the innerHTML of the target element
 * @param task          the task we are creating the HTML for
 * @returns {string}    the HTML for one todo item
 */
function renderOneToDo(task) {
    //      NOTE: I am using the back tick ` character which allows be to INTERPOLATE javascript with the text
    //          if you see ${} you can put any JS in there you like and let that insert your values for you
    //          MUCH better that "string" + variable + "plus another string"
    //      I do have some trickiness going on here. If the task is Complete then I want
    //          the class to be 'completed' and the checkbox to be marked with a check.
    //          So I do a 2fer1. I have the ternary operator (a.k.a. elvis operator)  ?:
    //          if the task is completed the class attribute will be 'completed' and the checkbox will be checked
    //          otherwise I just need an empty string
    return `<li>
        <input id="${task.id}" name="${task.content}" type="checkbox" value="none" ${task.completed ? 'class="completed" checked' : ''}>
        <label for="${task.id}">${task.content}</label>
        <div class="delete">X</div>
    </li>`;
}

/**
 *  updateCount
 *      for whatever list we are rendering show the count of items
 * @param ls
 */
function updateCount(ls){
    document.getElementById('num-task').innerHTML =  `${(ls != null) ? ls.length : 0}  tasks left`;
}

/**
 *  markDone
 *      using the element that was clicked get the parent.
 *      then toggle the completed class so the CSS can render the element correctly
 * @param itId      this is the clicked on text
 */
function markDone(itId){
    document.getElementById(itId).parentElement.classList.toggle('completed');
}