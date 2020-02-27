<template>
    <div id="login">
        <div class="bg-ani wrap">
            <ul>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
        </div>

        <div class="wrapper-login-bg">
            <div class="container">
                <div class="login-box">
                    <div class="login-top">
                        <!--                <div class="login-head theme-color-oppo">登录</div>-->
                    </div>
                    <div class="login">
                        <div class="input-name">
                            <div class="input-data">
                                <input type="text" value="" :placeholder="userNamePder" v-model="loginInfo.userName" :class="{'input-warn':userNamePder!=='USER NAME'}"/>
                            </div>
                        </div>

                        <div class="input-password">
                            <div class="input-data">
                                <input type="password" value="" :placeholder="pwdPder" v-model="loginInfo.password"  :class="{'input-warn':pwdPder!=='PASSWORD'}"/>
                            </div>
                        </div>

                        <div class="input-btn">
                            <button class="btn-login btn-default" type="submit" @click="submit">LOGIN</button>
                        </div>
                    </div><!---login-box--->
                </div>
            </div>
        </div>

        <div class="footer">
            wqxWhale@2019技术支持
        </div>
    </div>
</template>

<style scoped>
    @import '../../css/login.css';
</style>
<script>
    import { mapMutations } from 'vuex';
    export default{
        data () {
            return {
                userNamePder:"USER NAME",
                pwdPder:"PASSWORD",
                loginInfo:{
                    userName:"",
                    password:""
                }
            }
        },
        methods:{
            ...mapMutations(['setUserLogin']),
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

                _this.$http.post('/api/user/check', loginData).then(res => {
                    // success callback
                    if(res.data.status==="success"){
                        _this.userToken = res.data.data.token;
                        // 将用户token保存到vuex中
                        _this.setUserLogin({ Authorization: _this.userToken,UserID:_this.loginInfo.userName});
                        _this.$router.push('/index');
                    }
                });

            }
        }
    }
</script>
