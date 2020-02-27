import Vue from 'vue';
import App from '../app.vue'
import Router from '../router'
import store from '../store'
import ElementUI from 'element-ui';
import Axios from '../utils/axios'
require('element-ui/lib/theme-chalk/index.css');

require('../css/theme.css');
require ('../css/font-awesome.min.css');

Vue.prototype.$http = Axios;

// new Vue({
//     el: '#left-nav-vue',
//     render: c => c(LeftNav)
// });
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });

new Vue({
    el: '#app',
    router:Router,
    store:store,
    render: h => h(App)
});

