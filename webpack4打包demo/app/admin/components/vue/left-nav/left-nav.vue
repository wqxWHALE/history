<template>
    <left-nav v-bind:options="navList"></left-nav>
</template>

<script>

    let navList=require('../../../js/data').getLeftNavData();
    let Velocity = require("../../../js/velocity.min.js");

    let componentLeftNavMenu={
        props: ['item','index'],
        template:'<li :class=\"[\'nav-li-\'+index]\"  v-on:click=\"childLiStatusChange\">' +
            '<div class=\"li-tab-box\">' +
            '<div class=\"li-tab\">' +
            '<span class=\"tab-sign fa\" :class=\"item.icon\"></span>' +
            '<span class=\"menu-change tab-name\">{{ item.name }}</span>' +
            '<span class=\"menu-change arrow fa fa-chevron-right\"></span>' +
            '</div>'+
            '<transition\n' +
            '    v-on:before-enter="beforeEnter"\n' +
            '    v-on:enter="enter"\n' +
            '    v-on:leave="leave"\n' +
            '    v-bind:css="false"\n' +
            '  >'+
            '<ul v-if=\"item.dataItems !== undefined && item.dataItems.length>0 && isShowChildLi\" class=\"li-tab-child-box\">'+
            '<li v-for=\"(item,index) in item.dataItems\">' +
            '<div class=\"li-tab\">' +
            '<span class=\"tab-sign fa\" :class=\"item.icon\"></span>' +
            '<span class=\"menu-change tab-name\">{{ item.name }}</span>' +
            '<span class=\"menu-change arrow fa fa-chevron-right\"></span>' +
            '</div>'+
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
            childLiStatusChange:function(){
                let childLiData=this.item.dataItems;
                let isShowChildLi=this.isShowChildLi;
                if(childLiData !== undefined && childLiData.length>0){
                    this.isShowChildLi = !isShowChildLi;
                }else{
                    alert("跳转！");
                }
            },
            beforeEnter: function (el) {
                el.style.opacity = 0;
                el.style.transformOrigin = 'left top';
            },
            enter: function (el, done) {
                Velocity(el, { translateX: '15px', opacity: 1 }, { complete: done });
            },
            leave: function (el, done) {
                Velocity(el, { translateX: '0px', opacity: 0  }, { complete: done });
            }
        }
    };

    let componentLeftNav = {
        props: ['options'],
        template:'<div>'+
            '<div class=\'nav-top\'>'+
            '<div class=\'navBtn\'><span class=\'menu-shape fa fa-th-list\'></span></div>' +
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
    };

    export default {
        data () {
            return {navList: navList}
        },
        components:{
            'left-nav':componentLeftNav
        }
    }
</script>