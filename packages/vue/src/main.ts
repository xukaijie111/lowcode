import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import './assets/css/main.css';
import "./assets/css/editor.css"

const app = createApp(App)

app
.use(ElementPlus)
//@ts-ignore
    .use(router) 
    .mount('#app')
