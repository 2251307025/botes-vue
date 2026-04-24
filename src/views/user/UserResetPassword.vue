
<script setup>
import { ref } from 'vue'
const userInfo = ref({
  id: 0,
  old_pwd:'',
  new_pwd:'',
  re_pwd:''
})
//用于重新登录的数据模型
const registerData=ref({
  username:'',
  password:'',
})
const checkRePassword=(rule,value,callback)=>{
  if (value==''){
    callback(new Error("请在次输入密码"))
  }else if (value!=userInfo.value.new_pwd){
    callback(new Error("请确保两次输入的密码一样"))
  }else {
    callback()
  }
}
const rules = {
  old_pwd:[
    {required: true,message:'请输入新密码',trigget:'blur'},
    {min: 5, max: 16, message: '长度为5~16位非空字符', trigget: 'blur'}
  ],
  new_pwd:[
    {required: true,message:'请输入密码',trigget:'blur'},
    {min: 5, max: 16, message: '长度为5~16位非空字符', trigget: 'blur'}
  ],
  re_pwd:[
    {validator: checkRePassword, trigger: 'blur'}
  ]
}
//修改密码
import {userLoginService, userPasswordUpdateService} from '@/api/user.js'
import {ElMessage} from "element-plus";
import {useTokenStore} from "@/stores/token.js";
const tokenStore=useTokenStore()
import {useUserInfoStore} from '@/stores/userInfo.js'
const userInfoStore=useUserInfoStore();
//用于重新登录的数据模型
const reLogin=()=>{
  registerData.value.username=userInfoStore.info.username;
  registerData.value.password=userInfo.value.new_pwd;
}
const updatePwd=async () => {
  let result = await userPasswordUpdateService(userInfo.value);
  //重新登录修改token
    reLogin()
  let result0 = await userLoginService(registerData.value);
  tokenStore.setToken(result0.data)
  ElMessage.success(result.msg? result.msg:'修改成功')
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>修改密码</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="密码"  prop="old_pwd" >
            <el-input v-model="userInfo.old_pwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new_pwd">
            <el-input v-model="userInfo.new_pwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="re_pwd">
            <el-input v-model="userInfo.re_pwd"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updatePwd">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>