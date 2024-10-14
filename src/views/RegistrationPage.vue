<template>

<main class="w-screen h-screen flex flex-col items-center justify-center">

	  <div class="flex flex-col lg:min-w-[70%] max-w-4xl  lg:h-auto h-screen p-2 justify-center items-center space-y-4  bg-transparent rounded-lg backdrop-blur-sm rounded-lg  relative ">
	    	  <h1 class="text-5xl gradient-text font-extrabold py-4"> {{ page_name }} </h1>
	    	  <div class="flex flex-col space-y-2 lg:min-w-[60%]">
  <div class="flex flex-row relative w-full justify-center items-center">

	  </div>
	   <div class="flex flex-row relative w-full justify-center items-center">
	    <input
				placeholder="Enter Your Name"
				type="text"
				class="w-full lg:max-w-4xl  bg-zinc-800 dark:bg-zinc-700 focus:outline-none p-3 rounded-md poppins  pr-10 pl-3 text-white"
				v-model="name"
			/>
			<CircleUserRound class="flex absolute right-3 text-white"/>
	  </div>
	    	    
	    	    
	   <div class="flex flex-row relative w-full justify-center items-center">
	    <input
				placeholder="Enter Your Email"
				type="email"
				class="w-full lg:max-w-4xl  bg-zinc-800 dark:bg-zinc-700 focus:outline-none p-3 rounded-md poppins  pr-10 pl-3 text-white"
				v-model="email"
			/>
			<AtSign class="flex absolute right-3 text-white"/>
	  </div>
	  
	  <div class="flex flex-col w-full">
	   	  	  <div class="flex flex-row relative w-full justify-center items-center">
	    <input
				placeholder="Enter Your Email"
				:type="fieldType"
				class="w-full lg:max-w-4xl  bg-zinc-800 text-white dark:bg-zinc-700 focus:outline-none p-3 rounded-md poppins  pr-10 pl-3"
				v-model="password"
			/>
			<button @click="tooglePassword" class="flex absolute right-3">
			  	<component :is="iconname" class=" text-white" />
			</button>
	  </div>
	  
	  
	   <div class="flex flex-row w-full p-2 space-x-1 ">
<div :class="['w-20 lg:w-40 h-4 rounded-xl', { 'bg-blue-800': haschar, 'bg-transparent border': !haschar }]"></div>
<div :class="['w-20 lg:w-40 h-4 rounded-xl', { 'bg-blue-800': hasnum, 'bg-transparent border': !hasnum }]"></div>
<div :class="['w-20 lg:w-40 h-4 rounded-xl', { 'bg-blue-800': hasspecial, 'bg-transparent border': !hasspecial }]"></div>
<div :class="['w-20 lg:w-40 h-4 rounded-xl', { 'bg-blue-800': minlen8, 'bg-transparent border': !minlen8 }]"></div>
	   </div>
	  </div>
<button @click="register" class="w-full py-2 text-white dark:text-white rounded-md bg-blue-800 font-extrabold flex flex-row items-center justify-center">
	    <span v-show="!loading" >{{ page_name }}</span>
	    <img v-show="loading" src="../assets/media/loading.gif" class="w-6 h-6">
	  </button>
	  

	  
	  	  <div class="flex flex-row w-full relative space-x-1 text-white">
	    <span>
	      Already have any account? 
	    </span>
	        <RouterLink to="/login" class="flex font-extrabold  cursor-pointer ">Login</RouterLink>
	  <span>
	  <div v-if="userstore.errorMessage" class="text-red-500">
	{{ userstore.errorMessage }}
</div>

	  </span>
	  </div>
	    	  </div>



	  </div>


  
</main>
</template>
<script setup>
import { ref, watch } from 'vue';
import { AtSign , EyeOff , Eye ,ImageUp, CircleUserRound} from 'lucide-vue-next';
import { useRouter  } from 'vue-router';
import { useUserStore } from '../stores/Userstore.js';

const router = useRouter();
const userstore = useUserStore();

const page_name = ref('REGISTER')
const password = ref(null)
const email = ref(null)
const name = ref(null)


const iconname = ref(Eye)
const fieldType = ref('password')
const haschar = ref(false);
const hasnum = ref(false);
const minlen8 = ref(false);

const hasspecial = ref(false);
const loading= ref(false)
const icon = {
  Eye,
  EyeOff
}

const selectfile = () => {
  
  image_upload.value.click()
}

const uploadImage = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();

    // Event handler for when the file is read
    reader.onload = (e) => {
      // e.target.result contains the binary data as a Data URL
      profile_img.value = e.target.result;
    };

    // Read the file as a Data URL
    reader.readAsDataURL(file);
  }
};

watch(password,(newvalue)=>{
  haschar.value = /[a-zA-Z]/.test(newvalue)
  hasspecial.value = /[@#$_&-+()/*"'-:;!?.,}{\][]/.test(newvalue)
  hasnum.value = /[1-9]/.test(newvalue)
  minlen8.value = newvalue.length > 8;

})
const tooglePassword = () => {
  if(fieldType.value === 'text'){
    fieldType.value = 'password';
    iconname.value = icon.Eye;
  }
  else{
    fieldType.value = "text"
    iconname.value = icon.EyeOff
  }
  
}

const register = async () => {
loading.value = true
  
  try {
    await userstore.signup(email.value, password.value , name.value );
    if (userstore.isLogin) {
      // Redirect to home after successful login
      router.push('/');
      loading.value = false
    }
  } catch (error) {
loading.value = false
    console.error('Login error:', error);
  }
};

watch(
			() => userstore.errorMessage,  // Getter function to track changes in errorMessage
			(newVal) => {
				if (newVal) {
				  console.log("error")
					loading.value = false
				}
			}
		);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
.poppins {
	font-family: 'Poppins', sans-serif;
}

.gradient-text {
	background: linear-gradient(135deg, #c92235, #FF6F61, #0d0d70, #151526, #f9d3d7, #0AF, #51533e, #463dc0);
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



/* From Uiverse.io by adamgiebl */ 
main {
  width: 100%;
  height: 100%;
  --color: rgba(114, 114, 114, 0.3);
  background-color: #191a1a;
  background-image: linear-gradient(0deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent),
      linear-gradient(90deg, transparent 24%, var(--color) 25%, var(--color) 26%, transparent 27%,transparent 74%, var(--color) 75%, var(--color) 76%, transparent 77%,transparent);
  background-size: 55px 55px;
}
</style>
