<script setup>
import { ref , watch } from 'vue';
import { CircleX , SquarePlus ,CircleCheck, Pencil , Trash2 , Clock} from 'lucide-vue-next';

import { useTodoStore } from '../stores/Store.js'; // Import the store

import Errormessage from "../components/ErrorMessage.vue"
import AlertBox from '../components/AlertComponent.vue';
const calculateDaysLeft = (deadline) => {
  const today = new Date();
  const endDate = new Date(deadline);
  const timeDiff = endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysLeft >= 0 ? daysLeft : 'Overdue';
};


const title = ref('');
const description = ref('');
const category = ref('');
const deadline = ref(''); 
const want_to_edit = ref(false)
const id_for_update_task = ref(null)
// Access the store
const todoStore = useTodoStore();
const setTodoAsComplete = (id) => {
  todoStore.completedTodo(id)
  
}
const addtask = () => {
  //const selectedDate = selectedDateDesktop.value || selectedDateMobile.value;
  want_to_edit.value = false
	if (!title.value || !deadline.value) {
		alert('Please fill title and date');
		
		return;
	}
	
	// Create new todo object
	const newTodo = {
		title: title.value,
		description: description.value,
		category: category.value,
		deadline: deadline.value,
		completed: false,
	};
	
	// Add the new task using the store
	todoStore.addTodo(newTodo);

	// Reset the form fields
	title.value = '';
	description.value = '';
	category.value = '';
	deadline.value = '';
	//selectedDateMobile.value = '';
};


//const todo = todolist.value.find(todo => todo.id === id); // Use === for comparison
const edit_todo = (id) => {
	const todos = todoStore.todolist;  
	const edit_todo_item = todos.find(todo => todo.id === id);  // Keep it as an object
	
	// Directly assign the object properties to the refs
    title.value = edit_todo_item.title;
    description.value = edit_todo_item.description;
    category.value = edit_todo_item.category;
    deadline.value = edit_todo_item.deadline;
    id_for_update_task.value = edit_todo_item.id;
    
    want_to_edit.value = true 
}

const updateTask = () =>  {
	const newUpdateTask = {
		title: title.value,
		id: id_for_update_task.value,
		description: description.value,
		category: category.value,
		deadline: deadline.value,
		completed: false,
	}

	todoStore.edittodo(id_for_update_task.value, newUpdateTask);
	title.value = '';
  description.value = '';
  category.value = '';
  deadline.value = '';
  want_to_edit.value = false 
}








const canceltask = () => {
  
  title.value = '';
  description.value = '';
  category.value = '';
  deadline.value = '';
  want_to_edit.value = false 
}



const deleteTask =  (id) => {
  
	 todoStore.removetodo(id);  // Call the deleteTodo method
}
const ErrorAlert = ref(null)

watch(
	() => todoStore.Errormessage,
	(newMessage) => {
		ErrorAlert.value = newMessage;
	}
);


const MessageAlert = ref(null)
watch(
	() => todoStore.Message,
	(newMessage) => {
	  
		MessageAlert.value = newMessage;
	}
);
</script>

<template>
<Errormessage v-if="ErrorAlert !== null" :errorMessage="ErrorAlert" />

      
	<main class="w-full h-full overflow-y-auto flex flex-col items-center max-w-4xl space-y-4">
		<h1 class="font-extrabold text-2xl poppins gradient-text">Write Down Your Goal</h1>
		
		 <AlertBox v-if='MessageAlert !== null' :message="MessageAlert" />
    
    



    
    
		<div class="flex flex-col w-full h-auto py-4 px-4 justify-center items-center space-y-2 border rounded-lg take_note relative z-10">
			<input
				placeholder="Add Your Task"
				type="text"
				class="w-full lg:max-w-4xl border border-zinc-400 dark:bg-zinc-800 focus:outline-none p-3 rounded-lg poppins"
				v-model="title"
			/>
			<textarea placeholder="Add Your Task Description" type="text" class="w-full border border-zinc-400 lg:max-w-4xl dark:bg-zinc-800 focus:outline-none p-3 rounded-md poppins" cols="8" resize="none" v-model="description"></textarea>

			<!-- Mobile Date Picker
			<div class="w-full rounded-md z-20 space-y-3 lg:hidden">
				<vue-ctk-date-time-picker
					v-model="selectedDateMobile"
					:format="'YYYY-MM-DD HH:mm:ss'"
					label="Select Date and Time"
					class="w-full dark:bg-neutral-400"
				/>
			</div>
 -->
			<!-- Desktop Date Picker -->
			<input
				placeholder="Date"
				type="date"
				class=" w-full lg:max-w-4xl border border-zinc-400 dark:bg-zinc-800 focus:outline-none py-2 rounded-lg poppins"
				v-model="deadline"
			/>

			<input type="text" placeholder="Category" class="w-full border border-zinc-400 dark:bg-zinc-800 focus:outline-none p-3 rounded-lg poppins" v-model="category" />

			<button v-if="!want_to_edit" class="w-full bg-zinc-800 flex justify-center space-x-4 poppins text-white py-2 rounded-md dark:bg-blue-600" @click="addtask">
				<span v-if="!todoStore.addingTodo" class="font-semibold">ADD TASK</span>
				<img v-show="todoStore.addingTodo" src="../assets/media/loading.gif" class="w-6 h-6">
				<SquarePlus class="hidden lg:block" />
			</button>
			
			<div v-else class="flex flex-row w-full space-x-2" >
			  <button class="w-full bg-zinc-800 flex justify-center space-x-4 poppins text-white py-2 rounded-md dark:bg-blue-600" @click="updateTask">
				<span v-if="!todoStore.addingTodo" class="font-semibold">UPDATE TASK</span>
				<img v-show="todoStore.addingTodo" src="../assets/media/loading.gif" class="w-6 h-6">
				<SquarePlus class="hidden lg:block" />
			</button>
			<button class="w-full bg-zinc-800 flex justify-center space-x-4 poppins text-white py-2 rounded-md dark:bg-blue-600" @click="canceltask">
				<span class="font-semibold">CANCEL</span>
				<CircleX class="hidden lg:block" />
			</button>
			
			</div>
			
			
			
		</div>

		<div class="flex flex-col w-full  max-h-auto py-1 px-2 justify-center  space-y-2">
	<div v-for="todo in todoStore.todolist" :key="todo.id" class="flex flex-col w-full px-4 py-12 rounded-md bg-neutral-50 dark:bg-zinc-800 text-neutral-900 poppins container relative">
		<div class="flex flex-col space-y-2 z-10 w-full lg:pr-10">
		  
			<span class="text-xl lg:text-2xl text-white font-bold break-words w-full">{{ todo.title }}</span>
			<!-- Description -->
			<span class="text-md lg:text-lg text-white break-words w-full">{{ todo.description }}</span>
			<!-- Deadline -->
			<span class="text-sm lg:text-md text-gray-100 dark:text-gray-100 w-full flex items-center space-x-1">
				<Clock class="w-5 h-5" />
				<span>Deadline: {{ calculateDaysLeft(todo.deadline) }} days left</span>
			</span>
		</div>

		<!-- Buttons for Desktop -->
		<div class="hidden lg:flex flex-col absolute right-3 top-2 w-auto h-[9.5rem] z-10 space-y-3">
			<button class="text-white text-xl p-2 flex items-center justify-center bg-zinc-800 rounded-full">
				<CircleCheck @click="setTodoAsComplete(todo.id)" />
			</button>
			<button class="text-white text-xl p-2 flex items-center justify-center bg-zinc-800 rounded-full">
				<Pencil @click="edit_todo(todo.id)" />
			</button>
			<button class="text-white text-xl p-2 flex items-center justify-center bg-zinc-800 rounded-full">
				<Trash2 />
			</button>
		</div>

		<!-- Buttons for Mobile -->
		<div class="grid grid-cols-3 w-full gap-4 text-white text-4xl mt-4 z-10 lg:hidden">
			<button class="bg-zinc-800 text-white text-4xl rounded-md py-2 flex items-center justify-center hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400">
				<CircleCheck  @click="setTodoAsComplete(todo.id)" />
			</button>
			<button class="bg-zinc-800 text-white text-4xl rounded-md py-2 flex items-center justify-center hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400">
				<Pencil @click="edit_todo(todo.id)"/>
			</button>
			<button class="bg-zinc-800 text-white text-4xl rounded-md py-2 flex items-center justify-center hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400">
				<Trash2 @click="deleteTask(todo.id)" />
			</button>
		</div>
	</div>


		</div>
	</main>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
.poppins {
	font-family: 'Poppins', sans-serif;
}

.vue-ctk-date-time-picker {
	border-radius: 0.375rem; /* Rounded-md equivalent */
	background-color: gray;
}

.gradient-text {
	background: linear-gradient(135deg, #c92235, #FF6F61, #D83A56, #F5A623, #FFB900, #0AF, #51533e, #463dc0);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-size: 300% 300%;
	animation: gradient-animation 5s ease infinite;
}

@keyframes gradient-animation {
	0% {
		background-position: 0% 0%;
	}
	50% {
		background-position: 100% 100%;
	}
	100% {
		background-position: 0% 0%;
	}
}

/* From Uiverse.io by elijahgummer */ 
.container {
  width: 100%;
  height: 100%;
  background: lightblue;
  position: relative;
  overflow: hidden;
}

.container::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, #3498db 10%, transparent 20%),
    radial-gradient(circle, transparent 10%, #3498db 20%);
  background-size: 30px 30px; /* Adjust the size of the pattern */
  animation: moveBackground 8s linear infinite; /* Adjust the animation duration and timing function */
}

@keyframes moveBackground {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(20%, 20%);
  }
}


</style>
