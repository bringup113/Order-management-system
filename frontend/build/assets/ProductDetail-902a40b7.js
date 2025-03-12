import{_ as Q,M as T,b as A,r as D,c as B,y as L,o as f,e as q,i as _,f as o,w as a,J as x,k as I,Q as M,E as k,I as z,t as N,A as R,L as V,n,z as i,R as F,F as S,S as j,D as G,G as J,T as O}from"./index-518491b2.js";/* empty css                   *//* empty css                 *//* empty css                        *//* empty css               *//* empty css                *//* empty css                             */import{a as H,b as K,e as U}from"./product-50d99a21.js";const W={name:"ProductDetail",setup(){const v=T(),t=A(),m=D(!1),e=D(!1),c=B({id:null,name:"",type:"",description:"",details:"",status:"",remark:"",createdAt:"",updatedAt:""}),b=D([]),r=l=>({tour:"旅游产品",hotel:"酒店",flight:"机票",other:"其他"})[l]||"未知",s=l=>{m.value=!0,H(l).then(d=>{const P=M(d);Object.assign(c,P)}).catch(d=>{console.error("获取产品详情失败",d),k.error("获取产品详情失败")}).finally(()=>{m.value=!1})},h=l=>{e.value=!0,K(l).then(d=>{b.value=d.data||[]}).catch(d=>{console.error("获取产品报价失败",d),k.error("获取产品报价失败")}).finally(()=>{e.value=!1})},C=()=>{t.push(`/product/edit/${c.id}`)},y=()=>{t.push(`/product/quotes/${c.id}`)},u=()=>{t.push(`/product/quote/create?productId=${c.id}`)},E=l=>{t.push(`/product/quote/edit/${l.id}`)},w=l=>{t.push(`/product/quote/${l.id}/agent-prices`)},g=l=>{z.confirm("确认删除该报价吗？","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{U(l.id).then(()=>{k.success("删除成功"),h(c.id)}).catch(d=>{console.error("删除报价失败",d),k.error("删除报价失败")})}).catch(()=>{})},p=()=>{t.push("/product/list")};return L(()=>{if(v.params.id){const l=v.params.id;s(l),h(l)}}),{loading:m,quotesLoading:e,productInfo:c,quoteList:b,getProductTypeText:r,handleEdit:C,handleQuotes:y,handleAddQuote:u,handleEditQuote:E,handleAgentPrices:w,handleDeleteQuote:g,goBack:p}}},X={class:"product-detail-container"},Y={class:"product-detail-header"},Z={class:"header-actions"},$={class:"product-details"},tt={class:"quotes-header"},et={key:1,class:"empty-quotes"};function ot(v,t,m,e,c,b){const r=N,s=F,h=S,C=j,y=R,u=G,E=J,w=O,g=V;return f(),q("div",X,[_("div",Y,[t[3]||(t[3]=_("h2",null,"产品详情",-1)),_("div",Z,[o(r,{type:"primary",onClick:e.handleEdit},{default:a(()=>t[0]||(t[0]=[n("编辑")])),_:1},8,["onClick"]),o(r,{type:"warning",onClick:e.handleQuotes},{default:a(()=>t[1]||(t[1]=[n("管理报价")])),_:1},8,["onClick"]),o(r,{onClick:e.goBack},{default:a(()=>t[2]||(t[2]=[n("返回")])),_:1},8,["onClick"])])]),x((f(),I(y,{class:"detail-container"},{default:a(()=>[o(C,{title:"基本信息",column:2,border:""},{default:a(()=>[o(s,{label:"产品名称"},{default:a(()=>[n(i(e.productInfo.name),1)]),_:1}),o(s,{label:"产品类型"},{default:a(()=>[n(i(e.getProductTypeText(e.productInfo.type)),1)]),_:1}),o(s,{label:"产品描述"},{default:a(()=>[n(i(e.productInfo.description),1)]),_:1}),o(s,{label:"状态"},{default:a(()=>[o(h,{type:e.productInfo.status==="active"?"success":"info"},{default:a(()=>[n(i(e.productInfo.status==="active"?"上架":"下架"),1)]),_:1},8,["type"])]),_:1}),o(s,{label:"创建时间"},{default:a(()=>[n(i(e.productInfo.createdAt),1)]),_:1}),o(s,{label:"更新时间"},{default:a(()=>[n(i(e.productInfo.updatedAt),1)]),_:1}),o(s,{label:"产品详情",span:2},{default:a(()=>[_("div",$,i(e.productInfo.details||"无"),1)]),_:1}),o(s,{label:"备注",span:2},{default:a(()=>[n(i(e.productInfo.remark||"无"),1)]),_:1})]),_:1})]),_:1})),[[g,e.loading]]),x((f(),I(y,{class:"quotes-container"},{default:a(()=>[_("div",tt,[t[5]||(t[5]=_("h3",null,"产品报价信息",-1)),o(r,{type:"primary",size:"small",onClick:e.handleAddQuote},{default:a(()=>t[4]||(t[4]=[n("添加报价")])),_:1},8,["onClick"])]),e.quoteList.length>0?(f(),I(E,{key:0,data:e.quoteList,border:"",style:{width:"100%"}},{default:a(()=>[o(u,{prop:"supplierName",label:"供应商",width:"150"}),o(u,{prop:"costPrice",label:"成本价格",width:"120"},{default:a(p=>[n(i(p.row.costPrice.toFixed(2))+" 元 ",1)]),_:1}),o(u,{prop:"remark",label:"备注","show-overflow-tooltip":""}),o(u,{prop:"createdAt",label:"创建时间",width:"180"}),o(u,{label:"操作",width:"250"},{default:a(p=>[o(r,{size:"small",type:"primary",onClick:l=>e.handleEditQuote(p.row)},{default:a(()=>t[6]||(t[6]=[n("编辑")])),_:2},1032,["onClick"]),o(r,{size:"small",type:"success",onClick:l=>e.handleAgentPrices(p.row)},{default:a(()=>t[7]||(t[7]=[n("代理价格")])),_:2},1032,["onClick"]),o(r,{size:"small",type:"danger",onClick:l=>e.handleDeleteQuote(p.row)},{default:a(()=>t[8]||(t[8]=[n("删除")])),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])):(f(),q("div",et,[o(w,{description:"暂无报价信息"})]))]),_:1})),[[g,e.quotesLoading]])])}const ut=Q(W,[["render",ot],["__scopeId","data-v-e1d06720"]]);export{ut as default};
