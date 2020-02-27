<template>
    <transition>
    <left-nav v-bind:options="navList" class="left-nav left-nav-style"  v-bind:style="{width: objWidth}"></left-nav>
    </transition>
</template>

<script>

    //let navList=require('../../../js/data').leftNavData;
    let Velocity = require("../../../js/velocity.min.js");

    let componentLeftNavMenu={
        props: ['item','index'],
        template:'<li :class=\"[\'nav-li-\'+index,{\'theme-color-shadow\':item.url===$route.path}]\" v-on:click=\"childLiStatusChange\">' +
            '<div class=\"li-tab-box\">' +
            '<div class=\"li-tab\" @mouseenter=\"addActive($event)\" @mouseout=\"removeActive($event)\">' +
            '<span class=\"tab-sign fa\" :class=\"item.icon\"></span>' +
            '<span class=\"menu-change tab-name\">{{ item.name }}</span>' +
            '<span class=\"menu-change arrow fa fa-chevron-right\"></span>' +
            '</div>'+
            '<transition\n' +
            '    name="fade" mode="out-in"\n' +
            '    v-on:before-enter="beforeEnter"\n' +
            '    v-on:enter="enter"\n' +
            '    v-on:leave="leave"\n' +
            '    v-bind:css="false"\n' +
            '  >'+
            '<ul v-if=\"item.dataItems !== undefined && item.dataItems.length>0 && isShowChildLi\" class=\"li-tab-child-box\">'+
            '<li v-for=\"(item,index) in item.dataItems\" v-on:click.stop=\"leave\">'+
            '<router-link :to=\"item.url\">'+
            '<div class=\"li-tab\"  @mouseenter=\"addActive($event)\" @mouseout=\"removeActive($event)\">' +
            '<span class=\"tab-sign fa\" :class=\"item.icon\"></span>' +
            '<span class=\"menu-change tab-name\">{{ item.name }}</span>' +
            '<span class=\"menu-change arrow fa fa-chevron-right\"></span>' +
            '</div>'+
            '</router-link>'+
            '</li>'+
            '</ul>'+
            '</transition>'+
            '</div>' +
            '</li>',
        data: function () {
            return {
                isShowChildLi: false,
            }
        },
        methods:{
            addActive:function(e){
                e.currentTarget.className+=" theme-color-shadow";
            },
            removeActive:function(e){
                e.currentTarget.className="li-tab";
            },
            childLiStatusChange:function(e){
                let childLiData=this.item.dataItems;
                let isShowChildLi=this.isShowChildLi;
                if(childLiData !== undefined && childLiData.length>0){
                    this.isShowChildLi = !isShowChildLi;
                }else{
                    this.$router.push(this.item.url).catch(err => {console.log("err"+err)});
                }
            },
            beforeEnter: function (el) {
                el.style.opacity = 0;
                el.style.transformOrigin = 'left top';
            },
            enter: function (el) {
                let th=this;
                if(this.$parent.$parent.checkNavStatus()){
                    Velocity(el, { translateX: '15px', opacity: 1 });
                }else{
                    Velocity(el, { opacity: 1 });
                }
            },
            leave: function (el) {
                if(this.$parent.$parent.checkNavStatus()){
                    Velocity(el, { translateX: '0px', opacity: 0  });
                }else{
                    Velocity(el, { opacity: 1 });
                }
            }
        }
    };

    let componentLeftNav = {
        props: ['options'],
        template:'<div>'+
            '<div class=\'nav-top theme-color\'>'+
            '<div class=\'navBtn\'><span class=\'menu-shape fa fa-th-list\' v-on:click=\"changeWidth\"></span></div>' +
            '<div class=\'navName\'>{{ options.title }}</div>' +
            '</div>' +
            '<div class=\'nav-box\'>' +
            '<ul class=\'tabs\' >' +
            '<left-nav-menu v-for=\"(item,index) in options.dataItems\"  v-bind:item=\"item\" v-bind:index=\"index\"></left-nav-menu>'+
            '</ul></div>'+
            '</div>',
        components: {
            'left-nav-menu': componentLeftNavMenu
        },
        methods:{
            changeWidth:function () {
                this.$parent.changeWidth();
            }
        },
    };

    export default {
        data () {
            return {
                navList:this.$store.state.leftNavData,
                objWidth:'200px',
                showAll:true
            }
        },
        methods:{
            changeWidth:function () {
                let leftNav = document.getElementsByClassName("left-nav")[0];
                let main = document.getElementsByClassName("main")[0];
                let menuChange = document.getElementsByClassName("menu-change");
                let navName=document.getElementsByClassName("navName")[0];
                let leftName=document.getElementsByClassName("left-nav")[0];
                let ul=document.getElementsByClassName("li-tab-child-box");
                this.showAll=!this.showAll;
                if(this.showAll){
                    leftName.classList.remove("mini-nav");
                    for(let i=0;i<ul.length;i++){
                        Velocity(ul[i], { translateX: '15px'});
                        let item=ul[i].childNodes;
                        for(let j=0;j<item.length;j++){
                            Velocity(item[j], { paddingLeft: '15px'});
                        }
                    }
                    Velocity(leftNav, { width: '200px'});
                    Velocity(main, { marginLeft: '200px'},{
                        complete: function() {
                            for (let i = 0; i < menuChange.length; i++) {
                                menuChange[i].style.display = "inline-block";
                            }
                            navName.style.display = "inline-block";
                        }
                    });
                }else{
                    leftName.classList.add("mini-nav");
                    for(let i=0;i<ul.length;i++){
                        Velocity(ul[i], { translateX: '0px'});
                        let item=ul[i].childNodes;
                        for(let j=0;j<item.length;j++){
                            Velocity(item[j], { paddingLeft: '0px'});
                        }
                    }
                    Velocity(leftNav, { width: '50px'});
                    Velocity(main, { marginLeft: '50px'});
                    for (let i = 0; i < menuChange.length; i++) {
                        menuChange[i].style.display = "none";
                    }
                    navName.style.display = "none";
                }
            },
            checkNavStatus:function(){
                let menuChange = document.getElementsByClassName("menu-change");
                if(this.showAll){
                    for (let i = 0; i < menuChange.length; i++) {
                        menuChange[i].style.display = "inline-block";
                    }
                }else{
                    for (let i = 0; i < menuChange.length; i++) {
                        menuChange[i].style.display = "none";
                    }
                }
                return this.showAll;
            }
        },
        components:{
            'left-nav':componentLeftNav
        }
    }
</script>
