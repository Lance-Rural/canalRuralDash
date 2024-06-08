/**
 * @license
 * Copyright (c) 2023 The Nuevodevel Team. All rights reserved.
 * SkipIntro Plugin for Video.js v7
 */
/*eslint no-inner-declarations: "off"*//* eslint-env node */function _interopDefault(e){return e&&"object"===typeof e&&"default"in e?e.default:e}var videojs=_interopDefault(require("video.js"));const defaults={skipStart:0,skipDuration:0,skipTarget:0,skipText:"Skip Intro"};window.skipintro={version:"1.0"};const onPlayerReady=(i,t)=>{var e,r=videojs.mergeOptions||videojs.util.mergeOptions;t=r(defaults,t||{});var s=!1;if(t.skipStart>0&&t.skipDuration>0&&t.skipTarget>0){(e=document.createElement("div")).className="vast-skip-button vjs-hidden";e.innerHTML='<p class="vast-skip-button-text">'+t.skipText+"</p>";e.style.cursor="pointer";i.el().appendChild(e);if(t.skipStart+t.skipDuration>t.skipTarget)t.skipDuration=t.skipTarget-t.skipStart;i.on("timeupdate",function(){if(i.currentTime()>t.skipTarget){s=!0;i.el().removeChild(e)}if(!0!==s){if(i.currentTime()>t.skipStart&&i.currentTime()<t.skipStart+t.skipDuration){videojs.dom.removeClass(e,"vjs-hidden");e.onclick=function(){s=!0;i.currentTime(t.skipTarget);i.el().removeChild(e)}}if(i.currentTime()>t.skipStart+t.skipDuration){s=!0;i.el().removeChild(e)}}})}return this},skipintro=function(i){this.ready(function(){onPlayerReady(this,i)})},registerPlugin=videojs.registerPlugin||videojs.plugin;registerPlugin("skipintro",skipintro);skipintro.VERSION="1.0";module.exports = skipintro;