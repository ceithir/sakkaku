(this.webpackJsonpsakkaku=this.webpackJsonpsakkaku||[]).push([[15],{498:function(e,a,t){var n=t(499);"string"===typeof n&&(n=[[e.i,n,""]]);var r={hmr:!0,transform:void 0,insertInto:void 0};t(126)(n,r);n.locals&&(e.exports=n.locals)},499:function(e,a,t){(a=t(125)(!1)).push([e.i,"._18zXDSuc3aaCF48B0sS5mQ {\n  margin: 24px auto;\n  padding: 0 16px;\n  max-width: 768px;\n  justify-content: center;\n}\n._18zXDSuc3aaCF48B0sS5mQ.ant-form-inline .ant-form-item {\n  margin-bottom: 8px;\n}\n@media (max-width: 576px) {\n  ._18zXDSuc3aaCF48B0sS5mQ {\n    justify-content: space-between;\n  }\n}\n._18zXDSuc3aaCF48B0sS5mQ output {\n  text-align: justify;\n}\n",""]),a.locals={form:"_18zXDSuc3aaCF48B0sS5mQ"},e.exports=a},500:function(e,a,t){var n=t(501),r=["asyncCumulativeSuccess"];e.exports=function(){var e=new Worker(t.p+"a5adcee4c624519fcde8.worker.js",{name:"[hash].worker.js"});return n(e,r),e}},509:function(e,a,t){"use strict";t.r(a);var n,r=t(88),s=t(27),i=t.n(s),c=t(48),l=t(0),m=t.n(l),o=t(513),u=t(512),f=t(345),p=t(521),d=t(340),k=t(498),v=t.n(k),E=t(500),h=t.n(E),b=t(522),g=o.a.Paragraph,x=o.a.Text,S={},j=function(e){return JSON.stringify(e)},y=function(e){return S[j(e)]},C=function(){var e=Object(c.a)(i.a.mark((function e(a){var t,r,s;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=a.mathParams,r=a.callback,n.asyncCumulativeSuccess(t),s=setInterval((function(){var e=y(t);e&&(clearInterval(s),r(e))}));case 3:case"end":return e.stop()}}),e)})));return function(a){return e.apply(this,arguments)}}(),w=function(e){var a=e.ring,t=e.skill,s=e.tn,i=e.unskilled_assist,c=e.skilled_assist,o=e.compromised,u=Object(l.useState)(!0),f=Object(r.a)(u,2),p=f[0],d=f[1],k=Object(l.useState)(),v=Object(r.a)(k,2),E=v[0],b=v[1];return Object(l.useEffect)((function(){return(n=h()()).addEventListener("message",(function(e){var a=e.data,t=a.type,n=a.params,r=a.result;"custom"===t&&function(e,a){S[j(e)]=a}(n,"".concat((100*Math.abs(r)).toFixed(2),"%"))})),function(){n.terminate()}}),[]),Object(l.useEffect)((function(){if(![s,a,t,c,i].every((function(e){return Number.isInteger(e)&&e>=0&&e<=10}))||s<1||a<1)d(!0);else{var e={tn:s,ring:a+i,skill:t+c,options:{compromised:o,keptDiceCount:a+i+c}},n=function(){var a=y(e);return!!a&&(b(a),d(!1),!0)};n()||(setTimeout((function(){n()||d(!0)}),100),C({mathParams:e,callback:n}))}}),[a,t,s,i,c,o]),m.a.createElement(O,{loading:p,result:E,compromised:o})},O=function(e){var a=e.result,t=e.loading,n=e.compromised;return m.a.createElement(g,null,m.a.createElement(x,null,n?"Chances to achieve TN, without taking strife, ignoring rerolls and other modifiers: ":"Chances to achieve TN, taking as much strife as necessary, ignoring rerolls and other modifiers: "),m.a.createElement(x,{strong:!0},t?m.a.createElement(b.a,null):a),m.a.createElement(x,null,"."))};a.default=function(){var e=u.a.useForm(),a=Object(r.a)(e,1)[0],t={ring:3,skill:1,tn:3,unskilled_assist:0,skilled_assist:0,compromised:!1},n=Object(l.useState)(t),s=Object(r.a)(n,2),i=s[0],c=s[1];return m.a.createElement(u.a,{layout:"inline",form:a,initialValues:t,onValuesChange:function(e,a){c(a)},className:v.a.form},m.a.createElement(u.a.Item,{label:"Ring",name:"ring"},m.a.createElement(f.a,{min:1,max:10})),m.a.createElement(u.a.Item,{label:"Skill",name:"skill"},m.a.createElement(f.a,{min:0,max:10})),m.a.createElement(u.a.Item,{label:"TN",name:"tn"},m.a.createElement(f.a,{min:1,max:10})),m.a.createElement(u.a.Item,{label:"Compromised?",name:"compromised",valuePropName:"checked"},m.a.createElement(p.a,null)),m.a.createElement(d.a,null),m.a.createElement(u.a.Item,{label:"Assistance (unskilled)",name:"unskilled_assist"},m.a.createElement(f.a,{min:0,max:10})),m.a.createElement(u.a.Item,{label:"Assistance (skilled)",name:"skilled_assist"},m.a.createElement(f.a,{min:0,max:10})),m.a.createElement(d.a,null),m.a.createElement("output",null,m.a.createElement(w,i)))}}}]);
//# sourceMappingURL=15.7f91f087.chunk.js.map