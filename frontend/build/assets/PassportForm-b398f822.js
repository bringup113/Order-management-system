import{_ as y,M as v,b as M,r as V,x,c as E,y as k,o as q,e as N,i as b,z as P,f as o,w as r,E as D,A as U,n as f,q as F,s as h,N as C,O as R,P as w,t as B,g as I}from"./index-518491b2.js";/* empty css                *//* empty css                     *//* empty css                       *//* empty css                 *//* empty css                 */import{a as O,u as j,c as z}from"./passport-f309c118.js";const A={name:"PassportForm",setup(){const i=v(),e=M(),c=V(null),a=V(!1),s=x(()=>i.name==="PassportEdit"),d=E({id:null,name:"",passportNo:"",nationality:"",gender:"male",birthDate:"",issueDate:"",expiryDate:"",remarks:""}),u={name:[{required:!0,message:"请输入客户姓名",trigger:"blur"}],passportNo:[{required:!0,message:"请输入护照号码",trigger:"blur"}],nationality:[{required:!0,message:"请输入国籍",trigger:"blur"}],gender:[{required:!0,message:"请选择性别",trigger:"change"}],birthDate:[{required:!0,message:"请选择出生日期",trigger:"change"}],issueDate:[{required:!0,message:"请选择签发日期",trigger:"change"}],expiryDate:[{required:!0,message:"请选择有效期",trigger:"change"}]},t=n=>{a.value=!0,O(n).then(m=>{Object.assign(d,m.data)}).catch(m=>{console.error("获取护照详情失败",m),D.error("获取护照详情失败")}).finally(()=>{a.value=!1})},p=()=>{c.value.validate(n=>{if(n)a.value=!0,(s.value?j(d.id,d):z(d)).then(()=>{D.success(s.value?"修改成功":"添加成功"),e.push("/customer/passport/list")}).catch(g=>{console.error(s.value?"修改护照失败":"添加护照失败",g),D.error(s.value?"修改护照失败":"添加护照失败")}).finally(()=>{a.value=!1});else return!1})},_=()=>{e.push("/customer/passport/list")};return k(()=>{s.value&&i.params.id&&t(i.params.id)}),{formRef:c,form:d,rules:u,loading:a,isEdit:s,submitForm:p,cancel:_}}},G={class:"passport-form-container"},S={class:"passport-form-header"};function T(i,e,c,a,s,d){const u=F,t=h,p=C,_=R,n=w,m=B,g=I,Y=U;return q(),N("div",G,[b("div",S,[b("h2",null,P(a.isEdit?"编辑护照":"新增护照"),1)]),o(Y,{class:"form-container"},{default:r(()=>[o(g,{ref:"formRef",model:a.form,rules:a.rules,"label-width":"120px","label-position":"right"},{default:r(()=>[o(t,{label:"客户姓名",prop:"name"},{default:r(()=>[o(u,{modelValue:a.form.name,"onUpdate:modelValue":e[0]||(e[0]=l=>a.form.name=l),placeholder:"请输入客户姓名"},null,8,["modelValue"])]),_:1}),o(t,{label:"护照号码",prop:"passportNo"},{default:r(()=>[o(u,{modelValue:a.form.passportNo,"onUpdate:modelValue":e[1]||(e[1]=l=>a.form.passportNo=l),placeholder:"请输入护照号码"},null,8,["modelValue"])]),_:1}),o(t,{label:"国籍",prop:"nationality"},{default:r(()=>[o(u,{modelValue:a.form.nationality,"onUpdate:modelValue":e[2]||(e[2]=l=>a.form.nationality=l),placeholder:"请输入国籍"},null,8,["modelValue"])]),_:1}),o(t,{label:"性别",prop:"gender"},{default:r(()=>[o(_,{modelValue:a.form.gender,"onUpdate:modelValue":e[3]||(e[3]=l=>a.form.gender=l)},{default:r(()=>[o(p,{label:"male"},{default:r(()=>e[8]||(e[8]=[f("男")])),_:1}),o(p,{label:"female"},{default:r(()=>e[9]||(e[9]=[f("女")])),_:1})]),_:1},8,["modelValue"])]),_:1}),o(t,{label:"出生日期",prop:"birthDate"},{default:r(()=>[o(n,{modelValue:a.form.birthDate,"onUpdate:modelValue":e[4]||(e[4]=l=>a.form.birthDate=l),type:"date",placeholder:"选择出生日期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD"},null,8,["modelValue"])]),_:1}),o(t,{label:"签发日期",prop:"issueDate"},{default:r(()=>[o(n,{modelValue:a.form.issueDate,"onUpdate:modelValue":e[5]||(e[5]=l=>a.form.issueDate=l),type:"date",placeholder:"选择签发日期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD"},null,8,["modelValue"])]),_:1}),o(t,{label:"有效期至",prop:"expiryDate"},{default:r(()=>[o(n,{modelValue:a.form.expiryDate,"onUpdate:modelValue":e[6]||(e[6]=l=>a.form.expiryDate=l),type:"date",placeholder:"选择有效期",format:"YYYY-MM-DD","value-format":"YYYY-MM-DD"},null,8,["modelValue"])]),_:1}),o(t,{label:"备注",prop:"remarks"},{default:r(()=>[o(u,{modelValue:a.form.remarks,"onUpdate:modelValue":e[7]||(e[7]=l=>a.form.remarks=l),type:"textarea",placeholder:"请输入备注信息",rows:3},null,8,["modelValue"])]),_:1}),o(t,null,{default:r(()=>[o(m,{type:"primary",onClick:a.submitForm},{default:r(()=>e[10]||(e[10]=[f("保存")])),_:1},8,["onClick"]),o(m,{onClick:a.cancel},{default:r(()=>e[11]||(e[11]=[f("取消")])),_:1},8,["onClick"])]),_:1})]),_:1},8,["model","rules"])]),_:1})])}const Z=y(A,[["render",T],["__scopeId","data-v-0ce236c5"]]);export{Z as default};
