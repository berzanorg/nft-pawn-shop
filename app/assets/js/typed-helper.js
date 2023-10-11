import Typed from 'typed.js';
if (typeof window === 'object') {
    Object.assign(window, { Typed });
    {const t=window.Typed,e={string:["stringsElement","fadeOutClass","cursorChar","attr","contentType"],number:["typeSpeed","startDelay","backSpeed","backDelay","loopCount"],boolean:["smartBackspace","shuffle","fadeOut","fadeOutDelay","loop","showCursor","autoInsertCss","bindInputFocusEvents"]},a=a=>{const n=a.cloneNode(!0);if(!(n instanceof Element))return;a.innerHTML="";const s=dataAttrHelpers.parseDataAttr(a.getAttribute("data-typed")||"",e);new t(a,{stringsElement:n,...s})};dataAttrHelpers.watchDataAttr("data-typed",a)}
}