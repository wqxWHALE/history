function getLeftNavData(){
    return {
        logo: "",
        title: "test",
        dataItems: [
            {
                name: "门户管理", url: "", icon:"fa-sitemap",
                dataItems: [
                    { name: "基础信息", url: "", icon: "fa-list-alt"},
                    { name: "项目管理", url: "", icon: "fa-bookmark"},
                    { name: "主题栏目", url: "", icon: "fa-columns" }
                ]
            },
            { name: "游戏活动", url: "", icon: " fa-gift" },
            { name: "客户管理", url: "", icon: "fa-group"}
        ]
    };
}

exports.getLeftNavData=function(){
    return getLeftNavData();
};