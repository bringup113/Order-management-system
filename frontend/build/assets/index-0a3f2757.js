import{_ as C,r as g,c as F,y as k,o as U,e as x,f as l,w as a,E as w,A as h,a5 as R,i as v,n as s,J as q,z as f,t as D,R as B,F as L,S as T,q as A,s as N,g as M,L as S}from"./index-518491b2.js";/* empty css                   *//* empty css                   *//* empty css                     *//* empty css                 *//* empty css                *//* empty css                             *//* empty css               */import{l as z,m as J,n as j}from"./system-15735185.js";const G={name:"UserProfile",setup(){const b=g(!1),o=g(!1),P=g(!1),e=g(null),c=g(null),p=g({}),n=F({name:"",email:"",phone:""}),d=F({name:[{required:!0,message:"请输入姓名",trigger:"blur"}],email:[{required:!0,message:"请输入邮箱",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:"blur"}],phone:[{pattern:/^1[3-9]\d{9}$/,message:"请输入正确的手机号码",trigger:"blur"}]}),m=F({oldPassword:"",newPassword:"",confirmPassword:""}),E=F({oldPassword:[{required:!0,message:"请输入原密码",trigger:"blur"}],newPassword:[{required:!0,message:"请输入新密码",trigger:"blur"},{min:6,message:"密码长度不能小于6位",trigger:"blur"}],confirmPassword:[{required:!0,message:"请确认新密码",trigger:"blur"},{validator:(t,r,I)=>{r!==m.newPassword?I(new Error("两次输入密码不一致")):I()},trigger:"blur"}]}),_=async()=>{b.value=!0;try{const t=await z();p.value=t.data||{}}catch(t){console.error("获取用户信息失败:",t),w.error("获取用户信息失败"),p.value={id:1,username:"admin",name:"系统管理员",role:{id:1,name:"管理员"},email:"admin@example.com",phone:"13800138000",status:"active",lastLoginTime:"2023-01-15 10:30:00",createdAt:"2023-01-01 00:00:00"}}finally{b.value=!1}},u=()=>{n.name=p.value.name,n.email=p.value.email,n.phone=p.value.phone,P.value=!0},i=async()=>{e.value&&await e.value.validate(async t=>{if(t){o.value=!0;try{await J(n),w.success("个人信息更新成功"),P.value=!1,_()}catch(r){console.error("更新个人信息失败:",r),w.error("更新个人信息失败")}finally{o.value=!1}}else return w.warning("请填写必填项"),!1})},V=async()=>{c.value&&await c.value.validate(async t=>{if(t){o.value=!0;try{await j(m),w.success("密码修改成功"),y()}catch(r){console.error("修改密码失败:",r),w.error("修改密码失败")}finally{o.value=!1}}else return w.warning("请填写必填项"),!1})},y=()=>{m.oldPassword="",m.newPassword="",m.confirmPassword="",c.value&&c.value.resetFields()};return k(()=>{_()}),{loading:b,submitting:o,userInfo:p,dialogVisible:P,form:n,formRef:e,rules:d,passwordForm:m,passwordFormRef:c,passwordRules:E,handleEdit:u,submitForm:i,handleUpdatePassword:V,resetPasswordForm:y}}},H={class:"profile-container"},K={class:"card-header"},O={class:"dialog-footer"};function Q(b,o,P,e,c,p){const n=D,d=B,m=L,E=T,_=h,u=A,i=N,V=M,y=R,t=S;return U(),x("div",H,[l(_,{class:"profile-card"},{header:a(()=>[v("div",K,[o[9]||(o[9]=v("span",null,"个人信息",-1)),l(n,{type:"primary",onClick:e.handleEdit},{default:a(()=>o[8]||(o[8]=[s("编辑")])),_:1},8,["onClick"])])]),default:a(()=>[q((U(),x("div",null,[l(E,{column:2,border:""},{default:a(()=>[l(d,{label:"用户名"},{default:a(()=>[s(f(e.userInfo.username),1)]),_:1}),l(d,{label:"姓名"},{default:a(()=>[s(f(e.userInfo.name),1)]),_:1}),l(d,{label:"角色"},{default:a(()=>{var r;return[s(f((r=e.userInfo.role)==null?void 0:r.name),1)]}),_:1}),l(d,{label:"邮箱"},{default:a(()=>[s(f(e.userInfo.email),1)]),_:1}),l(d,{label:"手机号"},{default:a(()=>[s(f(e.userInfo.phone),1)]),_:1}),l(d,{label:"状态"},{default:a(()=>[l(m,{type:e.userInfo.status==="active"?"success":"danger"},{default:a(()=>[s(f(e.userInfo.status==="active"?"启用":"禁用"),1)]),_:1},8,["type"])]),_:1}),l(d,{label:"最后登录时间"},{default:a(()=>[s(f(e.userInfo.lastLoginTime),1)]),_:1}),l(d,{label:"创建时间"},{default:a(()=>[s(f(e.userInfo.createdAt),1)]),_:1})]),_:1})])),[[t,e.loading]])]),_:1}),l(_,{class:"password-card"},{header:a(()=>o[10]||(o[10]=[v("div",{class:"card-header"},[v("span",null,"修改密码")],-1)])),default:a(()=>[l(V,{ref:"passwordFormRef",model:e.passwordForm,rules:e.passwordRules,"label-width":"120px"},{default:a(()=>[l(i,{label:"原密码",prop:"oldPassword"},{default:a(()=>[l(u,{modelValue:e.passwordForm.oldPassword,"onUpdate:modelValue":o[0]||(o[0]=r=>e.passwordForm.oldPassword=r),type:"password",placeholder:"请输入原密码","show-password":""},null,8,["modelValue"])]),_:1}),l(i,{label:"新密码",prop:"newPassword"},{default:a(()=>[l(u,{modelValue:e.passwordForm.newPassword,"onUpdate:modelValue":o[1]||(o[1]=r=>e.passwordForm.newPassword=r),type:"password",placeholder:"请输入新密码","show-password":""},null,8,["modelValue"])]),_:1}),l(i,{label:"确认新密码",prop:"confirmPassword"},{default:a(()=>[l(u,{modelValue:e.passwordForm.confirmPassword,"onUpdate:modelValue":o[2]||(o[2]=r=>e.passwordForm.confirmPassword=r),type:"password",placeholder:"请确认新密码","show-password":""},null,8,["modelValue"])]),_:1}),l(i,null,{default:a(()=>[l(n,{type:"primary",onClick:e.handleUpdatePassword,loading:e.submitting},{default:a(()=>o[11]||(o[11]=[s("保存")])),_:1},8,["onClick","loading"]),l(n,{onClick:e.resetPasswordForm},{default:a(()=>o[12]||(o[12]=[s("重置")])),_:1},8,["onClick"])]),_:1})]),_:1},8,["model","rules"])]),_:1}),l(y,{modelValue:e.dialogVisible,"onUpdate:modelValue":o[7]||(o[7]=r=>e.dialogVisible=r),title:"编辑个人信息",width:"500px"},{footer:a(()=>[v("span",O,[l(n,{onClick:o[6]||(o[6]=r=>e.dialogVisible=!1)},{default:a(()=>o[13]||(o[13]=[s("取消")])),_:1}),l(n,{type:"primary",onClick:e.submitForm,loading:e.submitting},{default:a(()=>o[14]||(o[14]=[s(" 确认 ")])),_:1},8,["onClick","loading"])])]),default:a(()=>[l(V,{ref:"formRef",model:e.form,rules:e.rules,"label-width":"100px"},{default:a(()=>[l(i,{label:"姓名",prop:"name"},{default:a(()=>[l(u,{modelValue:e.form.name,"onUpdate:modelValue":o[3]||(o[3]=r=>e.form.name=r),placeholder:"请输入姓名"},null,8,["modelValue"])]),_:1}),l(i,{label:"邮箱",prop:"email"},{default:a(()=>[l(u,{modelValue:e.form.email,"onUpdate:modelValue":o[4]||(o[4]=r=>e.form.email=r),placeholder:"请输入邮箱"},null,8,["modelValue"])]),_:1}),l(i,{label:"手机号",prop:"phone"},{default:a(()=>[l(u,{modelValue:e.form.phone,"onUpdate:modelValue":o[5]||(o[5]=r=>e.form.phone=r),placeholder:"请输入手机号"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["modelValue"])])}const re=C(G,[["render",Q],["__scopeId","data-v-5d6e3267"]]);export{re as default};
