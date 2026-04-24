import {ref} from 'vue'
//定义store
import {defineStore} from "pinia";

 export const useTokenStore = defineStore('token',()=>{
     //内容
     const token=ref('')
     const setToken =(newToken)=>{
         token.value=newToken;
     }
     const  removeToken=()=>{
         token.value='';
     }
     return {
         token,setToken,removeToken
     }
 },{
     persist: true //持久化存储
     }
     );