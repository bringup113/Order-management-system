import{U as e}from"./index-518491b2.js";function o(t){return e({url:"/products",method:"get",params:t})}function c(t){return e({url:`/products/${t}`,method:"get"})}function d(t){return e({url:"/products",method:"post",data:t})}function n(t,u){return e({url:`/products/${t}`,method:"put",data:u})}function s(t){return e({url:`/products/${t}`,method:"delete"})}function p(t){return e({url:`/products/${t}/quotes`,method:"get"})}function a(t,u){return e({url:`/products/${t}/quotes`,method:"post",data:u})}function i(t,u){return e({url:`/product-quotes/${t}`,method:"put",data:u})}function l(t){return e({url:`/product-quotes/${t}`,method:"delete"})}function g(t){return e({url:`/product-quotes/${t}/agent-prices`,method:"get"})}function P(t,u){return e({url:`/product-quotes/${t}/agent-prices`,method:"post",data:u})}function f(t,u){return e({url:`/agent-product-prices/${t}`,method:"put",data:u})}function m(t){return e({url:`/agent-product-prices/${t}`,method:"delete"})}export{c as a,p as b,d as c,s as d,l as e,i as f,o as g,a as h,g as i,m as j,f as k,P as l,n as u};
