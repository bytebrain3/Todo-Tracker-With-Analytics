<template>
	

	<main class="w-full h-full overflow-y-auto flex flex-col items-center max-w-4xl space-y-4 poppins lg:border lg:border-zinc-400 rounded-lg p-4">
	  <div class="w-full flex flex-col space-y-1 bg-neutral-300 p-2 rounded-lg">
	    	  <div class="flex flex-col w-full p-2 bg-neutral-400 text-white dark:text-gray-50 dark:bg-zinc-800 rounded-lg">
	    <p>Total Completed Taks {{ score }}%</p>
	  </div>
    <div class="flex flex-col w-full p-2 bg-neutral-400 text-white dark:text-gray-50 dark:bg-zinc-800 rounded-lg">
	    <p >Your Score {{ numerical_scoreRef }}%</p>
	  </div>
	  </div>
		<!-- Donut Chart for Progress -->
		<div class="px-14 ">
		<vc-donut
			background="white"
			foreground="grey"
			:size="200"
			unit="px"
			:thickness="30"
			has-legend
			legend-placement="bottom"
			:sections="sections"
			:total="100"
			:start-angle="0"
			auto-adjust-text-size
			:suppress-validation-warnings="false"
			@section-click="handleSectionClick"
		>
			<h1>Progress</h1>
		</vc-donut>
		</div>
		<!-- Task Cards -->
		<div class="flex flex-col w-full max-h-auto py-1 px-2 justify-center space-y-2 bg-gray-50">
			<div v-for="todo in Task" :key="todo.id" class="flex flex-col w-full px-4 py-4  rounded-md bg-neutral-50 dark:bg-zinc-800 text-neutral-900 poppins container relative">
				<div class="flex flex-col space-y-2 z-10 w-full lg:pr-10">
					<span class="text-xl lg:text-2xl text-white font-bold break-words w-full">{{ todo.title }}</span>
					<!-- Description -->
					<span class="text-md lg:text-lg text-white break-words w-full">{{ todo.description }}</span>
					<!-- Deadline and Completed On -->
					<span class="text-sm lg:text-md text-gray-100 dark:text-gray-100 w-full flex items-center space-x-1">
						<Clock class="w-5 h-5" />
						<span v-if="todo.deadline">Deadline: {{ todo.deadline }}</span>

					</span>
										<span class="text-sm lg:text-md text-gray-100 dark:text-gray-100 w-full flex items-center space-x-1">
						<CircleCheckBig class="w-5 h-5" />
											<span v-if="todo.completed_on">Completed on: {{ todo.completed_on }}</span>

					</span>

				</div>
			</div>
		</div>
		<!--
		<div V-if='!userstore.isLogin' class="font-semibold text-2xl">
		  PLEASE login or register an account to track your tasks 
		</div>
		-->
	</main>
	
	
</template>

<script setup>
import { VcDonut } from 'vue-css-donut-chart';
import { ref, watch, onBeforeMount } from 'vue';
import { ref as firebaseRef, getDatabase, get } from 'firebase/database';
import { useUserStore } from '../stores/Userstore.js';
import { Clock , CircleCheckBig} from 'lucide-vue-next';
const userstore = useUserStore();
const Task = ref([]);
const score = ref(0); // Score percentage
const totalTasks = ref(0);
const completedTasks = ref(0);
const pendingTasks = ref(0);
const overdueTasks = ref(0);
const numerical_scoreRef = ref(0);
// Donut chart sections
const sections = ref([
	{ label: 'Completed', value: 0, color: 'blue' },
	{ label: 'Pending', value: 0, color: 'gray' },
	{ label: 'Overdue', value: 0, color: 'green' }
]);

// Define section_value to fix "not defined" error
const section_value = ref(null);

// Watch for changes in section_value and trigger corresponding function
watch(
	() => section_value.value,
	(newSectionValue) => {
		if (newSectionValue === 'Completed') {
			Completed_Task_List();
		} else if (newSectionValue === 'Pending') {
			Pending_Task_List();
		} else if (newSectionValue === 'Overdue') {
			Overdue_Task_List();
		}
	}
);

// Handle section click and set section_value correctly
const handleSectionClick = (section) => {
	section_value.value = section.label;
	//alert(section_value.value)
};

// Fetch all tasks and calculate percentages
const FetchAllTasks = async () => { 
if(userstore.isLogin){
	try {
		// Fetch completed tasks
		const completedRef = firebaseRef(getDatabase(), `todos/${userstore.user}/completed/`);
		const completedSnapshot = await get(completedRef);
		completedTasks.value = completedSnapshot.exists() ? Object.keys(completedSnapshot.val()).length : 0;

		// Fetch pending tasks
		const pendingRef = firebaseRef(getDatabase(), `todos/${userstore.user}/pending/`);
		const pendingSnapshot = await get(pendingRef);
		pendingTasks.value = pendingSnapshot.exists() ? Object.keys(pendingSnapshot.val()).length : 0;

		// Fetch overdue tasks
		const overDueRef = firebaseRef(getDatabase(), `todos/${userstore.user}/overdue/`);
		const OverDueSnapshot = await get(overDueRef);
		overdueTasks.value = OverDueSnapshot.exists() ? Object.keys(OverDueSnapshot.val()).length : 0;

		// Calculate total tasks
		totalTasks.value = completedTasks.value + pendingTasks.value + overdueTasks.value;

		// Calculate percentages
		const completedPercentage = totalTasks.value ? (completedTasks.value / totalTasks.value) * 100 : 0;
		const pendingPercentage = totalTasks.value ? (pendingTasks.value / totalTasks.value) * 100 : 0;
		const overduePercentage = totalTasks.value ? (overdueTasks.value / totalTasks.value) * 100 : 0;

		// Update sections for donut chart
		sections.value = [
			{ label: 'Completed', value: completedPercentage, color: 'blue' },
			{ label: 'Pending', value: pendingPercentage, color: 'gray' },
			{ label: 'Overdue', value: overduePercentage, color: 'green' }
		];

		// Set score as the percentage of completed tasks
		score.value = completedPercentage.toFixed(2);
	} catch (error) {
		console.error("Error fetching tasks: ", error);
	}
	}
};

// Functions to fetch specific tasks based on section clicked
const Completed_Task_List = async () => {
	try {
		const completedRef = firebaseRef(getDatabase(), `todos/${userstore.user}/completed/`);
		const snapshot = await get(completedRef);
		Task.value = snapshot.exists() ? Object.values(snapshot.val()) : [];
	} catch (error) {
		console.error("Error fetching completed tasks: ", error);
	}
};

const Pending_Task_List = async () => {
	try {
		const pendingRef = firebaseRef(getDatabase(), `todos/${userstore.user}/pending/`);
		const snapshot = await get(pendingRef);
		Task.value = snapshot.exists() ? Object.values(snapshot.val()) : [];
	} catch (error) {
		console.error("Error fetching pending tasks: ", error);
	}
};

const Overdue_Task_List = async () => {
	try {
		const overdueRef = firebaseRef(getDatabase(), `todos/${userstore.user}/overdue/`);
		const snapshot = await get(overdueRef);
		Task.value = snapshot.exists() ? Object.values(snapshot.val()) : [];
	} catch (error) {
		console.error("Error fetching overdue tasks: ", error);
	}
};

const numerical_score = async () => {
if(userstore.isLogin){
  const scoreRef = firebaseRef(getDatabase(), `todos/score/${userstore.user}`);
  
        const snapshot = await get(scoreRef);

       numerical_scoreRef.value  = snapshot.exists() ? snapshot.val().score || 0 : 0;
       }
}

// Fetch tasks on page load
onBeforeMount(() => {
	FetchAllTasks();
	numerical_score();
});
</script>
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
