
/*left-nav*/
function getLeftNavData(){
    return {
        logo: "",
        title: "logo名",
        dataItems: [
            {
                name: "数据分析", url: "/dashboard", icon:"fa-area-chart"
            },
            {
                name: "客户管理", url: "/customer", icon:"fa-user"
            },
            {
                name: "订单管理", url: "/customerOrder", icon:"fa-flag"
            }
            // {
            //     name: "控件", url: "", icon: " fa-gift",
            //     dataItems: [
            //         { name: "table", url: "/table", icon: "fa-list-alt"},
            //         { name: "form", url: "/form", icon: "fa-list-alt"},
            //     ]
            // }
        ]
    };
}

export const leftNavData=getLeftNavData();

/*data-tabs*/
// function  getTabsData(){
//     return[
//         {icon:"fa-user",name:"本月订单量",num:"0"},
//         {icon:"fa-user",name:"本月服务次数",num:"0"},
//         {icon:"fa-user",name:"客户总数",num:"0"},
//         {icon:"fa-user",name:"总订单量",num:"0"},
//     ];
// }
//
// export const tabsData=getTabsData();
