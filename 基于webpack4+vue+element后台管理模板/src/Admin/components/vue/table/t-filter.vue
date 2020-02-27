<template>
    <div class="search-box">
        <div class="search-item" v-for="filterItem in filterArr">
<!--            <input type="text" class="input01" placeholder="FirstName"/>-->
            <el-input v-model="filterItem.initValue" v-if="filterItem.type==='input'" :placeholder="filterItem.name"></el-input>
            <el-select v-model="filterItem.initValue" v-if="filterItem.type==='select'" :placeholder="filterItem.name">
                <el-option
                        v-for="item in filterItem.selectOpt"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id">
                </el-option>
            </el-select>
            <el-date-picker v-if="filterItem.type==='dateZones'"
                    v-model="filterItem.initValue"
                    type="daterange"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    :start-placeholder="filterItem.name[0]"
                    :end-placeholder="filterItem.name[1]">
            </el-date-picker>
            <el-autocomplete v-if="filterItem.type==='inputAutoSearch'"
                             v-model="filterItem.initValue"
                             :fetch-suggestions="filterItem.searchAction"
                             :placeholder="'请选择'+filterItem.name"></el-autocomplete>
        </div>

        <button class="btn btn-default" v-on:click="toSearch">搜索</button>
    </div>
</template>
<script>

    export default {
        name: 'tfilter',
        props: {
            filterArr:{
                type: Array
            },
            commitFun:{
                type:Function
            }
        },
        data(){
            return {
                data:''
            }
        },
        methods:{
            toSearch:function(){
                console.log("toSearch");
                let data = new URLSearchParams();
                console.log(this.filterArr);
                for(let i=0;i<this.filterArr.length;i++){
                    if(this.filterArr[i].type==="dateZones"){
                        let time1='';
                        let time2='';
                        if(this.filterArr[i].initValue != null){
                            time1=this.filterArr[i].initValue[0];
                            time2=this.filterArr[i].initValue[1];
                        }

                        data.append(this.filterArr[i].nameCode[0], time1);
                        data.append(this.filterArr[i].nameCode[1], time2);

                    }else{
                        data.append(this.filterArr[i].nameCode, this.filterArr[i].initValue);
                    }
                    console.log(i+":"+this.filterArr[i].initValue);
                }
                this.commitFun(data);
            }
        }
    }
</script>

<style scoped>
.search-box{
    margin-bottom:10px;
    overflow: hidden;
    float:left;
    margin-right:10px;
}
input{
    border:1px solid #ccc;
    height:32px;
    line-height: 32px;
    font-size:14px;
    border-radius: 3px;
    padding:3px 5px;
    box-sizing: border-box;
    width:150px;
}
.search-item{
    float:left;
    margin-right:10px;
}
.btn{
    height:32px;
    line-height: 32px;
    font-size:14px;
    width:60px;
}

</style>

