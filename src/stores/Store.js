import { ref as vueRef, watch } from 'vue';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

import { ref as firebaseRef, getDatabase, push, set, get, child, update, remove } from 'firebase/database';

import { useUserStore } from './Userstore.js'

export const useTodoStore = defineStore("todostore", () => {

    const Errormessage = vueRef(null);
    const todolist = vueRef([]);
    const addingTodo = vueRef(false);
    const userstore = useUserStore();
    const FinalScore = vueRef(0)
    const Message = vueRef(null)
    
    




const calculateDaysLeft = (deadline) => {
  const today = new Date();
  const endDate = new Date(deadline);
  const timeDiff = endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysLeft >= 0 ? daysLeft : 'Overdue';
};


const removetodo = (id) => {
	
	if(userstore.isLogin){
	  const TodoRef = firebaseRef(getDatabase(), `todos/${userstore.user}/pending/${id}`);
	  todolist.value = todolist.value.filter(todo => todo.id !== id);
	  remove(TodoRef)
	  
	}
	else{

let localTodo = JSON.parse(localStorage.getItem('todo'));
todolist.value = localTodo.filter(todo => todo.id !== id);
localStorage.setItem('todo', JSON.stringify(todolist.value));

	  
	}
	
}



const edittodo = (id, updated_todo) => {
	
	const TodoItem = {... updated_todo};
	if(userstore.isLogin){
	const TodoRef = firebaseRef(getDatabase(), `todos/${userstore.user}/pending/${id}`);
	
	todolist.value = todolist.value.filter(todo => todo.id !== id);
	
	remove(TodoRef)
            set(TodoRef, TodoItem)
                .then(() => {
                    addingTodo.value = false;
                })
                .catch((error) => {
                    console.error('Error adding todo:', error);
                    addingTodo.value = false;
                });
                
      todolist.value.push(TodoItem)
	}
	else{
	  todolist.value = todolist.value.filter(todo => todo.id !== id);
	  todolist.value.push(TodoItem)
	  localStorage.setItem('todo', JSON.stringify(todolist.value));
	}
	
}


const addscore = async (deadline) => {
    const dbref = firebaseRef(getDatabase());
    try {
        const is_day_left = await calculateDaysLeft(deadline);

        const scoreRef = child(dbref, `todos/score/${userstore.user}`);
        const snapshot = await get(scoreRef);

        let currentScore = snapshot.exists() ? snapshot.val().score || 0 : 0;

        if (is_day_left !== "Overdue") {
            // Increment the score if not overdue
            currentScore += 1;
            
            await update(scoreRef, { score: currentScore   });
            Message.value = "Score updated successfully.";
            
            setTimeout(() => {
				Message.value = null;
			}, 3000); // Auto-clear after 3 seconds
		
        } else {
            
            
            // Decrement the score in the overdue case
            currentScore = Math.max(currentScore - 1, 0); // Ensure score does not go negative

            
            
            await update(scoreRef, { score: currentScore });
            
            Message.value = "Score decremented for overdue todo.";
            //alert(JSON.stringify(Message.value))
            setTimeout(() => {
				Message.value = null;
			}, 3000); // Auto-clear after 3 seconds
		
        }

    } catch (error) {
        Errormessage.value = ('Error: ' + error.message);
        setTimeout(() => {
				Errormessage.value = null;
			}, 3000); 
    }
};



const completedTodo = async (id) => {
  
	const todo = todolist.value.find(todo => todo.id === id); // Use === for comparison
	if(userstore.isLogin){
		if (todo) {
			
			// Mark the todo as completed
			todo.completed = true;
			// Reference for completed todos
			const completedRef = firebaseRef(getDatabase(), `todos/${userstore.user}/completed/${todo.id}`);
			const formattedDate = new Date().toISOString().slice(0, 10);
			const promote_to_completed = { ...todo, completed_on: formattedDate };
			try {
				// Update the completed todo
				await update(completedRef, promote_to_completed);
				// Reference for original todos
				const deleteRef = firebaseRef(getDatabase(), `todos/${userstore.user}/pending/${todo.id}`);
				// Remove the original todo
				await remove(deleteRef);
				// Update the local todo list
				todolist.value = todolist.value.filter(t => t.id !== id);
				
				const is_day_left = await calculateDaysLeft(todo.deadline);
				
				const overdueRef = firebaseRef(getDatabase(), `todos/${userstore.user}/overdue/${todo.id}`);
				if (is_day_left == "Overdue") {
					await set(overdueRef, promote_to_completed);
					addingTodo.value = false;
				}
				
				await addscore(todo.deadline);
			} catch (error) {
				Errormessage.value = ('Error updating todo: ' + error.message);
				setTimeout(() => {
					Errormessage.value = null;
				}, 3000); 
			}
			
		}
	} else {
		let localTodo = JSON.parse(localStorage.getItem('todo'));
		todolist.value = localTodo.filter(todo => todo.id !== id);
		localStorage.setItem('todo', JSON.stringify(todolist.value));
	}
};


    const addTodo = (NewTodo) => {
        addingTodo.value = true;
        const TodoItem = { ...NewTodo, id: uuidv4() };
        //alert(userstore.user)
        if (userstore.user && userstore.isLogin) {
            
            //alert("uid: " + userstore.user + " is logged in: " + userstore.isLogin);
            const TodoRef = firebaseRef(getDatabase(), `todos/${userstore.user}/pending/${TodoItem.id}`);

            set(TodoRef, TodoItem)
                .then(() => {
                    addingTodo.value = false;
                    todolist.value.push(TodoItem);
                })
                .catch((error) => {
                    console.error('Error adding todo:', error);
                    addingTodo.value = false;
                });
        } else {
            todolist.value.push(TodoItem);
            localStorage.setItem('todo', JSON.stringify(todolist.value));
            addingTodo.value = false;
        }
    };

    const transformData = (data) => {
        const transformedData = [];
        for (const uuid in data) {
            if (data.hasOwnProperty(uuid)) {
                const task = {
                    title: data[uuid].title,
                    description: data[uuid].description,
                    category: data[uuid].category,
                    deadline: data[uuid].deadline,
                    completed: data[uuid].completed,
                    id: uuid
                };
                transformedData.push(task);
            }
        }
        return transformedData;
    };

    const gettodo = async (user) => {
        try {
            const dbRef = firebaseRef(getDatabase());
            const snapshot = await get(child(dbRef, `todos/${user}/pending`));

            if (snapshot.exists()) {
                //(JSON.stringify(snapshot.val()))
                todolist.value = transformData(snapshot.val());
                //(JSON.stringify(todolist.value))
            } else {
              
              
                Errormessage.value = ('No value found' );
                setTimeout(() => {
				Errormessage.value = null;
			}, 3000); 
                
            }
        } catch (error) {
            Errormessage.value = ('Error fetching data: ' + error);
            setTimeout(() => {
				Errormessage.value = null;
			}, 3000); 
        }
    };
    /*
    	const IsLoggedIn = computed(() => userstore.isLogin);
    	
    	onmounted(() => {
    	  if(IsLoggedIn.value){
    	    
    	  }
    	});
    	*/

    watch(
        () => userstore.isLogin,
        (newValue) => {
            if (!newValue) {
                const storedTodos = localStorage.getItem('todo');
                if (storedTodos) {
                    try {

                        todolist.value = JSON.parse(storedTodos);

                    } catch (error) {
                        console.error('Failed to parse todos from localStorage:', error);
                        todolist.value = [];
                    }
                } else {
                    console.log('No todos found in local storage');
                }
            } else {
                gettodo(userstore.user);

            }
        }
    );

    return { todolist, addTodo, Errormessage, addingTodo, completedTodo, Message,edittodo,removetodo };
});