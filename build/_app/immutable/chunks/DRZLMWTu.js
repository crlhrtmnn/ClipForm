import{c,a as u}from"./DArtHkHk.js";import"./E4fo9bj-.js";import{i as l}from"./BjbBlfYJ.js";import{I as p,a as d}from"./LlG9SSuv.js";import{l as f,s as $}from"./DL2-Z6ex.js";function S(e,n){const r=f(n,["children","$$slots","$$events","$$legacy"]);const o=[["path",{d:"m6 9 6 6 6-6"}]];p(e,$({name:"chevron-down"},()=>r,{get iconNode(){return o},children:(t,s)=>{var a=c(),i=l(a);d(i,n,"default",{}),u(t,a)},$$slots:{default:!0}}))}function U(e,n){const r=f(n,["children","$$slots","$$events","$$legacy"]);const o=[["path",{d:"m18 15-6-6-6 6"}]];p(e,$({name:"chevron-up"},()=>r,{get iconNode(){return o},children:(t,s)=>{var a=c(),i=l(a);d(i,n,"default",{}),u(t,a)},$$slots:{default:!0}}))}function m(e){return e.split(`
`).filter(n=>n.trim()!=="").join(`
`)}function v(e){return e.split(`
`).map(n=>n.trim()).join(`
`)}function _(e){return e.toUpperCase()}function h(e){return e.toLowerCase()}function g(e){const n=e.split(`
`),r=new Set,o=[];for(const t of n)r.has(t)||(r.add(t),o.push(t));return o.join(`
`)}function w(e){return e.split(`
`).sort().join(`
`)}function y(e){return e.split(`
`).reverse().join(`
`)}function j(e,n=""){return`\`\`\`${n}
${e}
\`\`\``}function C(e,n){return e.split(`
`).map(r=>`${n}${r}`).join(`
`)}function b(e,n){return e.split(`
`).map(r=>`${r}${n}`).join(`
`)}function L(e,n,r,o){try{const t=new RegExp(n,o);return e.replace(t,r)}catch{throw new Error(`Invalid regex pattern: ${n}`)}}function k(e,n=1){return e.split(`
`).map((o,t)=>`${t+n}. ${o}`).join(`
`)}function E(e,n=2){const r=" ".repeat(n);return e.split(`
`).map(o=>`${r}${o}`).join(`
`)}function N(e,n=2){return e.split(`
`).map(r=>{let o=0,t=0;for(;t<r.length&&r[t]===" "&&o<n;)t++,o++;return r.slice(t)}).join(`
`)}function D(e,n=""){try{return new RegExp(e,n),!0}catch{return!1}}function R(e,n){if(!n.enabled)return e;switch(n.type){case"remove_blank_lines":return m(e);case"trim_lines":return v(e);case"to_uppercase":return _(e);case"to_lowercase":return h(e);case"remove_duplicates":return g(e);case"sort_lines":return w(e);case"reverse_lines":return y(e);case"wrap_code_block":return j(e,n.value||"");case"add_prefix":return C(e,n.value);case"add_suffix":return b(e,n.value);case"regex_replace":{const r=n;return L(e,r.pattern,r.replacement,r.flags)}case"number_lines":return k(e,n.value||1);case"indent":return E(e,n.value||2);case"dedent":return N(e,n.value||2);default:return e}}function q(e,n){const r=[...n].filter(t=>t.enabled).sort((t,s)=>t.order-s.order);let o=e;for(const t of r)try{o=R(o,t)}catch(s){throw console.error(`Error applying transformation ${t.type}:`,s),s}return o}export{U as C,q as a,S as b,D as v};
