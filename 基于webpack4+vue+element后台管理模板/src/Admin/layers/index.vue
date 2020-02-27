<template>
    <div class="content-main">
        <transition name="fade-transform" mode="out-in">
            <keep-alive>
                <router-view :key="key" />
            </keep-alive>
        </transition>
        </div>
</template>

<script>
    export default {
        computed: {
            key() {
                return this.$route.path
            }
        }
    }
</script>

<style scoped>
    .content-main{
        width: 100%;
        min-height: 100%;
        padding: 20px 10px 10px;
        position: relative;
    }
</style>


