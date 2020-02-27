<template>
    <div class="my-container">
        <div id="left-nav">
            <left-nav-vue id="left-nav-vue"></left-nav-vue>
        </div><!--end left-nav-->

        <div class="main">
            <div class="top-nav">
                <div style="float:left;">
                    <h4 class="project-name">后台管理系统</h4>
                </div>
                <div class="top-nav-tip"></div>
                <div class="user-manager"  @mouseenter="changeUserMeuStatus" @mouseleave="changeUserMeuStatus">
                    <div class="user-img theme-color"><i class="fa fa-user"></i></div>
                    <div class="user-name">{{this.$store.state.UserID}}</div>
<!--                    <div class="user-action">-->
<!--                        <span class="fa fa-caret-down"></span>-->
<!--                    </div>-->
                    <ul v-if="showUserMeu">
                        <li class="user-meu-li"  @mouseenter="addActive($event)"  @mouseleave="removeActive($event)">账户信息</li>
                        <li class="user-meu-li"  @mouseenter="addActive($event)"  @mouseleave="removeActive($event)" v-on:click="userExit">退出</li>
                    </ul>
                </div>

            </div><!--end top-nav-->


            <div class="tab-content-box">
                <app-main></app-main>
            </div>
        </div><!--end main-->
    </div>
</template>
<style scoped>
    @import '../../css/index.css';
    @import '../../css/layer.css';
    @import '../../css/left-nav.css';
</style>
<script>
    import LeftNav from '../../components/vue/left-nav/left-nav.vue'
    import appMain from '../../layers/index.vue'
    import { mapMutations } from 'vuex';
    export default {
        components: {
            'left-nav-vue': LeftNav,
            'app-main':appMain
        },
        data(){
            return{
                showUserMeu:false,
            }
        },
        methods:{
            ...mapMutations(['clearUserLogin']),
            changeUserMeuStatus:function(){
                this.showUserMeu=!this.showUserMeu;
            },
            addActive:function(e){
                e.stopPropagation();
                e.currentTarget.className+=" theme-color-oppo";
            },
            removeActive:function(e){
                e.stopPropagation();
                e.currentTarget.className="user-meu-li";
            },
            userExit:function(e){
                this.clearUserLogin();
                this.$router.push('/login').catch(err => {console.log("err"+err)});
            }
        }
    }
</script>
