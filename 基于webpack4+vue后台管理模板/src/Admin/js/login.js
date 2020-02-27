import Vue from 'vue';
import Axios from 'axios';

require('../css/login.css');
require('../css/theme.css');


new Vue({
    el: '#login',
    data:{
        userNamePder:"USER NAME",
        pwdPder:"PASSWORD",
        loginInfo:{
            userName:"",
            password:""
        }
    },
    methods:{
        submit:function(){
            let _this=this;
            if(!_this.loginInfo.userName){
                _this.userNamePder="PLEASE ENTER USER NAME";
                return false;
            }
            if(!_this.loginInfo.password){
                _this.pwdPder="PLEASE ENTER YOUR PASSWORD";
                return false;
            }
            // let loginData=Qs.stringify({
            //     name:this.loginInfo.userName,
            //     pwd:this.loginInfo.password
            // });
            let loginData = new URLSearchParams();
            loginData.append("name", _this.loginInfo.userName);
            loginData.append("pwd", _this.loginInfo.password);
            console.log(loginData);

            Axios.post('/user/check', loginData).then(res => {
                // success callback
                _this.userToken = 'Bearer ' + res.data.data.body.token;
                // 将用户token保存到vuex中
                _this.changeLogin({ Authorization: _this.userToken });
                _this.$router.push('/index');
            });

        }
    }
});
