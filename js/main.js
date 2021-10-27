import Todos from './Todos.js';

const todo = new Todos('tasks');

/**
 *      when the page is loaded
 *          show the todo lists stored in LS
 *          add event listeners to the LIs
 */
window.addEventListener('load', () => {
    todo.showToDoList();
    todo.addTabListeners();
});

//  when the ADD button is pressed...
const nTask= document.getElementById('add');
nTask.addEventListener('click', () =>  todo.addToDo() );

