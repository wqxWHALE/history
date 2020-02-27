import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);


const state = {
    leftNavData: require('../js/data').leftNavData,
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    UserID:localStorage.getItem('UserID') ? localStorage.getItem('UserID') : ''
};

const store = new Vuex.Store({
    state,
    getters: {
        token(state){
            return state.Authorization
        },

    },
    mutations: {
        // 修改token，并将token存入localStorage
        setUserLogin (state, user) {
            state.Authorization = user.Authorization;
            state.UserID=user.UserID;
            localStorage.setItem('Authorization', user.Authorization);
            localStorage.setItem('UserID',user.UserID);
        },
        clearUserLogin (state){
            localStorage.clear();
            state.UserID = '';
            state.token = '';
        }
    }
});

export default store
