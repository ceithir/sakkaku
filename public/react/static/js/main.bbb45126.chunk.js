(this.webpackJsonpsakkaku=this.webpackJsonpsakkaku||[]).push([[5],{10:function(e,t,n){"use strict";n.d(t,"d",(function(){return c})),n.d(t,"c",(function(){return s})),n.d(t,"b",(function(){return d})),n.d(t,"a",(function(){return p}));var r=n(27),a=n.n(r),i=n(44),o=n(48),c="",u="".concat(c,"/api"),l=function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,o,c,l,s,d,f,p,m;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.uri,r=t.method,o=t.body,c=t.success,l=t.error,s=t.extraHeaders,d=void 0===s?{}:s,f={Accept:"application/json"},o&&(f["Content-Type"]="application/json"),e.prev=3,e.next=6,fetch("".concat(u).concat(n),{method:r,headers:Object(i.a)({},f,{},d),body:o?JSON.stringify(o):void 0});case 6:if((p=e.sent).ok){e.next=9;break}throw new Error("Bad status: ".concat(p.status));case 9:return e.next=11,p.json();case 11:m=e.sent,c(m),e.next=18;break;case 15:e.prev=15,e.t0=e.catch(3),l?l(e.t0):console.error(e.t0);case 18:case"end":return e.stop()}}),e,null,[[3,15]])})));return function(t){return e.apply(this,arguments)}}(),s=function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,i,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.uri,r=t.body,i=t.success,o=t.error,e.abrupt("return",l({uri:n,method:"POST",body:r,success:i,error:o}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),d=function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,i;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.uri,r=t.success,i=t.error,e.abrupt("return",l({uri:n,method:"GET",success:r,error:i}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),f=function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,i,o,c;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.uri,r=t.method,i=t.body,o=t.success,c=t.error,e.abrupt("return",l({uri:n,method:r,body:i,success:o,error:c,extraHeaders:{"X-Requested-With":"XMLHttpRequest","X-XSRF-TOKEN":decodeURIComponent(document.cookie.match("(^|;) ?XSRF-TOKEN=([^;]*)(;|$)")[2])}}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),p=function(){var e=Object(o.a)(a.a.mark((function e(t){var n,r,i,o;return a.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.uri,r=t.body,i=t.success,o=t.error,e.abrupt("return",f({uri:n,method:"POST",body:r,success:i,error:o}));case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}()},119:function(e,t,n){e.exports=n.p+"static/media/logo.20098cc4.png"},137:function(e,t,n){e.exports=n(172)},142:function(e,t,n){},143:function(e,t,n){},144:function(e,t,n){(t=n(125)(!1)).push([e.i,".YuqDUKv5Y3VYUWvsXXqul {\n  min-height: 100vh;\n  background-color: #f5f5f5;\n  /* Allow to strech direct children height with instructions like flex: 1 */\n}\n.YuqDUKv5Y3VYUWvsXXqul .ant-layout-content {\n  display: flex;\n  flex-direction: column;\n}\n._1DUVyuelVQQSRMQLUFWpdr {\n  text-align: center;\n}\n@media (max-width: 576px) {\n  .YuqDUKv5Y3VYUWvsXXqul > header {\n    padding: 0;\n  }\n}\n",""]),t.locals={layout:"YuqDUKv5Y3VYUWvsXXqul",footer:"_1DUVyuelVQQSRMQLUFWpdr"},e.exports=t},172:function(e,t,n){"use strict";n.r(t);var r=n(0),a=n.n(r),i=n(9),o=n.n(i),c=(n(142),n(143),n(175)),u=n(81),l=n.n(u),s=n(88),d=n(173),f=n(119),p=n.n(f),m=n(32),h=n.n(m),g=n(8),b=n(18),v=n(45),y=n(46),k=d.a.SubMenu,E=function(){var e=Object(v.c)(y.f),t=Object(g.g)(),n=Object(r.useState)(),i=Object(s.a)(n,2),o=i[0],c=i[1];return Object(r.useEffect)((function(){c(function(t){var n=t.pathname,r=t.search;return"/"===n?"new_roll":"/rolls"!==n||r?"/rolls"===n&&e&&r==="?player=".concat(e.id)?"my_rolls":n.substring(1,n.length):"all_rolls"}(t))}),[t,e]),a.a.createElement(d.a,{theme:"dark",mode:"horizontal",selectedKeys:[o],onSelect:function(e){var t=e.key;return c(t)},className:h.a.menu},a.a.createElement(d.a.Item,{className:h.a.logo,key:"home"},a.a.createElement(b.b,{to:"/"},a.a.createElement("img",{alt:"Logo",src:p.a}))),a.a.createElement(d.a.Item,{key:"new_roll"},a.a.createElement(b.b,{to:"/"},"Roll")),a.a.createElement(d.a.Item,{key:"all_rolls",className:h.a["sm-hide"]},a.a.createElement(b.b,{to:"/rolls"},"All rolls")),e&&a.a.createElement(d.a.Item,{key:"my_rolls",className:h.a["sm-hide"]},a.a.createElement(b.b,{to:"/rolls?player=".concat(e.id)},"My rolls")),a.a.createElement(d.a.Item,{key:"heritage",className:h.a["sm-hide"]},a.a.createElement(b.b,{to:"/heritage"},"Heritage")),a.a.createElement(d.a.Item,{key:"probabilities",className:h.a["sm-hide"]},a.a.createElement(b.b,{to:"/probabilities"},"Probabilities")),a.a.createElement(k,{key:"plus",title:"...",className:h.a["sm-only"],popupOffset:[0,0]},a.a.createElement(d.a.Item,{key:"all_rolls"},a.a.createElement(b.b,{to:"/rolls"},"All rolls")),e&&a.a.createElement(d.a.Item,{key:"my_rolls"},a.a.createElement(b.b,{to:"/rolls?player=".concat(e.id)},"My rolls")),a.a.createElement(d.a.Item,{key:"heritage"},a.a.createElement(b.b,{to:"/heritage"},"Heritage")),a.a.createElement(d.a.Item,{key:"probabilities"},a.a.createElement(b.b,{to:"/probabilities"},"Probabilities"))),a.a.createElement(d.a.Item,{className:h.a.login},e?a.a.createElement("a",{href:"/user/profile"},e.name):a.a.createElement("a",{href:"/login"},"Login")))},O=c.a.Header,j=c.a.Content,w=c.a.Footer,x=function(e){var t=e.children;return a.a.createElement(c.a,{className:l.a.layout},a.a.createElement(O,null,a.a.createElement(E,null)),a.a.createElement(j,null,t),a.a.createElement(w,{className:l.a.footer},"A dice roller for the ",a.a.createElement("a",{href:"https://www.fantasyflightgames.com/en/legend-of-the-five-rings-roleplaying-game/"},"Legend of the Five Rings Roleplaying Game (5th edition)")," \u2013 \xa9FFG for all texts and assets",a.a.createElement("br",null),"This website is not affiliated in any way with Fantasy Flight Games or Edge Studio.",a.a.createElement("br",null),"For any issue or suggestion: ",a.a.createElement("a",{href:"mailto:contact.sakkaku@gmail.com"},"contact.sakkaku@gmail.com")))},_=n(10),S=n(95),I=Object(r.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(9)]).then(n.bind(null,344))})),K=Object(r.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(12)]).then(n.bind(null,518))})),P=Object(r.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(8)]).then(n.bind(null,514))})),T=Object(r.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(11)]).then(n.bind(null,346))})),U=Object(r.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(2),n.e(3),n.e(10)]).then(n.bind(null,519))})),M=Object(r.lazy)((function(){return Promise.all([n.e(0),n.e(1),n.e(4),n.e(14)]).then(n.bind(null,520))})),R=Object(r.lazy)((function(){return Promise.all([n.e(0),n.e(2),n.e(13),n.e(15)]).then(n.bind(null,509))})),C=function(){var e=Object(v.b)();return Object(r.useEffect)((function(){Object(_.b)({uri:"/user",success:function(t){e(Object(y.g)(t))},error:function(e){}})}),[e]),a.a.createElement(b.a,null,a.a.createElement(x,null,a.a.createElement(r.Suspense,{fallback:a.a.createElement(S.a,null)},a.a.createElement(g.c,null,a.a.createElement(g.a,{path:"/probabilities"},a.a.createElement(R,null)),a.a.createElement(g.a,{path:"/heritage/list"},a.a.createElement(M,null)),a.a.createElement(g.a,{path:"/heritage/:uuid"},a.a.createElement(U,null)),a.a.createElement(g.a,{path:"/heritage"},a.a.createElement(T,null)),a.a.createElement(g.a,{path:"/rolls/:id"},a.a.createElement(P,null)),a.a.createElement(g.a,{path:"/rolls"},a.a.createElement(K,null)),a.a.createElement(g.a,{path:"/"},a.a.createElement(I,null))))))},N=n(37),X=n(89),F=n(94),L=Object(N.a)({reducer:{roll:X.f,user:y.c,heritage:F.b}});Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(v.a,{store:L},a.a.createElement(C,null))),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))},32:function(e,t,n){e.exports={logo:"Menu_logo__1R1uF",login:"Menu_login__10fZv",menu:"Menu_menu__2j8EX","sm-hide":"Menu_sm-hide__3Bw2S","sm-only":"Menu_sm-only__3LpXH"}},46:function(e,t,n){"use strict";n.d(t,"g",(function(){return o})),n.d(t,"a",(function(){return c})),n.d(t,"b",(function(){return u})),n.d(t,"f",(function(){return l})),n.d(t,"d",(function(){return s})),n.d(t,"e",(function(){return d}));var r=n(37),a=Object(r.b)({name:"user",initialState:{campaigns:[],characters:[]},reducers:{setUser:function(e,t){var n=t.payload,r=n.id,a=n.name,i=n.campaigns,o=n.characters;e.id=r,e.name=a,e.campaigns=i,e.characters=o},addCampaign:function(e,t){var n=t.payload;n&&!e.campaigns.includes(n)&&e.campaigns.push(n)},addCharacter:function(e,t){var n=t.payload;n&&!e.characters.includes(n)&&e.characters.push(n)}}}),i=a.actions,o=i.setUser,c=i.addCampaign,u=i.addCharacter,l=function(e){return e.user.id?e.user:void 0},s=function(e){return e.user.campaigns},d=function(e){return e.user.characters};t.c=a.reducer},56:function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"c",(function(){return a})),n.d(t,"b",(function(){return i})),n.d(t,"d",(function(){return o}));var r="declare",a="reroll",i="keep",o="resolve"},70:function(e,t,n){"use strict";n.d(t,"f",(function(){return i})),n.d(t,"i",(function(){return o})),n.d(t,"h",(function(){return c})),n.d(t,"n",(function(){return u})),n.d(t,"j",(function(){return l})),n.d(t,"d",(function(){return s})),n.d(t,"c",(function(){return f})),n.d(t,"k",(function(){return p})),n.d(t,"g",(function(){return m})),n.d(t,"e",(function(){return h})),n.d(t,"m",(function(){return g})),n.d(t,"l",(function(){return b})),n.d(t,"o",(function(){return v})),n.d(t,"b",(function(){return k})),n.d(t,"a",(function(){return E}));var r=n(31),a=["adversity","distinction","shadow","deathdealer","manipulator","ishiken","2heavens","ruthless","sailor","wandering"],i=function(e){return!(!o(e)&&!c(e))||a.includes(e)},o=function(e){return/^ruleless([0-9]{2})?$/.test(e)},c=function(e){return/^reasonless([0-9]{2})?$/.test(e)},u=function(e){var t=e.ring,n=e.skill,r=e.modifiers,a=void 0===r?[]:r;return t+n+d(a)+(a.includes("void")?1:0)+(a.includes("wandering")?1:0)},l=function(e){var t=e.ring,n=e.modifiers,r=void 0===n?[]:n;return t+(r.includes("void")?1:0)+d(r)},s=function(e){return["ishiken","wandering"].includes(e)||c(e)},d=function(e){return(null===e||void 0===e?void 0:e.length)?e.filter((function(e){return/^(un)?skilledassist([0-9]{2})$/.test(e)})).map((function(e){return parseInt(e.slice(-2))})).reduce((function(e,t){return e+t}),0):0},f=function(e){return{successCount:e.reduce((function(e,t){return e+(t.value.explosion||0)+(t.value.success||0)}),0),opportunityCount:e.reduce((function(e,t){return e+(t.value.opportunity||0)}),0),strifeCount:e.reduce((function(e,t){return e+(t.value.strife||0)}),0),blankCount:e.filter((function(e){var t=e.value,n=t.strife,r=t.opportunity,a=t.success,i=t.explosion;return 0===n&&0===r&&0===a&&0===i})).length}},p=function(e){var t=Object(r.a)(e);return t.sort((function(e,t){return"ring"===e.type&&"skill"===t.type?-1:"ring"===t.type&&"skill"===e.type?1:0})),t},m=function(e,t){var n=e.status,r=e.metadata;return"rerolled"===n&&(r.end?r.end===t:r.modifier===t)},h=function(e,t){var n=e.status,r=e.metadata;return r.source||r.end||!r.modifier?r.source===t:"rerolled"!==n&&r.modifier===t},g=function e(t){var n=t.dices,a=t.rerollType,i=t.previousRerollTypes,o=void 0===i?[]:i,c=t.basePool,u=n.filter((function(e){return h(e,a)})),l=u.filter((function(e){return"ring"===e.type})),s=u.filter((function(e){return"skill"===e.type}));return function(){if(0===o.length)return n.slice(0,c);var t=Object(r.a)(o),a=t.pop();return e({dices:n,rerollType:a,previousRerollTypes:t,basePool:c})}().map((function(e){return function(e){return m(e,a)}(e)?("skill"===e.type?s:l).shift():e}))},b=function(e){var t=e.dices,n=e.rerollTypes,a=e.basePool,i=t.filter((function(e){return"rerolled"===e.status})).length;if(0===i)return t;if(!a||!(null===n||void 0===n?void 0:n.length))return p(t.filter((function(e){return"rerolled"!==e.status})));var o=Object(r.a)(n),c=o.pop();return[].concat(Object(r.a)(g({dices:t,rerollType:c,previousRerollTypes:o,basePool:a})),Object(r.a)(t.slice(a+i)))},v=function(e){for(var t=e.dices,n=e.basePool,r=e.rerollTypes,a=[],i=b({dices:t,basePool:n,rerollTypes:r}),o=n+t.filter((function(e){var t=e.metadata;return"addkept"===(null===t||void 0===t?void 0:t.source)})).length;i.length>0;){var c=p(i.slice(0,o));i=i.slice(o,i.length),o=c.filter((function(e){var t=e.status,n=e.value.explosion;return"kept"===t&&n>0})).length,a.push(c)}return a},y=function(e){var t=e.value,n=t.success,r=void 0===n?0:n,a=t.opportunity,i=void 0===a?0:a,o=t.explosion,c=void 0===o?0:o,u=t.strife;return 10*c+5*r+2*i+-1*(void 0===u?0:u)},k=function(e){var t=e.dices,n=e.modifiers,r=void 0===n?[]:n,a=[];return t.forEach((function(e,t){var n=e.status,i=e.value.strife,o=void 0===i?0:i;"pending"!==n||r.includes("compromised")&&0!==o||a.push(t)})),t.some((function(e){return"kept"===e.status}))?a:a.map((function(e){var n=t[e];return{index:e,weight:y(n),type:n.type}})).sort((function(e,t){var n=e.weight,r=e.type,a=t.weight,i=t.type;return n===a?r===i?0:r>i?-1:1:n>a?-1:1})).map((function(e){return e.index})).slice(0,l(e))},E=function(e){var t=e.roll,n=e.max,r=e.restrictFunc,a=t.dices,i=t.modifiers,o=(void 0===i?[]:i).includes("compromised"),c=[];return a.forEach((function(e,t){"pending"!==e.status||r&&!r(e)||c.push(t)})),c.map((function(e){var t=a[e],n=t.type,r=t.value.strife;return{index:e,weight:o&&(void 0===r?0:r)>0?-100:y(t),type:n}})).sort((function(e,t){var n=e.weight,r=e.type,a=t.weight,i=t.type;return n===a?r===i?0:r>i?-1:1:n<a?-1:1})).map((function(e){return e.index})).slice(0,n)}},81:function(e,t,n){var r=n(144);"string"===typeof r&&(r=[[e.i,r,""]]);var a={hmr:!0,transform:void 0,insertInto:void 0};n(126)(r,a);r.locals&&(e.exports=r.locals)},86:function(e,t,n){e.exports={container:"Loader_container__3tlr0",loader:"Loader_loader__Jgwkb"}},89:function(e,t,n){"use strict";n.d(t,"u",(function(){return f})),n.d(t,"w",(function(){return m})),n.d(t,"s",(function(){return h})),n.d(t,"i",(function(){return g})),n.d(t,"v",(function(){return b})),n.d(t,"r",(function(){return v})),n.d(t,"d",(function(){return y})),n.d(t,"h",(function(){return k})),n.d(t,"t",(function(){return E})),n.d(t,"e",(function(){return _})),n.d(t,"k",(function(){return S})),n.d(t,"b",(function(){return I})),n.d(t,"g",(function(){return K})),n.d(t,"a",(function(){return P})),n.d(t,"j",(function(){return T})),n.d(t,"c",(function(){return M})),n.d(t,"l",(function(){return R})),n.d(t,"o",(function(){return C})),n.d(t,"p",(function(){return N})),n.d(t,"n",(function(){return X})),n.d(t,"m",(function(){return F})),n.d(t,"q",(function(){return L}));var r=n(31),a=n(44),i=n(37),o=n(10),c=n(56),u=n(70),l={tn:3,ring:3,skill:1,modifiers:[],dices:[],metadata:{},loading:!1,error:!1,toKeep:[],channeled:[],addkept:[],channelInsteadOfKeeping:!1,mode:"semiauto"},s=Object(i.b)({name:"roll",initialState:l,reducers:{softReset:function(e){e.tn=l.tn,e.ring=l.ring,e.skill=l.skill,e.description=null,e.dices=[],e.metadata={},e.modifiers=[],e.toKeep=[],e.channeled=[],e.addkept=[],e.channelInsteadOfKeeping=!1,e.id=null,window.history.pushState(null,null,"/")},setParameters:function(e,t){var n=t.payload,r=n.campaign,a=n.character,i=n.description,o=n.tn,c=n.ring,u=n.skill,l=n.modifiers,s=n.channeled,d=n.addkept;e.campaign=r,e.character=a,e.description=i,e.tn=o,e.ring=c,e.skill=u,e.modifiers=l,e.channeled=s,e.addkept=d,0===c&&(e.channelInsteadOfKeeping=!0)},setLoading:function(e,t){e.loading=t.payload},setError:function(e,t){e.error=t.payload},setAnimatedStep:function(e,t){e.animatedStep=t.payload},load:function(e,t){var n=t.payload,r=n.id,a=n.player,i=n.dices,o=n.metadata;e.id=r,e.player=a,e.dices=i,e.metadata=o,e.loading=!1,window.history.pushState(null,null,"/rolls/".concat(r)),e.toKeep=Y(e)},update:function(e,t){var n=t.payload,r=n.dices,a=n.metadata;e.dices=r,e.metadata=a,e.loading=!1,e.toKeep=Y(e)},setToKeep:function(e,t){e.toKeep=t.payload},setAddKept:function(e,t){e.addkept=t.payload},setModifiers:function(e,t){e.modifiers=t.payload},channelInsteadOfKeeping:function(e){e.channelInsteadOfKeeping=!0},keepInsteadOfChanneling:function(e){e.channelInsteadOfKeeping=!1},setMode:function(e,t){e.mode=t.payload}}}),d=s.actions,f=d.setParameters,p=d.setLoading,m=d.softReset,h=d.setAnimatedStep,g=d.load,b=d.setToKeep,v=d.setAddKept,y=d.channelInsteadOfKeeping,k=d.keepInsteadOfChanneling,E=d.setMode,O=s.actions,j=O.update,w=O.setError,x=O.setModifiers,_=function(e,t){return function(n){n(p(!0)),n(f(e));var r=function(){n(w(!0))},i=e.tn,c=e.ring,u=e.skill,l=e.modifiers,s=e.campaign,d=e.character,m=e.description,h=e.channeled,b=e.addkept;t?Object(o.a)({uri:"/ffg/l5r/rolls/create",body:{tn:i,ring:c,skill:u,modifiers:l,campaign:s,character:d,description:m,channeled:h,addkept:b},success:function(e){n(g(Object(a.a)({},e,{player:t})))},error:r}):Object(o.c)({uri:"/public/ffg/l5r/rolls/create",body:{tn:i,ring:c,skill:u,modifiers:l,channeled:h,addkept:b},success:function(e){n(j(e))},error:r})}},S=function(e,t,n){return function(r){r(p(!0));var a=function(e){r(j(e))},i=function(){r(w(!0))},c=e.id;if(c)Object(o.a)({uri:"/ffg/l5r/rolls/".concat(c,"/reroll"),body:{positions:t,modifier:n},success:a,error:i});else{var u=e.tn,l=e.ring,s=e.skill,d=e.modifiers,f=e.dices,m=e.metadata;Object(o.c)({uri:"/public/ffg/l5r/rolls/reroll",body:{roll:{parameters:{tn:u,ring:l,skill:s,modifiers:d},dices:f,metadata:m},positions:t,modifier:n},success:a,error:i})}}},I=function(e,t,n){return function(r){r(p(!0));var a=function(e){r(j(e))},i=function(){r(w(!0))},c=e.id;if(c)Object(o.a)({uri:"/ffg/l5r/rolls/".concat(c,"/alter"),body:{alterations:t,modifier:n},success:a,error:i});else{var u=e.tn,l=e.ring,s=e.skill,d=e.modifiers,f=e.dices,m=e.metadata;Object(o.c)({uri:"/public/ffg/l5r/rolls/alter",body:{roll:{parameters:{tn:u,ring:l,skill:s,modifiers:d},dices:f,metadata:m},alterations:t,modifier:n},success:a,error:i})}}},K=function(e,t,n){return function(r){r(p(!0));var a=function(e){r(j(e))},i=function(){r(w(!0))},c=e.id;if(c){var u=function(){return Object(o.a)({uri:"/ffg/l5r/rolls/".concat(c,"/keep"),body:{positions:t},success:a,error:i})};return(null===n||void 0===n?void 0:n.length)?void Object(o.a)({uri:"/ffg/l5r/rolls/".concat(c,"/parameters"),body:{addkept:n},success:u,error:i}):void u()}var l=e.tn,s=e.ring,d=e.skill,f=e.modifiers,m=e.dices,h=e.metadata,g=e.addkept;Object(o.c)({uri:"/public/ffg/l5r/rolls/keep",body:{roll:{parameters:{tn:l,ring:s,skill:d,modifiers:f,addkept:g},dices:m,metadata:h},positions:t},success:a,error:i})}},P=function(e,t){return function(n){n(p(!0));var a=e.id,i=e.modifiers,o=[].concat(Object(r.a)(i),Object(r.a)(t));U(a,o,n)}},T=function(e,t){return function(n){n(p(!0));var r=e.id,a=e.modifiers.filter((function(e){return!t.includes(e)}));U(r,a,n)}},U=function(e,t,n){e?Object(o.a)({uri:"/ffg/l5r/rolls/".concat(e,"/parameters"),body:{modifiers:t},success:function(e){var t=e.parameters.modifiers;n(x(t)),n(p(!1))},error:function(){n(w(!0))}}):(n(x(t)),n(p(!1)))},M=function(e,t){return function(n){n(p(!0));var r=function(e){n(j(e))},a=function(){n(w(!0))},i=e.id;if(i)Object(o.a)({uri:"/ffg/l5r/rolls/".concat(i,"/channel"),body:{positions:t},success:r,error:a});else{var c=e.tn,u=e.ring,l=e.skill,s=e.modifiers,d=e.dices,f=e.metadata;Object(o.c)({uri:"/public/ffg/l5r/rolls/channel",body:{roll:{parameters:{tn:c,ring:u,skill:l,modifiers:s},dices:d,metadata:f},positions:t},success:r,error:a})}}},R=function(e){return e.roll},C=function(e){return e.roll.loading},N=function(e){var t,n=e.roll,r=n.dices,a=n.metadata,i=n.modifiers,o=n.animatedStep;if(o)return o;var l=r.length>0,s=l&&r.some((function(e){return"pending"===e.status})),d=i.filter(u.f),f=d.length>0,p=!f||(null===a||void 0===a||null===(t=a.rerolls)||void 0===t?void 0:t.length)===d.length;return l&&p&&!s?c.d:l&&p?c.b:l&&f?c.c:c.a},X=function(e){var t=e.roll;return{campaign:t.campaign,character:t.character,description:t.description,tn:t.tn,ring:t.ring,skill:t.skill,modifiers:t.modifiers,player:t.player,channeled:t.channeled,addkept:t.addkept}},F=function(e){return e.roll.loading&&!e.roll.animatedStep},L=function(e){return e.roll.toKeep},Y=function(e){return"semiauto"!==e.mode?[]:Object(u.b)(e)};t.f=s.reducer},94:function(e,t,n){"use strict";n.d(t,"k",(function(){return u})),n.d(t,"j",(function(){return l})),n.d(t,"e",(function(){return s})),n.d(t,"d",(function(){return d})),n.d(t,"a",(function(){return g})),n.d(t,"c",(function(){return b})),n.d(t,"h",(function(){return v})),n.d(t,"g",(function(){return y})),n.d(t,"i",(function(){return k})),n.d(t,"f",(function(){return E}));var r=n(44),a=n(37),i=n(10),o=Object(a.b)({name:"heritage",initialState:{dices:[],loading:!1,error:null,metadata:{},context:{},uuid:null},reducers:{setLoading:function(e,t){e.loading=t.payload},setError:function(e,t){e.error=t.payload},update:function(e,t){var n=t.payload,r=n.dices,a=n.metadata;e.dices=r,e.metadata=a,e.loading=!1},reset:function(e){e.dices=[],e.metadata={},e.context={},e.uuid=null,window.history.pushState(null,null,"/heritage")},setContext:function(e,t){e.context=t.payload},setUuid:function(e,t){var n=t.payload;e.uuid=n,window.history.pushState(null,null,"/heritage/".concat(n))},load:function(e,t){var n=t.payload,r=n.uuid,a=n.dices,i=n.metadata,o=n.context;e.uuid=r,e.dices=a,e.metadata=i,e.context=o,window.history.pushState(null,null,"/heritage/".concat(r))}}}),c=o.actions,u=c.setLoading,l=c.setError,s=c.reset,d=c.load,f=o.actions,p=f.update,m=f.setContext,h=f.setUuid,g=function(e){var t=e.context,n=e.metadata,a=e.user,o=e.gm_email;return function(e){e(u(!0)),e(m(Object(r.a)({},t,{user:a})));var c=function(t){e(l(t))};if(a){var s=t.campaign,d=t.character,f=t.description;Object(i.a)({uri:"/ffg/l5r/heritage-rolls/create",body:{campaign:s,character:d,description:f,metadata:n,gm_email:o},success:function(t){var n=t.uuid,r=t.roll;e(h(n)),e(p(r))},error:c})}else Object(i.c)({uri:"/public/ffg/l5r/heritage-rolls/create",body:{metadata:n},success:function(t){e(p(t))},error:c})}},b=function(e){var t=e.roll,n=e.position,r=e.user;return function(e){e(u(!0));var a=function(t){e(l(t))};if(r){var o=t.uuid;Object(i.a)({uri:"/ffg/l5r/heritage-rolls/".concat(o,"/keep"),body:{position:n},success:function(t){var n=t.roll;e(p(n))},error:a})}else Object(i.c)({uri:"/public/ffg/l5r/heritage-rolls/keep",body:{roll:t,position:n},success:function(t){e(p(t))},error:a})}},v=function(e){return e.heritage.loading},y=function(e){return e.heritage.error},k=function(e){return{uuid:e.heritage.uuid,dices:e.heritage.dices,metadata:e.heritage.metadata}},E=function(e){return e.heritage.context};t.b=o.reducer},95:function(e,t,n){"use strict";var r=n(0),a=n.n(r),i=n(131),o=n(86),c=n.n(o);t.a=function(){return a.a.createElement("div",{className:c.a.container},a.a.createElement(i.a,{className:c.a.loader,size:"large"}))}}},[[137,6,7]]]);
//# sourceMappingURL=main.bbb45126.chunk.js.map