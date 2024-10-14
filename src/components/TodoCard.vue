<template>
<div v-for="todo in todolist" :key="todo.id" class="flex flex-col w-full px-4 py-7 rounded-md bg-neutral-50 dark:bg-zinc-800 text-neutral-900 poppins container relative">
  <div class="flex flex-col space-y-2 z-10 w-full  lg:pr-10">
    <!-- Title -->
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
  <div class="hidden lg:flex flex-col absolute right-3 bottom-1 w-auto h-[8.5rem] z-10 space-y-1">
    <button class="text-white text-xl p-2 flex items-center justify-center bg-zinc-800 rounded-full">
      <CircleCheck />
    </button>
    <button class="text-white text-xl p-2 flex items-center justify-center bg-zinc-800 rounded-full">
      <Pencil />
    </button>
    <button class="text-white text-xl p-2 flex items-center justify-center bg-zinc-800 rounded-full">
      <Trash2 />
    </button>
  </div>

  <!-- Buttons for Mobile -->
  <div class="grid grid-cols-3 w-full gap-4 text-white text-4xl mt-4 z-10 lg:hidden">
    <button class="bg-zinc-800 text-white text-4xl rounded-md py-2 flex items-center justify-center hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400">
      <CircleCheck />
    </button>
    <button class="bg-zinc-800 text-white text-4xl rounded-md py-2 flex items-center justify-center hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400">
      <Pencil />
    </button>
    <button class="bg-zinc-800 text-white text-4xl rounded-md py-2 flex items-center justify-center hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-400">
      <Trash2 />
    </button>
  </div>
</div>


</template>

<script setup>
import { CircleCheck, Pencil , Trash2 , Clock } from 'lucide-vue-next';  
import { useTodoStore } from '../stores/Store.js';
import { ref , } from 'vue';
const todoStore = useTodoStore()

const todolist = ref([]) 

onMounted(() => {
		const storedTodos = localStorage.getItem('todo');
		if (storedTodos) {
			try {
				todolist.value = JSON.parse(storedTodos);
			} catch (error) {
				console.error('Failed to parse todos from localStorage:', error);
				todolist.value = [];  // Reset to empty array if parsing fails
			}
		}
	});

/*const todolist = [
  {
    "id": "1",
    "title": "Buy Groceries",
    "description": "Need to buy milk, eggs, and bread.",
    "deadline": "2024-09-10T15:00:00"
  },
  {
    "id": "2",
    "title": "Complete Vue.js Project",
    "description": "Finish the Vue.js component and add styling.",
    "deadline": "2024-09-12T12:00:00"
  },
  {
    "id": "3",
    "title": "Schedule Doctor Appointment",
    "description": "Book an appointment with the dentist for a check-up.",
    "deadline": "2024-09-15T09:00:00"
  },
  {
    "id": "4",
    "title": "Read Book",
    "description": "Finish reading 'Clean Code' by Robert C. Martin.",
    "deadline": "2024-09-20T18:00:00"
  },
  {
    "id": "5",
    "title": "PLAN WEEKEND TRIP TO HELL 👀 . EARN MONEY FOR FAMILY FOR AFTER COMPLICATED MY JOB DONE MY LIFE",
    "description": "Plan a trip to the hell for my whole spiritual life. I had lost all of my Gola motive i just fuckedup I don't want to continue this life anymore she took all of my peace she know it i can't live without her but she did . She leave me and my family condition right now it's like hell . i can't remove those staf from my head . who could she do that's ? doesn't i love her ? or i cheated on her ? ",
    "deadline": "2024-09-25T20:00:00"
  }
]
*/
const calculateDaysLeft = (deadline) => {
  const today = new Date();
  const endDate = new Date(deadline);
  const timeDiff = endDate - today;
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return daysLeft >= 0 ? daysLeft : 'Overdue';
};

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
.poppins {
	font-family: 'Poppins', sans-serif;
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