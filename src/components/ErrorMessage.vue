<template>
  <div class="border-l-4 border-red-400 bg-yellow-100  p-4 w-[80%] lg:max-w-[30%] fixed absolute top-3 right-0 lg:top-20 lg:right-10 z-10">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-yellow-700">
        {{ errorMessage }}
        <!--<a href="#" class="font-medium text-yellow-700 underline hover:text-yellow-600">Upgrade your account to add more credits.</a>-->
      </p>
    </div>
  </div>
</div>
</template>

<script>
  export default {
    name: 'ErrorMessage',
    props : {
      errorMessage : {
        type : String,
        required : true,
        
      }
    }
  }

</script>