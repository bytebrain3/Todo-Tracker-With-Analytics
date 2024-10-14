import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/css/statics.css'
import App from './App.vue'
import router from './router'
import Donut from 'vue-css-donut-chart';
import 'vue-css-donut-chart/dist/vcdonut.css';

const app = createApp(App)
const pinin = createPinia();
app.use(pinin)
app.use(router)
app.use(Donut);
app.mount('#app')
 