import{r as a}from"./index.CVf8TyFT.js";var u={exports:{}},s={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var d=a,m=Symbol.for("react.element"),_=Symbol.for("react.fragment"),c=Object.prototype.hasOwnProperty,w=d.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,y={key:!0,ref:!0,__self:!0,__source:!0};function l(t,r,e){var o,n={},f=null,i=null;e!==void 0&&(f=""+e),r.key!==void 0&&(f=""+r.key),r.ref!==void 0&&(i=r.ref);for(o in r)c.call(r,o)&&!y.hasOwnProperty(o)&&(n[o]=r[o]);if(t&&t.defaultProps)for(o in r=t.defaultProps,r)n[o]===void 0&&(n[o]=r[o]);return{$$typeof:m,type:t,key:f,ref:i,props:n,_owner:w.current}}s.Fragment=_;s.jsx=l;s.jsxs=l;u.exports=s;var v=u.exports;function k(t,r="ok"){const e=window.dglToast;return typeof e!="function"?!1:(e(t,{kind:r}),!0)}const p=()=>typeof window>"u"?{}:window,E=(t,r)=>{const e=p();return e.dglConfirm?e.dglConfirm(t,r):Promise.resolve(!1)},O=(t,r)=>{const e=p();return e.dglPrompt?e.dglPrompt(t,r):Promise.resolve(null)};export{E as a,O as b,v as j,k as t};
