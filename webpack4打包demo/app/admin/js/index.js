import Vue from 'vue';
import LeftNav from '../components/vue/left-nav/left-nav.vue';

require('../css/style.css');
require('../css/left-nav.css');
require ('../css/font-awesome.min.css');

new Vue({
    el: '#left-nav-vue',
    render: c => c(LeftNav)
});