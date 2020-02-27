import Axios from 'axios'

let root=this;
Axios.interceptors.response.use(function(response){
    let status=response.data.status;
    if(status==="loginOut"){
        location.href="http://localhost:9000/GlassesSellAdmin/index.html#/login";
        return {
            data:{
                status:"loginOut"
            }
        }
    }else{
        return response;
    }
});

export default Axios;
