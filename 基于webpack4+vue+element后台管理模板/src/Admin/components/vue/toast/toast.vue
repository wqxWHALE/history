<template>
    <div class="toast-show"></div>
</template>

<script>
export default {
    data(){
        return {
            message:"",
            isShow:1
        }
    },
    methods:{

    }
}
</script>
<style scoped>
    .toast-show{
        position: absolute;
        top:0px;
        background:#fff;
        width:300px;
        height:36px;
        z-index:9999999;
        left:50%;
        margin-left:-150px;
    }
</style>
