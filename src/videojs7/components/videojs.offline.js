/**
 * @license
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * SkipIntro Plugin for Video.js v7
 */
/*eslint no-inner-declarations: "off"*/import videojs from"video.js";const defaults={offlineImage:"",offlineTimeout:30,liveSource:"",offlineCountdown:!1,liveStream:"",clock:0,label:"restart",loadTimeout:0,resetMethod:1};function elint(e){return e}try{videojs.options.vhs.maxPlaylistRetries=1}catch(e){elint(e)}try{videojs.options.errorDisplay=!1}catch(e){elint(e)}const onPlayerReady=function(e,t){function i(e){return e.charAt(0).toUpperCase()+e.slice(1)}t.label=i(t.label);var o,n,l=videojs.dom,r=e.el(),f=null,s=null,a=function(e,t){try{return e.querySelector(t)}catch(e){return!1}};if(""!==t.offlineImage){var c=a(r,".vjs-error-display");if(c)l.setAttribute("style","display:none!important");f=document.createElement("div");f.className="vjs-poster";f.setAttribute("style",'top:100%;z-index:15999;opacity:1!important;pointer-events:"none";background-color:#000;');r.appendChild(f);f.style.backgroundImage="url("+t.offlineImage+")";f.style.height=0;if(t.loadTimeout>0)e.one("play",function(){n=setTimeout(function(){e.isOffline=!0;y()},t.loadTimeout)});e.on("error",function(){if(!e.isOffline){var t=e.error();if(1===t.code||2===t.code||4===t.code||3===t.code||-2===t.code){e.isOffline=!0;y()}}});setInterval(function(){if(!e.isOffline){var t=r.className;if(t.indexOf("vjs-has-started")>-1)if(t.indexOf("vjs-ended")>-1){e.isOffline=!0;y()}}},500);e.on("playing",function(){f.style.height=0;f.style.display="none";e.isOffline=!1;if(!0!==videojs.browser.IS_IOS)e.muted(!1);clearTimeout(o);clearTimeout(n);try{r.removeChild(s)}catch(e){}s=null})}function u(){f.setAttribute("style",f.getAttribute("style")+";top:0;height:100%;display:block!important");if(t.offlineCountdown)if(null==s){s=document.createElement("div");s.setAttribute("style","position:absolute;right:30px;bottom:25px;font-size:20px;color:#fff;font-family:sans-serif,Arial;text-shadow:1px 1px 1px #000;z-Index:16000");r.appendChild(s)}}function d(){var i=e.currentSource(),o=e.currentType();if(1===t.resetMethod){e.src({src:i,type:o});var n=e.play();if(void 0!==n)n.then(function(){return!0}).catch(function(t){e.muted(!0);e.play()})}if(2===t.resetMethod){e.src({src:i,type:o});e.load();setTimeout(function(){e.play()},100)}}function p(){u()}function m(e){d()}function y(){var i=a(r,".vjs-loading-spinner");l.addClass(i,"vjs-abs-hidden");t.clock=0;t.liveStream=e.currentSource();p();function n(){clearTimeout(o);o=setTimeout(function(){t.clock++;if(t.offlineCountdown&&s)s.innerHTML=t.label+" "+v(t.offlineTimeout-t.clock);if(t.clock>=t.offlineTimeout){t.clock=0;e.trigger("offlineLoop");m(t.liveStream)}n()},1e3)}if(t.offlineCountdown)if(null!=s)s.innerHTML=t.label+" "+v(t.offlineTimeout);t.clock=0;n()}function v(e){var t=parseInt(e,10),i=Math.floor(t/60)%60,o=t%60,n="";if(i>0)if(i>9)n=i+":";else n="0"+i+":";else n="0:";if(o>0)if(o>9)n+=o;else n+="0"+o;else n="0:00";return n}},offline=function(e){this.ready(function(){onPlayerReady(this,videojs.mergeOptions(defaults,e))})},registerPlugin=videojs.registerPlugin||videojs.plugin;registerPlugin("offline",offline);offline.VERSION="3.0";export default offline;
