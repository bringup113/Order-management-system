import{_ as k,M as x,b as q,r as V,x as F,c as P,y as C,o as R,e as U,i as b,z as w,f as l,w as t,E as v,A as h,n as f,q as B,s as N,V as D,W as I,N as M,O,t as S,g as j}from"./index-518491b2.js";/* empty css                *//* empty css                     *//* empty css                 *//* empty css               *//* empty css                  *//* empty css                 */import{a as z,u as A,c as G}from"./product-50d99a21.js";const T={name:"ProductForm",setup(){const p=x(),o=q(),_=V(null),e=V(!1),s=F(()=>p.name==="ProductEdit"),n=P({id:null,name:"",type:"tour",description:"",details:"",status:"active",remark:""}),d={name:[{required:!0,message:"请输入产品名称",trigger:"blur"}],type:[{required:!0,message:"请选择产品类型",trigger:"change"}],description:[{required:!0,message:"请输入产品描述",trigger:"blur"}],status:[{required:!0,message:"请选择产品状态",trigger:"change"}]},r=i=>{e.value=!0,z(i).then(m=>{Object.assign(n,m.data)}).catch(m=>{console.error("获取产品详情失败",m),v.error("获取产品详情失败")}).finally(()=>{e.value=!1})},u=()=>{_.value.validate(i=>{if(i)e.value=!0,(s.value?A(n.id,n):G(n)).then(()=>{v.success(s.value?"修改成功":"添加成功"),o.push("/product/list")}).catch(c=>{console.error(s.value?"修改产品失败":"添加产品失败",c),v.error(s.value?"修改产品失败":"添加产品失败")}).finally(()=>{e.value=!1});else return!1})},g=()=>{o.push("/product/list")};return C(()=>{s.value&&p.params.id&&r(p.params.id)}),{formRef:_,form:n,rules:d,loading:e,isEdit:s,submitForm:u,cancel:g}}},W={class:"product-form-container"},H={class:"product-form-header"};function J(p,o,_,e,s,n){const d=B,r=N,u=D,g=I,i=M,m=O,c=S,y=j,E=h;return R(),U("div",W,[b("div",H,[b("h2",null,w(e.isEdit?"编辑产品":"新增产品"),1)]),l(E,{class:"form-container"},{default:t(()=>[l(y,{ref:"formRef",model:e.form,rules:e.rules,"label-width":"120px","label-position":"right"},{default:t(()=>[l(r,{label:"产品名称",prop:"name"},{default:t(()=>[l(d,{modelValue:e.form.name,"onUpdate:modelValue":o[0]||(o[0]=a=>e.form.name=a),placeholder:"请输入产品名称"},null,8,["modelValue"])]),_:1}),l(r,{label:"产品类型",prop:"type"},{default:t(()=>[l(g,{modelValue:e.form.type,"onUpdate:modelValue":o[1]||(o[1]=a=>e.form.type=a),placeholder:"请选择产品类型"},{default:t(()=>[l(u,{label:"旅游产品",value:"tour"}),l(u,{label:"酒店",value:"hotel"}),l(u,{label:"机票",value:"flight"}),l(u,{label:"其他",value:"other"})]),_:1},8,["modelValue"])]),_:1}),l(r,{label:"产品描述",prop:"description"},{default:t(()=>[l(d,{modelValue:e.form.description,"onUpdate:modelValue":o[2]||(o[2]=a=>e.form.description=a),placeholder:"请输入产品描述"},null,8,["modelValue"])]),_:1}),l(r,{label:"产品详情",prop:"details"},{default:t(()=>[l(d,{modelValue:e.form.details,"onUpdate:modelValue":o[3]||(o[3]=a=>e.form.details=a),type:"textarea",placeholder:"请输入产品详情",rows:5},null,8,["modelValue"])]),_:1}),l(r,{label:"产品状态",prop:"status"},{default:t(()=>[l(m,{modelValue:e.form.status,"onUpdate:modelValue":o[4]||(o[4]=a=>e.form.status=a)},{default:t(()=>[l(i,{label:"active"},{default:t(()=>o[6]||(o[6]=[f("上架")])),_:1}),l(i,{label:"inactive"},{default:t(()=>o[7]||(o[7]=[f("下架")])),_:1})]),_:1},8,["modelValue"])]),_:1}),l(r,{label:"备注",prop:"remark"},{default:t(()=>[l(d,{modelValue:e.form.remark,"onUpdate:modelValue":o[5]||(o[5]=a=>e.form.remark=a),type:"textarea",placeholder:"请输入备注信息",rows:3},null,8,["modelValue"])]),_:1}),l(r,null,{default:t(()=>[l(c,{type:"primary",onClick:e.submitForm,loading:e.loading},{default:t(()=>o[8]||(o[8]=[f("保存")])),_:1},8,["onClick","loading"]),l(c,{onClick:e.cancel},{default:t(()=>o[9]||(o[9]=[f("取消")])),_:1},8,["onClick"])]),_:1})]),_:1},8,["model","rules"])]),_:1})])}const oe=k(T,[["render",J],["__scopeId","data-v-e176ded5"]]);export{oe as default};
