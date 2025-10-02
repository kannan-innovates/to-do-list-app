import React, { useState } from 'react'
import './TodoList.css'

function TodoList() {

     function handleInputChange(event){
          setNewTask(event.target.value)
          if (errorMessage) setErrorMessage('') 
     }

     // const [todos,setTodos] = useState([
     //      {id:1,text:"Learn React",completed:false},
     //      {id:2,text:"Learn MongoDB",completed:true},
     //      {id:3,text:"Learn JavaScript",completed:true}
     // ])

     const [todos,setTodos] = useState(()=>loadTodosFromLocalStorage())

     const [newTask,setNewTask] = useState('');

     const [editingid,setEditingid] = useState(null);

     const [editText,setEditText] = useState('');

     const [errorMessage, setErrorMessage] = useState('');

    
     function saveTodosToLocalStorage(todosArray){
          localStorage.setItem('todos',JSON.stringify(todosArray));
     }

     function loadTodosFromLocalStorage(){
          try {
               const saved = localStorage.getItem('todos');
               return saved ? JSON.parse(saved):[];
          } catch (error) {
               console.error(`Error in loading todos,${error}`);
               return []
          }
     }



     function addTodo(){
          const trimmedText = newTask.trim();
          if (trimmedText === '') {
               setErrorMessage('Please enter a task');
               return;
          }

          const todoItem = {
               id:Date.now(),
               text: trimmedText,
               completed: false
          }

          // setTodos([...todos,todoItem]) 
          const newTodos = [...todos,todoItem];
          setTodos(newTodos);
          saveTodosToLocalStorage(newTodos)
          setNewTask('')
          setErrorMessage('');
     }

     function toggleTodo(id){
         const updatedTodos = todos.map((todo) =>{
               if (todo.id === id){
                    return(
                         {
                              ...todo,
                              completed:!todo.completed,
                              
                         }
                    )
               }
               
               return todo;
         })
         setTodos(updatedTodos);
         saveTodosToLocalStorage(updatedTodos);
     }


     function deleteTodo(id){
          const updatedTodos  = todos.filter((todo) =>{
                return todo.id !== id
          })

          setTodos(updatedTodos);
          saveTodosToLocalStorage(updatedTodos);
     }

     function startEdit(id,currentText){
          setEditingid(id)
          setEditText(currentText)
     }

     function cancelEdit(){
          setEditingid(null)
          setEditText('');

     }
     function saveEdit(){     
          const trimmedText = editText.trim();
          if (trimmedText === '') {
          setErrorMessage('Task cannot be empty')
          return;
          }
     
          const updatedTodos = todos.map((todo) =>{
          if (todo.id === editingid){
               return {
                    ...todo,
                    text:trimmedText
               }
          }
          return todo
     })

          setTodos(updatedTodos);
          saveTodosToLocalStorage(updatedTodos); 
          setEditingid(null);
          setEditText('');
          setErrorMessage('') 
     }

     const incompleteTodos = todos.filter((todo) => todo.completed === false);
     const itemsLeft = incompleteTodos.length;

  return (
    <div className="todo-container">
     <h1 className="todo-header">My Todo App</h1>
     
     <div className="input-section">
          <input 
               type="text"
               className="todo-input"
               placeholder='Add a new Task'
               value={newTask}
               onChange={handleInputChange}
          />
          <button className="primary-btn" onClick={addTodo}>Add</button>
     </div>

     {errorMessage && (
     <div className="error-message">
          {errorMessage}
     </div>
     )}

     <ul className="todo-list">
          {todos.map((todo) =>{
               return(
               <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>

                    <input 
                         type="checkbox"
                         className="todo-checkbox" 
                         checked={todo.completed}
                         onChange={()=>toggleTodo(todo.id)}
                         
                         
                    />  

                    {editingid===todo.id ?(
                    <>
                         <input 
                              type="text"
                              className="edit-input"
                              value={editText} 
                              onChange={(e)=>setEditText(e.target.value)}
                         />
                         <div className="action-buttons">
                              <button className="action-btn" onClick={saveEdit}>Save</button>
                              <button className="action-btn" onClick={cancelEdit}>Cancel</button>
                         </div>
                    </> 
                    ):(
                    <>
                         <span className="todo-text">{todo.text}</span>

                         <div className="action-buttons">
                              <button className="action-btn" onClick={()=>startEdit(todo.id,todo.text)}>
                                   Edit
                              </button>

                              <button className="action-btn" onClick={()=> deleteTodo(todo.id)}>
                                   Delete
                              </button>
                         </div>  
                    </>
                    )}

               </li>
               )
          })}
     </ul>

     <div className="stats">
          <p className="stats-text">
               {itemsLeft} {itemsLeft === 1 ? 'task' : 'tasks'} left
          </p>
     </div>

    </div>
  )
}

export default TodoList