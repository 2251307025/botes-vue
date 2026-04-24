import request from "@/util/request.js";
//注册
export const userRegisterService=(registerData)=>{
    //UrlSearchParams
    const params= new URLSearchParams()
    for (let key in registerData){
        params.append(key,registerData[key]);
    }
    return request.post('/user/register',params);
}
//登录
export const userLoginService=(loginData)=>{
    const params=new URLSearchParams();
    for (let key in loginData){
        params.append(key,loginData[key]);
    }
 return  request.post('/user/login',params)
}
//获取用户信息
export const userInfoService=()=>{
   return  request.get('/user/userInfo')
}
//修改信息
export const userInfoUpdateService=(userInfoData)=>{
   return   request.put('/user/update',userInfoData)
}
//修改头像
export const userAvatarUpdateService=(avatarUrl)=>{
    const params=new URLSearchParams()
    params.append('avatarUrl',avatarUrl)
   return  request.patch('/user/updateAvatar',params)
}
//修改密码
export const userPasswordUpdateService=(userInfoData)=>{
  return   request.patch('/user/updatePwd',userInfoData)
}