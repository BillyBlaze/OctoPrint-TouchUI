/*! jQuery UI Virtual Keyboard v1.25.23 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof module&&"object"==typeof module.exports?module.exports=a(require("jquery")):a(jQuery)}(function(a){"use strict";var b=a.keyboard=function(c,d){var e,f=this;f.version="1.25.23",f.$el=a(c),f.el=c,f.$el.data("keyboard",f),f.init=function(){var c,g,h,i=b.css,j=b.events;f.settings=d||{},d&&d.position&&(g=a.extend({},d.position),d.position=null),f.options=e=a.extend(!0,{},b.defaultOptions,d),g&&(e.position=g,d.position=g),f.el.active=!0,f.namespace=".keyboard"+Math.random().toString(16).slice(2),f.extensionNamespace=[],f.shiftActive=f.altActive=f.metaActive=f.sets=f.capsLock=!1,f.rows=["","-shift","-alt","-alt-shift"],f.inPlaceholder=f.$el.attr("placeholder")||"",f.watermark=b.watermark&&""!==f.inPlaceholder,f.repeatTime=1e3/(e.repeatRate||20),e.preventDoubleEventTime=e.preventDoubleEventTime||100,f.isOpen=!1,f.wheel=a.isFunction(a.fn.mousewheel),f.escapeRegex=/[-\/\\^$*+?.()|[\]{}]/g,c=b.keyCodes,f.alwaysAllowed=[c.capsLock,c.pageUp,c.pageDown,c.end,c.home,c.left,c.up,c.right,c.down,c.insert,c["delete"]],f.$keyboard=[],f.enabled=!0,a.isEmptyObject(e.position)||(e.position.orig_at=e.position.at),f.checkCaret=e.lockInput||b.checkCaretSupport(),f.last={start:0,end:0,key:"",val:"",preVal:"",layout:"",virtual:!0,keyset:[!1,!1,!1],wheel_$Keys:null,wheelIndex:0,wheelLayers:[]},f.temp=["",0,0],a.each([j.kbInit,j.kbBeforeVisible,j.kbVisible,j.kbHidden,j.inputCanceled,j.inputAccepted,j.kbBeforeClose],function(b,c){a.isFunction(e[c])&&f.$el.bind(c+f.namespace+"callbacks",e[c])}),e.alwaysOpen&&(e.stayOpen=!0),h=a(document),f.el.ownerDocument!==document&&(h=h.add(f.el.ownerDocument)),h.bind("mousedown keyup touchstart checkkeyboard ".split(" ").join(f.namespace+" "),f.checkClose),f.$el.addClass(i.input+" "+e.css.input).attr({"aria-haspopup":"true",role:"textbox"}),(e.lockInput||f.el.readOnly)&&(e.lockInput=!0,f.$el.addClass(i.locked).attr({readonly:"readonly"})),(f.$el.is(":disabled")||f.$el.attr("readonly")&&!f.$el.hasClass(i.locked))&&f.$el.addClass(i.noKeyboard),e.openOn&&f.bindFocus(),f.watermark||""!==f.$el.val()||""===f.inPlaceholder||""===f.$el.attr("placeholder")||f.$el.addClass(i.placeholder).val(f.inPlaceholder),f.$el.trigger(j.kbInit,[f,f.el]),e.alwaysOpen&&f.reveal()},f.toggle=function(){var a=f.$keyboard.find("."+b.css.keyToggle),c=!f.enabled;f.$preview.prop("readonly",c||f.options.lockInput),f.$keyboard.toggleClass(b.css.keyDisabled,c).find("."+b.css.keyButton).not(a).prop("disabled",c).attr("aria-disabled",c),a.toggleClass(b.css.keyDisabled,c),c&&f.typing_options&&(f.typing_options.text="")},f.setCurrent=function(){var c=b.css,d=a("."+c.isCurrent),e=d.data("keyboard");a.isEmptyObject(e)||e.el===f.el||e.close(e.options.autoAccept?"true":!1),d.removeClass(c.isCurrent),a("."+c.hasFocus).removeClass(c.hasFocus),f.$el.addClass(c.isCurrent),f.$keyboard.addClass(c.hasFocus),f.isCurrent(!0),f.isOpen=!0},f.isCurrent=function(a){var c=b.currentKeyboard||!1;return a?c=b.currentKeyboard=f.el:a===!1&&c===f.el&&(c=b.currentKeyboard=""),c===f.el},f.isVisible=function(){return f.$keyboard&&f.$keyboard.length?f.$keyboard.is(":visible"):!1},f.focusOn=function(){(f||!f.el.active)&&(f.isVisible()||(clearTimeout(f.timer),f.reveal()))},f.redraw=function(){f.$keyboard.length&&(f.last.preVal=""+f.last.val,f.last.val=f.$preview&&f.$preview.val()||f.$el.val(),f.$el.val(f.last.val),f.removeKeyboard(),f.shiftActive=f.altActive=f.metaActive=!1),f.isOpen=e.alwaysOpen,f.reveal(!0)},f.reveal=function(c){var d=f.isOpen,g=b.css;return f.opening=!d,a("."+g.keyboard).not("."+g.alwaysOpen).each(function(){var b=a(this).data("keyboard");a.isEmptyObject(b)||b.close(b.options.autoAccept&&b.options.autoAcceptOnEsc?"true":!1)}),f.$el.is(":disabled")||f.$el.attr("readonly")&&!f.$el.hasClass(g.locked)?void f.$el.addClass(g.noKeyboard):(f.$el.removeClass(g.noKeyboard),e.openOn&&f.$el.unbind(a.trim((e.openOn+" ").split(/\s+/).join(f.namespace+" "))),(!f.$keyboard||f.$keyboard&&(!f.$keyboard.length||a.contains(document.body,f.$keyboard[0])))&&f.startup(),f.watermark||f.el.value!==f.inPlaceholder||f.$el.removeClass(g.placeholder).val(""),f.originalContent=f.$el.val(),f.$preview.val(f.originalContent),e.acceptValid&&f.checkValid(),e.resetDefault&&(f.shiftActive=f.altActive=f.metaActive=!1),f.showSet(),f.isVisible()||f.$el.trigger(b.events.kbBeforeVisible,[f,f.el]),f.setCurrent(),f.toggle(),f.$keyboard.show(),e.usePreview&&b.msie&&("undefined"==typeof f.width&&(f.$preview.hide(),f.width=Math.ceil(f.$keyboard.width()),f.$preview.show()),f.$preview.width(f.width)),f.position=a.isEmptyObject(e.position)?!1:e.position,a.ui&&a.ui.position&&f.position&&(f.position.of=f.position.of||f.$el.data("keyboardPosition")||f.$el,f.position.collision=f.position.collision||"flipfit flipfit",e.position.at=e.usePreview?e.position.orig_at:e.position.at2,f.$keyboard.position(f.position)),f.checkDecimal(),f.lineHeight=parseInt(f.$preview.css("lineHeight"),10)||parseInt(f.$preview.css("font-size"),10)+4,e.caretToEnd&&f.saveCaret(f.originalContent.length,f.originalContent.length),b.allie&&(0===f.last.end&&f.last.start>0&&(f.last.end=f.last.start),f.last.start<0&&(f.last.start=f.last.end=f.originalContent.length)),d||c?(b.caret(f.$preview,f.last),f):(f.timer2=setTimeout(function(){var a;f.opening=!1,/(number|email)/i.test(f.el.type)||e.caretToEnd||f.saveCaret(a,a,f.$el),e.initialFocus&&b.caret(f.$preview,f.last),f.last.eventTime=(new Date).getTime(),f.$el.trigger(b.events.kbVisible,[f,f.el]),f.timer=setTimeout(function(){f&&f.saveCaret()},200)},10),f))},f.updateLanguage=function(){var c=b.layouts,d=e.language||c[e.layout]&&c[e.layout].lang&&c[e.layout].lang||[e.language||"en"],g=b.language;d=(a.isArray(d)?d[0]:d).split("-")[0],e.display=a.extend(!0,{},g.en.display,g[d]&&g[d].display||{},f.settings.display),e.combos=a.extend(!0,{},g.en.combos,g[d]&&g[d].combos||{},f.settings.combos),e.wheelMessage=g[d]&&g[d].wheelMessage||g.en.wheelMessage,e.rtl=c[e.layout]&&c[e.layout].rtl||g[d]&&g[d].rtl||!1,f.regex=g[d]&&g[d].comboRegex||b.comboRegex,f.decimal=/^\./.test(e.display.dec),f.$el.toggleClass("rtl",e.rtl).css("direction",e.rtl?"rtl":"")},f.startup=function(){var c=b.css;(e.alwaysOpen||e.userClosed)&&f.$preview||f.makePreview(),f.$keyboard&&f.$keyboard.length||("custom"===e.layout&&(e.layoutHash="custom"+f.customHash()),f.layout="custom"===e.layout?e.layoutHash:e.layout,f.last.layout=f.layout,f.updateLanguage(),"undefined"==typeof b.builtLayouts[f.layout]&&(a.isFunction(e.create)?f.$keyboard=e.create(f):f.$keyboard.length||f.buildKeyboard(f.layout,!0)),f.$keyboard=b.builtLayouts[f.layout].$keyboard.clone(),f.$keyboard.data("keyboard",f),""!==(f.el.id||"")&&f.$keyboard.attr("id",f.el.id+b.css.idSuffix),f.makePreview(),e.usePreview?a.isEmptyObject(e.position)||(e.position.at=e.position.orig_at):a.isEmptyObject(e.position)||(e.position.at=e.position.at2)),f.$decBtn=f.$keyboard.find("."+c.keyPrefix+"dec"),(e.enterNavigation||"TEXTAREA"===f.el.nodeName)&&f.alwaysAllowed.push(13),f.bindKeyboard(),f.$keyboard.appendTo(e.appendLocally?f.$el.parent():e.appendTo||"body"),f.bindKeys(),e.reposition&&a.ui&&a.ui.position&&"body"==e.appendTo&&a(window).bind("resize"+f.namespace,function(){f.position&&f.isVisible()&&f.$keyboard.position(f.position)})},f.makePreview=function(){if(e.usePreview){var c,d,g,h,i=b.css;for(f.$preview=f.$el.clone(!1).data("keyboard",f).removeClass(i.placeholder+" "+i.input).addClass(i.preview+" "+e.css.input).attr("tabindex","-1").show(),f.preview=f.$preview[0],"number"===f.preview.type&&(f.preview.type="text"),h=/^(data-|id|aria-haspopup)/i,d=f.$preview.get(0).attributes,c=d.length-1;c>=0;c--)g=d[c]&&d[c].name,h.test(g)&&f.preview.removeAttribute(g);a("<div />").addClass(i.wrapper).append(f.$preview).prependTo(f.$keyboard)}else f.$preview=f.$el,f.preview=f.el},f.saveCaret=function(a,c,d){var e=b.caret(d||f.$preview,a,c);f.last.start="undefined"==typeof a?e.start:a,f.last.end="undefined"==typeof c?e.end:c},f.setScroll=function(){if(f.last.virtual){var a,c,d,g,h="TEXTAREA"===f.preview.nodeName,i=f.last.val.substring(0,Math.max(f.last.start,f.last.end));f.$previewCopy||(f.$previewCopy=f.$preview.clone().removeAttr("id").css({position:"absolute",left:0,zIndex:-10,visibility:"hidden"}).addClass(b.css.inputClone),h||f.$previewCopy.css({"white-space":"pre",width:0}),e.usePreview?f.$preview.after(f.$previewCopy):f.$keyboard.prepend(f.$previewCopy)),h?(f.$previewCopy.height(f.lineHeight).val(i),f.preview.scrollTop=f.lineHeight*(Math.floor(f.$previewCopy[0].scrollHeight/f.lineHeight)-1)):(f.$previewCopy.val(i.replace(/\s/g," ")),d=/c/i.test(e.scrollAdjustment)?f.preview.clientWidth/2:e.scrollAdjustment,a=f.$previewCopy[0].scrollWidth-1,"undefined"==typeof f.last.scrollWidth&&(f.last.scrollWidth=a,f.last.direction=!0),g=f.last.scrollWidth===a?f.last.direction:f.last.scrollWidth<a,c=f.preview.clientWidth-d,g?c>a?f.preview.scrollLeft=0:f.preview.scrollLeft=a-c:a>=f.preview.scrollWidth-c?f.preview.scrollLeft=f.preview.scrollWidth-d:a-d>0?f.preview.scrollLeft=a-d:f.preview.scrollLeft=0,f.last.scrollWidth=a,f.last.direction=g)}},f.bindFocus=function(){e.openOn&&f&&f.el.active&&(f.$el.bind(e.openOn+f.namespace,function(){f.focusOn()}),a(":focus")[0]===f.el&&f.$el.blur())},f.bindKeyboard=function(){var c,d=b.keyCodes,g=b.builtLayouts[f.layout];f.$preview.unbind(f.namespace).bind("click"+f.namespace+" touchstart"+f.namespace,function(){f.timer2=setTimeout(function(){f&&f.saveCaret()},150)}).bind("keypress"+f.namespace,function(h){if(e.lockInput)return!1;var i=h.charCode||h.which,j=i>=d.A&&i<=d.Z,k=i>=d.a&&i<=d.z,l=f.last.key=String.fromCharCode(i);if(f.last.virtual=!1,f.last.event=h,f.last.$key=[],f.checkCaret&&f.saveCaret(),i!==d.capsLock&&(j||k)&&(f.capsLock=j&&!h.shiftKey||k&&h.shiftKey,f.capsLock&&!f.shiftActive&&(f.shiftActive=!0,f.showSet())),e.restrictInput){if((h.which===d.backSpace||0===h.which)&&a.inArray(h.keyCode,f.alwaysAllowed))return;-1===a.inArray(l,g.acceptedKeys)&&(h.preventDefault(),c=a.extend({},h),c.type=b.events.inputRestricted,f.$el.trigger(c,[f,f.el]),a.isFunction(e.restricted)&&e.restricted(c,f,f.el))}else if((h.ctrlKey||h.metaKey)&&(h.which===d.A||h.which===d.C||h.which===d.V||h.which>=d.X&&h.which<=d.Z))return;g.hasMappedKeys&&g.mappedKeys.hasOwnProperty(l)&&(f.last.key=g.mappedKeys[l],f.insertText(f.last.key),h.preventDefault()),f.checkMaxLength()}).bind("keyup"+f.namespace,function(c){switch(f.last.virtual=!1,c.which){case d.tab:if(f.tab&&e.tabNavigation&&!e.lockInput){f.shiftActive=c.shiftKey;var g=b.keyaction.tab(f);if(f.tab=!1,!g)return!1}else c.preventDefault();break;case d.escape:return e.ignoreEsc||f.close(e.autoAccept&&e.autoAcceptOnEsc?"true":!1),!1}return clearTimeout(f.throttled),f.throttled=setTimeout(function(){f&&f.isVisible()&&f.checkCombos()},100),f.checkMaxLength(),f.last.preVal=""+f.last.val,f.last.val=f.$preview.val(),c.type=b.events.kbChange,c.action=f.last.key,f.$el.trigger(c,[f,f.el]),a.isFunction(e.change)?(c.type=b.events.inputChange,e.change(c,f,f.el),!1):void 0}).bind("keydown"+f.namespace,function(a){if(e.alwaysOpen&&!f.isCurrent()&&f.reveal(),a.which===d.tab)return f.tab=!0,!1;if(e.lockInput)return!1;switch(f.last.virtual=!1,a.which){case d.backSpace:b.keyaction.bksp(f,null,a),a.preventDefault();break;case d.enter:b.keyaction.enter(f,null,a);break;case d.capsLock:f.shiftActive=f.capsLock=!f.capsLock,f.showSet();break;case d.V:if(a.ctrlKey||a.metaKey){if(e.preventPaste)return void a.preventDefault();f.checkCombos()}}}).bind("mouseup touchend ".split(" ").join(f.namespace+" "),function(){f.last.virtual=!0,f.saveCaret()}),f.$keyboard.bind("mousedown click touchstart ".split(" ").join(f.namespace+" "),function(b){b.stopPropagation(),f.isCurrent()||(f.reveal(),a(document).trigger("checkkeyboard"+f.namespace)),e.noFocus||f.$preview.focus()}),e.preventPaste&&(f.$preview.bind("contextmenu"+f.namespace,function(a){a.preventDefault()}),f.$el.bind("contextmenu"+f.namespace,function(a){a.preventDefault()}))},f.bindKeys=function(){var c=b.css;f.$allKeys=f.$keyboard.find("button."+c.keyButton).unbind(f.namespace+" "+f.namespace+"kb").bind("mouseenter mouseleave touchstart ".split(" ").join(f.namespace+" "),function(c){if(!e.alwaysOpen&&!e.userClosed||"mouseleave"===c.type||f.isCurrent()||(f.reveal(),f.$preview.focus(),b.caret(f.$preview,f.last)),f.isCurrent()){var d,g,h=f.last,i=a(this),j=c.type;e.useWheel&&f.wheel&&(d=f.getLayers(i),g=(d.length?d.map(function(){return a(this).attr("data-value")||""}).get():"")||[i.text()],h.wheel_$Keys=d,h.wheelLayers=g,h.wheelIndex=a.inArray(i.attr("data-value"),g)),"mouseenter"!==j&&"touchstart"!==j||"password"===f.el.type||i.hasClass(e.css.buttonDisabled)||(i.addClass(e.css.buttonHover),e.useWheel&&f.wheel&&i.attr("title",function(a,b){return f.wheel&&""===b&&f.sets&&g.length>1&&"touchstart"!==j?e.wheelMessage:b})),"mouseleave"===j&&(i.removeClass("password"===f.el.type?"":e.css.buttonHover),e.useWheel&&f.wheel&&(h.wheelIndex=0,h.wheelLayers=[],h.wheel_$Keys=null,i.attr("title",function(a,b){return b===e.wheelMessage?"":b}).html(i.attr("data-html"))))}}).bind(e.keyBinding.split(" ").join(f.namespace+" ")+f.namespace+" "+b.events.kbRepeater,function(d){if(d.preventDefault(),!f.$keyboard.is(":visible"))return!1;var g,h,i=f.last,j=this,k=a(j),l=(new Date).getTime();if(e.useWheel&&f.wheel&&(h=i.wheel_$Keys,k=h&&i.wheelIndex>-1?h.eq(i.wheelIndex):k),g=k.attr("data-action"),!(l-(i.eventTime||0)<e.preventDoubleEventTime)){if(i.eventTime=l,i.event=d,i.virtual=!0,e.noFocus||f.$preview.focus(),i.$key=k,i.key=k.attr("data-value"),f.checkCaret&&b.caret(f.$preview,i),g.match("meta")&&(g="meta"),g===i.key&&"string"==typeof b.keyaction[g])i.key=g=b.keyaction[g];else if(g in b.keyaction&&a.isFunction(b.keyaction[g])){if(b.keyaction[g](f,this,d)===!1)return!1;g=null}return"undefined"!=typeof g&&null!==g&&(i.key=a(this).hasClass(c.keyAction)?g:i.key,f.insertText(i.key),f.capsLock&&(e.stickyShift||d.shiftKey)||(f.shiftActive=!1,f.showSet(k.attr("data-name")))),b.caret(f.$preview,i),f.checkCombos(),d.type=b.events.kbChange,d.action=i.key,f.$el.trigger(d,[f,f.el]),i.preVal=""+i.val,i.val=f.$preview.val(),a.isFunction(e.change)?(d.type=b.events.inputChange,e.change(d,f,f.el),!1):void 0}}).bind("mouseup"+f.namespace+" "+"mouseleave touchend touchmove touchcancel ".split(" ").join(f.namespace+"kb "),function(c){f.last.virtual=!0;var d,g=a(this);if("touchmove"===c.type){if(d=g.offset(),d.right=d.left+g.outerWidth(),d.bottom=d.top+g.outerHeight(),c.originalEvent.touches[0].pageX>=d.left&&c.originalEvent.touches[0].pageX<d.right&&c.originalEvent.touches[0].pageY>=d.top&&c.originalEvent.touches[0].pageY<d.bottom)return!0}else/(mouseleave|touchend|touchcancel)/i.test(c.type)?g.removeClass(e.css.buttonHover):(!e.noFocus&&f.isVisible()&&f.isCurrent()&&f.$preview.focus(),f.checkCaret&&b.caret(f.$preview,f.last));return f.mouseRepeat=[!1,""],clearTimeout(f.repeater),!1}).bind("click"+f.namespace,function(){return!1}).not("."+c.keyAction).bind("mousewheel"+f.namespace,function(b,c){if(e.useWheel&&f.wheel){c=c||b.deltaY;var d,g=f.last.wheelLayers||[];return g.length>1?(d=f.last.wheelIndex+(c>0?-1:1),d>g.length-1&&(d=0),0>d&&(d=g.length-1)):d=0,f.last.wheelIndex=d,a(this).html(g[d]),!1}}).add("."+c.keyPrefix+"tab bksp space enter".split(" ").join(",."+c.keyPrefix),f.$keyboard).bind("mousedown touchstart ".split(" ").join(f.namespace+"kb "),function(){if(0!==e.repeatRate){var b=a(this);f.mouseRepeat=[!0,b],setTimeout(function(){f&&f.mouseRepeat[0]&&f.mouseRepeat[1]===b&&!b[0].disabled&&f.repeatKey(b)},e.repeatDelay)}return!1})},f.insertText=function(a){if("undefined"!=typeof a){var c,d,e="\b"===a,g=f.$preview.val(),h=b.caret(f.$preview),i=g.length;h.end<h.start&&(h.end=h.start),h.start>i&&(h.end=h.start=i),"TEXTAREA"===f.preview.nodeName&&b.msie&&"\n"===g.substr(h.start,1)&&(h.start+=1,h.end+=1),"{d}"===a&&(a="",d=h.start,h.end+=1),c=e&&h.start===h.end,a=e?"":a,g=g.substr(0,h.start-(c?1:0))+a+g.substr(h.end),d=h.start+(c?-1:a.length),f.$preview.val(g),f.saveCaret(d,d),f.setScroll()}},f.checkMaxLength=function(){var a,c,d=f.$preview.val();e.maxLength!==!1&&d.length>e.maxLength&&(a=b.caret(f.$preview).start,c=Math.min(a,e.maxLength),e.maxInsert||(d=f.last.val,c=a-1),f.$preview.val(d.substring(0,e.maxLength)),f.saveCaret(c,c)),f.$decBtn.length&&f.checkDecimal()},f.repeatKey=function(a){a.trigger(b.events.kbRepeater),f.mouseRepeat[0]&&(f.repeater=setTimeout(function(){f&&f.repeatKey(a)},f.repeatTime))},f.showKeySet=function(a){"string"==typeof a?(f.last.keyset=[f.shiftActive,f.altActive,f.metaActive],f.shiftActive=/shift/i.test(a),f.altActive=/alt/i.test(a),/meta/.test(a)?(f.metaActive=!0,f.showSet(a.match(/meta\d+/i)[0])):(f.metaActive=!1,f.showSet())):f.showSet(a)},f.showSet=function(a){e=f.options;var c=b.css,d="."+c.keyPrefix,g=e.css.buttonActive,h="",i=(f.shiftActive?1:0)+(f.altActive?2:0);return f.shiftActive||(f.capsLock=!1),f.metaActive?(h=/meta/i.test(a)?a:"",""===h?h=f.metaActive===!0?"":f.metaActive:f.metaActive=h,(!e.stickyShift&&f.last.keyset[2]!==f.metaActive||(f.shiftActive||f.altActive)&&!f.$keyboard.find("."+c.keySet+"-"+h+f.rows[i]).length)&&(f.shiftActive=f.altActive=!1)):!e.stickyShift&&f.last.keyset[2]!==f.metaActive&&f.shiftActive&&(f.shiftActive=f.altActive=!1),i=(f.shiftActive?1:0)+(f.altActive?2:0),h=0!==i||f.metaActive?""===h?"":"-"+h:"-normal",f.$keyboard.find("."+c.keySet+h+f.rows[i]).length?(f.$keyboard.find(d+"alt,"+d+"shift,."+c.keyAction+"[class*=meta]").removeClass(g).end().find(d+"alt").toggleClass(g,f.altActive).end().find(d+"shift").toggleClass(g,f.shiftActive).end().find(d+"lock").toggleClass(g,f.capsLock).end().find("."+c.keySet).hide().end().find("."+c.keyAction+d+h).addClass(g),f.$keyboard.find("."+c.keySet+h+f.rows[i])[0].style.display="inline-block",f.metaActive&&f.$keyboard.find(d+f.metaActive).toggleClass(g,f.metaActive!==!1),f.last.keyset=[f.shiftActive,f.altActive,f.metaActive],void f.$el.trigger(b.events.kbKeysetChange,[f,f.el])):(f.shiftActive=f.last.keyset[0],f.altActive=f.last.keyset[1],void(f.metaActive=f.last.keyset[2]))},f.checkCombos=function(){if(!f.isVisible()&&!f.$keyboard.hasClass(b.css.hasFocus))return f.$preview.val();var c,d,g,h=f.$preview.val(),i=b.caret(f.$preview),j=b.builtLayouts[f.layout],k=h.length;return""===h?(e.acceptValid&&f.checkValid(),h):(i.end<i.start&&(i.end=i.start),i.start>k&&(i.end=i.start=k),b.msie&&"\n"===h.substr(i.start,1)&&(i.start+=1,i.end+=1),e.useCombos&&(b.msie?h=h.replace(f.regex,function(a,b,c){return e.combos.hasOwnProperty(b)?e.combos[b][c]||a:a}):f.$preview.length&&(d=i.start-(i.start-2>=0?2:0),b.caret(f.$preview,d,i.end),g=(b.caret(f.$preview).text||"").replace(f.regex,function(a,b,c){return e.combos.hasOwnProperty(b)?e.combos[b][c]||a:a}),f.$preview.val(b.caret(f.$preview).replaceStr(g)),h=f.$preview.val())),e.restrictInput&&""!==h&&(d=j.acceptedKeys.length,c=j.acceptedKeysRegex,c||(g=a.map(j.acceptedKeys,function(a){return a.replace(f.escapeRegex,"\\$&")}),c=j.acceptedKeysRegex=new RegExp("("+g.join("|")+")","g")),g=h.match(c),g?h=g.join(""):(h="",k=0)),i.start+=h.length-k,i.end+=h.length-k,f.$preview.val(h),f.saveCaret(i.start,i.end),f.setScroll(),f.checkMaxLength(),e.acceptValid&&f.checkValid(),h)},f.checkValid=function(){var c=b.css,d=f.$keyboard.find("."+c.keyPrefix+"accept"),g=!0;a.isFunction(e.validate)&&(g=e.validate(f,f.$preview.val(),!1)),d.toggleClass(c.inputInvalid,!g).toggleClass(c.inputValid,g).attr("title",d.attr("data-title")+" ("+e.display[g?"valid":"invalid"]+")")},f.checkDecimal=function(){f.decimal&&/\./g.test(f.preview.value)||!f.decimal&&/\,/g.test(f.preview.value)?f.$decBtn.attr({disabled:"disabled","aria-disabled":"true"}).removeClass(e.css.buttonHover).addClass(e.css.buttonDisabled):f.$decBtn.removeAttr("disabled").attr({"aria-disabled":"false"}).addClass(e.css.buttonDefault).removeClass(e.css.buttonDisabled)},f.getLayers=function(c){var d=b.css,e=c.attr("data-pos"),f=c.closest("."+d.keyboard).find('button[data-pos="'+e+'"]');return f.filter(function(){return""!==a(this).find("."+d.keyText).text()}).add(c)},f.switchInput=function(b,c){if(a.isFunction(e.switchInput))e.switchInput(f,b,c);else{f.$keyboard.length&&f.$keyboard.hide();var d,g=!1,h=a("button, input, textarea, a").filter(":visible").not(":disabled"),i=h.index(f.$el)+(b?1:-1);if(f.$keyboard.length&&f.$keyboard.show(),i>h.length-1&&(g=e.stopAtEnd,i=0),0>i&&(g=e.stopAtEnd,i=h.length-1),!g){if(c=f.close(c),!c)return;d=h.eq(i).data("keyboard"),d&&d.options.openOn.length?d.focusOn():h.eq(i).focus()}}return!1},f.close=function(c){if(f.isOpen&&f.$keyboard.length){clearTimeout(f.throttled);var d=b.css,g=b.events,h=c?f.checkCombos():f.originalContent;if(c&&a.isFunction(e.validate)&&!e.validate(f,h,!0)&&(h=f.originalContent,c=!1,e.cancelClose))return;f.isCurrent(!1),f.isOpen=e.alwaysOpen||e.userClosed,f.$preview.val(h),f.$el.removeClass(d.isCurrent+" "+d.inputAutoAccepted).addClass(c?c===!0?"":d.inputAutoAccepted:"").val(h).trigger(g.inputChange).trigger(e.alwaysOpen?"":g.kbBeforeClose,[f,f.el,c||!1]).trigger(c?g.inputAccepted:g.inputCanceled,[f,f.el]).trigger(e.alwaysOpen?g.kbInactive:g.kbHidden,[f,f.el]).blur(),b.caret(f.$preview,f.last),f&&(f.last.eventTime=(new Date).getTime(),e.alwaysOpen||e.userClosed&&"true"===c||!f.$keyboard.length||(f.removeKeyboard(),f.timer=setTimeout(function(){f&&f.bindFocus()},500)),f.watermark||""!==f.el.value||""===f.inPlaceholder||f.$el.addClass(d.placeholder).val(f.inPlaceholder))}return!!c},f.accept=function(){return f.close(!0)},f.checkClose=function(b){if(!f.opening){f.escClose(b);var c=a.keyboard.css,d=a(b.target);if(d.hasClass(c.input)){var e=d.data("keyboard");e!==f||e.$el.hasClass(c.isCurrent)||b.type!==e.options.openOn||e.focusOn()}}},f.escClose=function(c){if(c&&"keyup"===c.type)return c.which!==b.keyCodes.escape||e.ignoreEsc?"":f.close(e.autoAccept&&e.autoAcceptOnEsc?"true":!1);if(f.isOpen&&(!f.isCurrent()&&f.isOpen||f.isOpen&&c.target!==f.el)){if((e.stayOpen||e.userClosed)&&!a(c.target).hasClass(b.css.input))return;b.allie&&c.preventDefault(),f.close(e.autoAccept?"true":!1)}},f.keyBtn=a("<button />").attr({role:"button",type:"button","aria-disabled":"false",tabindex:"-1"}).addClass(b.css.keyButton),f.processName=function(a){var b,c,d=(a||"").replace(/[^a-z0-9-_]/gi,""),e=d.length,f=[];if(e>1&&a===d)return a;if(e=a.length){for(b=0;e>b;b++)c=a[b],f.push(/[a-z0-9-_]/i.test(c)?/[-_]/.test(c)&&0!==b?"":c:(0===b?"":"-")+c.charCodeAt(0));return f.join("")}return a},f.processKeys=function(b){var c,d=b.split(":"),e={name:null,map:"",title:""};return/\(.+\)/.test(d[0])||/^:\(.+\)/.test(b)||/\([(:)]\)/.test(b)?/\([(:)]\)/.test(b)?(c=d[0].match(/([^(]+)\((.+)\)/),c&&c.length?(e.name=c[1],e.map=c[2],e.title=d.length>1?d.slice(1).join(":"):""):(e.name=b.match(/([^(]+)/)[0],":"===e.name&&(d=d.slice(1)),null===c&&(e.map=":",d=d.slice(2)),e.title=d.length?d.join(":"):"")):(e.map=b.match(/\(([^()]+?)\)/)[1],b=b.replace(/\(([^()]+)\)/,""),c=b.split(":"),""===c[0]?(e.name=":",d=d.slice(1)):e.name=c[0],e.title=d.length>1?d.slice(1).join(":"):""):(""===d[0]?(e.name=":",d=d.slice(1)):e.name=d[0],e.title=d.length>1?d.slice(1).join(":"):""),e.title=a.trim(e.title).replace(/_/g," "),e},f.addKey=function(a,c,d){var g,h,i,j={},k=f.processKeys(d?a:c),l=b.css;return!d&&e.display[k.name]?(i=f.processKeys(e.display[k.name]),i.action=f.processKeys(a).name):(i=k,i.action=k.name),j.name=f.processName(k.name),""!==i.map?(b.builtLayouts[f.layout].mappedKeys[i.map]=i.name,b.builtLayouts[f.layout].acceptedKeys.push(i.name)):d&&b.builtLayouts[f.layout].acceptedKeys.push(i.name),g=d?""===j.name?"":l.keyPrefix+j.name:l.keyAction+" "+l.keyPrefix+i.action,g+=(i.name.length>2?" "+l.keyWide:"")+" "+e.css.buttonDefault,j.html='<span class="'+l.keyText+'">'+i.name.replace(/[\u00A0-\u9999]/gim,function(a){return"&#"+a.charCodeAt(0)+";"})+"</span>",j.$key=f.keyBtn.clone().attr({"data-value":d?i.name:i.action,"data-name":i.action,"data-pos":f.temp[1]+","+f.temp[2],"data-action":i.action,"data-html":j.html}).addClass(g).html(j.html).appendTo(f.temp[0]),i.map&&j.$key.attr("data-mapped",i.map),(i.title||k.title)&&j.$key.attr({"data-title":k.title||i.title,title:k.title||i.title}),"function"==typeof e.buildKey&&(j=e.buildKey(f,j),h=j.$key.html(),j.$key.attr("data-html",h)),j.$key},f.customHash=function(a){var b,c,d,f,g,h=[],i=[];a="undefined"==typeof a?e.customLayout:a;for(c in a)a.hasOwnProperty(c)&&h.push(a[c]);if(i=i.concat.apply(i,h).join(" "),d=0,g=i.length,0===g)return d;for(b=0;g>b;b++)f=i.charCodeAt(b),d=(d<<5)-d+f,d&=d;return d},f.buildKeyboard=function(c,d){a.isEmptyObject(e.display)&&f.updateLanguage();var g,h,i,j=b.css,k=0,l=b.builtLayouts[c||f.layout||e.layout]={mappedKeys:{},acceptedKeys:[]},m=l.acceptedKeys=e.restrictInclude?(""+e.restrictInclude).split(/\s+/)||[]:[],n=j.keyboard+" "+e.css.popup+" "+e.css.container+(e.alwaysOpen||e.userClosed?" "+j.alwaysOpen:""),o=a("<div />").addClass(n).attr({role:"textbox"}).hide();return d&&"custom"===e.layout||!b.layouts.hasOwnProperty(e.layout)?(e.layout="custom",n=b.layouts.custom=e.customLayout||{normal:["{cancel}"]}):n=b.layouts[d?e.layout:c||f.layout||e.layout],a.each(n,function(b,c){if(""!==b&&!/^(name|lang|rtl)$/i.test(b))for("default"===b&&(b="normal"),k++,h=a("<div />").attr("name",b).addClass(j.keySet+" "+j.keySet+"-"+b).appendTo(o).toggle("normal"===b),g=0;g<c.length;g++)i=a.trim(c[g]).replace(/\{(\.?)[\s+]?:[\s+]?(\.?)\}/g,"{$1:$2}"),f.buildRow(h,g,i.split(/\s+/),m),h.find("."+j.keyButton+",."+j.keySpacer).filter(":last").after('<br class="'+j.endRow+'"/>')}),k>1&&(f.sets=!0),l.hasMappedKeys=!a.isEmptyObject(l.mappedKeys),l.$keyboard=o,o},f.buildRow=function(c,d,g,h){var i,j,k,l,m,n,o=b.css;for(k=0;k<g.length;k++)if(f.temp=[c,d,k],l=!1,0!==g[k].length)if(/^\{\S+\}$/.test(g[k])){if(m=g[k].match(/^\{(\S+)\}$/)[1],/\!\!/.test(m)&&(m=m.replace("!!",""),l=!0),/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/i.test(m)&&(n=parseFloat(m.replace(/,/,".").match(/^sp:((\d+)?([\.|,]\d+)?)(em|px)?$/i)[1]||0),a('<span class="'+o.keyText+'"></span>').width(m.match(/px/i)?n+"px":2*n+"em").addClass(o.keySpacer).appendTo(c)),/^empty(:((\d+)?([\.|,]\d+)?)(em|px)?)?$/i.test(m)&&(n=/:/.test(m)?parseFloat(m.replace(/,/,".").match(/^empty:((\d+)?([\.|,]\d+)?)(em|px)?$/i)[1]||0):"",f.addKey(""," ").addClass(e.css.buttonDisabled+" "+e.css.buttonEmpty).attr("aria-disabled",!0).width(n?m.match("px")?n+"px":2*n+"em":"")),/^meta\d+\:?(\w+)?/i.test(m)){f.addKey(m.split(":")[0],m).addClass(o.keyHasActive);continue}switch(j=m.split(":"),j[0].toLowerCase()){case"a":case"accept":f.addKey("accept",m).addClass(e.css.buttonAction+" "+o.keyAction);break;case"alt":case"altgr":f.addKey("alt",m).addClass(o.keyHasActive);break;case"b":case"bksp":f.addKey("bksp",m);break;case"c":case"cancel":f.addKey("cancel",m).addClass(e.css.buttonAction+" "+o.keyAction);break;case"combo":f.addKey("combo",m).addClass(o.keyHasActive).attr("title",function(a,b){return b+" "+e.display[e.useCombos?"active":"disabled"]}).toggleClass(e.css.buttonActive,e.useCombos);break;case"dec":h.push(f.decimal?".":","),f.addKey("dec",m);break;case"e":case"enter":f.addKey("enter",m).addClass(e.css.buttonAction+" "+o.keyAction);break;case"lock":f.addKey("lock",m).addClass(o.keyHasActive);break;case"s":case"shift":f.addKey("shift",m).addClass(o.keyHasActive);break;case"sign":h.push("-"),f.addKey("sign",m);break;case"space":h.push(" "),f.addKey("space",m);break;case"t":case"tab":f.addKey("tab",m);break;default:b.keyaction.hasOwnProperty(j[0])&&f.addKey(j[0],m).toggleClass(e.css.buttonAction+" "+o.keyAction,l)}}else i=g[k],f.addKey(i,i,!0)},f.removeBindings=function(b){a(document).unbind(b),f.el.ownerDocument!==document&&a(f.el.ownerDocument).unbind(b),a(window).unbind(b),f.$el.unbind(b)},f.removeKeyboard=function(){f.$allKeys=null,f.$decBtn=null,f.preview=null,f.$preview.removeData("keyboard"),f.$preview=null,f.$previewCopy=null,f.$keyboard.removeData("keyboard"),f.$keyboard.remove(),f.$keyboard=[],f.isOpen=!1,f.isCurrent(!1)},f.destroy=function(a){var c,d=b.css,g=f.extensionNamespace.length,h=[d.input,d.locked,d.placeholder,d.noKeyboard,d.alwaysOpen,e.css.input,d.isCurrent].join(" ");for(clearTimeout(f.timer),clearTimeout(f.timer2),f.$keyboard.length&&f.removeKeyboard(),f.removeBindings(f.namespace),f.removeBindings(f.namespace+"callbacks"),c=0;g>c;c++)f.removeBindings(f.extensionNamespace[c]);f.el.active=!1,f.$el.removeClass(h).removeAttr("aria-haspopup").removeAttr("role").removeData("keyboard"),f=null,"function"==typeof a&&a()},f.init()};return b.keyCodes={backSpace:8,tab:9,enter:13,capsLock:20,escape:27,space:32,pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,"delete":46,A:65,Z:90,V:86,C:67,X:88,a:97,z:122},b.css={idSuffix:"_keyboard",input:"ui-keyboard-input",inputClone:"ui-keyboard-preview-clone",wrapper:"ui-keyboard-preview-wrapper",preview:"ui-keyboard-preview",keyboard:"ui-keyboard",keySet:"ui-keyboard-keyset",keyButton:"ui-keyboard-button",keyWide:"ui-keyboard-widekey",keyPrefix:"ui-keyboard-",keyText:"ui-keyboard-text",keyHasActive:"ui-keyboard-hasactivestate",keyAction:"ui-keyboard-actionkey",keySpacer:"ui-keyboard-spacer",keyToggle:"ui-keyboard-toggle",keyDisabled:"ui-keyboard-disabled",locked:"ui-keyboard-lockedinput",alwaysOpen:"ui-keyboard-always-open",noKeyboard:"ui-keyboard-nokeyboard",placeholder:"ui-keyboard-placeholder",hasFocus:"ui-keyboard-has-focus",isCurrent:"ui-keyboard-input-current",inputValid:"ui-keyboard-valid-input",inputInvalid:"ui-keyboard-invalid-input",inputAutoAccepted:"ui-keyboard-autoaccepted",endRow:"ui-keyboard-button-endrow"},b.events={kbChange:"keyboardChange",kbBeforeClose:"beforeClose",kbBeforeVisible:"beforeVisible",kbVisible:"visible",kbInit:"initialized",kbInactive:"inactive",kbHidden:"hidden",kbRepeater:"repeater",kbKeysetChange:"keysetChange",inputAccepted:"accepted",inputCanceled:"canceled",inputChange:"change",inputRestricted:"restricted"},b.keyaction={accept:function(a){return a.close(!0),!1},alt:function(a){a.altActive=!a.altActive,a.showSet()},bksp:function(a){a.insertText("\b")},cancel:function(a){return a.close(),!1},clear:function(a){a.$preview.val(""),a.$decBtn.length&&a.checkDecimal()},combo:function(a){var c=a.options,d=!c.useCombos,e=a.$keyboard.find("."+b.css.keyPrefix+"combo");return c.useCombos=d,e.toggleClass(c.css.buttonActive,d).attr("title",e.attr("data-title")+" ("+c.display[d?"active":"disabled"]+")"),d&&a.checkCombos(),!1},dec:function(a){a.insertText(a.decimal?".":",")},del:function(a){a.insertText("{d}")},"default":function(a){a.shiftActive=a.altActive=a.metaActive=!1,a.showSet()},enter:function(c,d,e){var f=c.el.nodeName,g=c.options;return e.shiftKey?g.enterNavigation?c.switchInput(!e[g.enterMod],!0):c.close(!0):g.enterNavigation&&("TEXTAREA"!==f||e[g.enterMod])?c.switchInput(!e[g.enterMod],g.autoAccept?"true":!1):void("TEXTAREA"===f&&a(e.target).closest("button").length&&c.insertText((b.msie?" ":"")+"\n"))},lock:function(a){a.last.keyset[0]=a.shiftActive=a.capsLock=!a.capsLock,a.showSet()},left:function(a){var c=b.caret(a.$preview);c.start-1>=0&&(a.last.start=a.last.end=c.start-1,b.caret(a.$preview,a.last),a.setScroll())},meta:function(b,c){var d=a(c);b.metaActive=!d.hasClass(b.options.css.buttonActive),b.showSet(d.attr("data-name"))},next:function(a){return a.switchInput(!0,a.options.autoAccept),!1},normal:function(a){a.shiftActive=a.altActive=a.metaActive=!1,a.showSet()},prev:function(a){return a.switchInput(!1,a.options.autoAccept),!1},right:function(a){var c=b.caret(a.$preview);c.start+1<=a.$preview.val().length&&(a.last.start=a.last.end=c.start+1,b.caret(a.$preview,a.last),a.setScroll())},shift:function(a){a.last.keyset[0]=a.shiftActive=!a.shiftActive,a.showSet()},sign:function(a){/^\-?\d*\.?\d*$/.test(a.$preview.val())&&a.$preview.val(-1*a.$preview.val())},space:function(a){a.insertText(" ")},tab:function(a){var b=a.el.nodeName,c=a.options;return"INPUT"===b?c.tabNavigation?a.switchInput(!a.shiftActive,!0):!1:void a.insertText("	")},toggle:function(a){a.enabled=!a.enabled,a.toggle()},NBSP:" ",ZWSP:"​",ZWNJ:"‌",
ZWJ:"‍",LRM:"‎",RLM:"‏"},b.builtLayouts={},b.layouts={alpha:{normal:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} a b c d e f g h i j [ ] \\","k l m n o p q r s ; ' {enter}","{shift} t u v w x y z , . / {shift}","{accept} {space} {cancel}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} A B C D E F G H I J { } |",'K L M N O P Q R S : " {enter}',"{shift} T U V W X Y Z < > ? {shift}","{accept} {space} {cancel}"]},qwerty:{normal:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} q w e r t y u i o p [ ] \\","a s d f g h j k l ; ' {enter}","{shift} z x c v b n m , . / {shift}","{accept} {space} {cancel}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Q W E R T Y U I O P { } |",'A S D F G H J K L : " {enter}',"{shift} Z X C V B N M < > ? {shift}","{accept} {space} {cancel}"]},international:{normal:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} q w e r t y u i o p [ ] \\","a s d f g h j k l ; ' {enter}","{shift} z x c v b n m , . / {shift}","{accept} {alt} {space} {alt} {cancel}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Q W E R T Y U I O P { } |",'A S D F G H J K L : " {enter}',"{shift} Z X C V B N M < > ? {shift}","{accept} {alt} {space} {alt} {cancel}"],alt:["~ ¡ ² ³ ¤ € ¼ ½ ¾ ‘ ’ ¥ × {bksp}","{tab} ä å é ® þ ü ú í ó ö « » ¬","á ß ð f g h j k ø ¶ ´ {enter}","{shift} æ x © v b ñ µ ç > ¿ {shift}","{accept} {alt} {space} {alt} {cancel}"],"alt-shift":["~ ¹ ² ³ £ € ¼ ½ ¾ ‘ ’ ¥ ÷ {bksp}","{tab} Ä Å É ® Þ Ü Ú Í Ó Ö « » ¦","Ä § Ð F G H J K Ø ° ¨ {enter}","{shift} Æ X ¢ V B Ñ µ Ç . ¿ {shift}","{accept} {alt} {space} {alt} {cancel}"]},colemak:{normal:["` 1 2 3 4 5 6 7 8 9 0 - = {bksp}","{tab} q w f p g j l u y ; [ ] \\","{bksp} a r s t d h n e i o ' {enter}","{shift} z x c v b k m , . / {shift}","{accept} {space} {cancel}"],shift:["~ ! @ # $ % ^ & * ( ) _ + {bksp}","{tab} Q W F P G J L U Y : { } |",'{bksp} A R S T D H N E I O " {enter}',"{shift} Z X C V B K M < > ? {shift}","{accept} {space} {cancel}"]},dvorak:{normal:["` 1 2 3 4 5 6 7 8 9 0 [ ] {bksp}","{tab} ' , . p y f g c r l / = \\","a o e u i d h t n s - {enter}","{shift} ; q j k x b m w v z {shift}","{accept} {space} {cancel}"],shift:["~ ! @ # $ % ^ & * ( ) { } {bksp}",'{tab} " < > P Y F G C R L ? + |',"A O E U I D H T N S _ {enter}","{shift} : Q J K X B M W V Z {shift}","{accept} {space} {cancel}"]},num:{normal:["= ( ) {b}","{clear} / * -","7 8 9 +","4 5 6 {sign}","1 2 3 %","0 {dec} {a} {c}"]}},b.language={en:{display:{a:"✔:Accept (Shift+Enter)",accept:"Accept:Accept (Shift+Enter)",alt:"Alt:⌥ AltGr",b:"⌫:Backspace",bksp:"Bksp:Backspace",c:"✖:Cancel (Esc)",cancel:"Cancel:Cancel (Esc)",clear:"C:Clear",combo:"ö:Toggle Combo Keys",dec:".:Decimal",e:"⏎:Enter",empty:" ",enter:"Enter:Enter ⏎",left:"←",lock:"Lock:⇪ Caps Lock",next:"Next ⇨",prev:"⇦ Prev",right:"→",s:"⇧:Shift",shift:"Shift:Shift",sign:"±:Change Sign",space:" :Space",t:"⇥:Tab",tab:"⇥ Tab:Tab",toggle:" ",valid:"valid",invalid:"invalid",active:"active",disabled:"disabled"},wheelMessage:"Use mousewheel to see other keys",comboRegex:/([`\'~\^\"ao])([a-z])/gim,combos:{"`":{a:"à",A:"À",e:"è",E:"È",i:"ì",I:"Ì",o:"ò",O:"Ò",u:"ù",U:"Ù",y:"ỳ",Y:"Ỳ"},"'":{a:"á",A:"Á",e:"é",E:"É",i:"í",I:"Í",o:"ó",O:"Ó",u:"ú",U:"Ú",y:"ý",Y:"Ý"},'"':{a:"ä",A:"Ä",e:"ë",E:"Ë",i:"ï",I:"Ï",o:"ö",O:"Ö",u:"ü",U:"Ü",y:"ÿ",Y:"Ÿ"},"^":{a:"â",A:"Â",e:"ê",E:"Ê",i:"î",I:"Î",o:"ô",O:"Ô",u:"û",U:"Û",y:"ŷ",Y:"Ŷ"},"~":{a:"ã",A:"Ã",e:"ẽ",E:"Ẽ",i:"ĩ",I:"Ĩ",o:"õ",O:"Õ",u:"ũ",U:"Ũ",y:"ỹ",Y:"Ỹ",n:"ñ",N:"Ñ"}}}},b.defaultOptions={language:null,rtl:!1,layout:"qwerty",customLayout:null,position:{of:null,my:"center top",at:"center top",at2:"center bottom"},reposition:!0,usePreview:!0,alwaysOpen:!1,initialFocus:!0,noFocus:!1,stayOpen:!1,ignoreEsc:!1,css:{input:"ui-widget-content ui-corner-all",container:"ui-widget-content ui-widget ui-corner-all ui-helper-clearfix",popup:"",buttonDefault:"ui-state-default ui-corner-all",buttonHover:"ui-state-hover",buttonAction:"ui-state-active",buttonActive:"ui-state-active",buttonDisabled:"ui-state-disabled",buttonEmpty:"ui-keyboard-empty"},autoAccept:!1,autoAcceptOnEsc:!1,lockInput:!1,restrictInput:!1,restrictInclude:"",acceptValid:!1,cancelClose:!0,tabNavigation:!1,enterNavigation:!1,enterMod:"altKey",stopAtEnd:!0,appendLocally:!1,appendTo:"body",stickyShift:!0,preventPaste:!1,caretToEnd:!1,scrollAdjustment:10,maxLength:!1,maxInsert:!0,repeatDelay:500,repeatRate:20,resetDefault:!0,openOn:"focus",keyBinding:"mousedown touchstart",useWheel:!0,useCombos:!0,validate:function(a,b,c){return!0}},b.comboRegex=/([`\'~\^\"ao])([a-z])/gim,b.currentKeyboard="",a('<!--[if lte IE 8]><script>jQuery("body").addClass("oldie");</script><![endif]--><!--[if IE]><script>jQuery("body").addClass("ie");</script><![endif]-->').appendTo("body").remove(),b.msie=a("body").hasClass("oldie"),b.allie=a("body").hasClass("ie"),b.watermark="undefined"!=typeof document.createElement("input").placeholder,b.checkCaretSupport=function(){if("boolean"!=typeof b.checkCaret){var c=a('<div style="height:0px;width:0px;overflow:hidden;"><input type="text" value="testing"/></div>').prependTo("body");b.caret(c.find("input"),3,3),b.checkCaret=3!==b.caret(c.find("input").hide().show()).start,c.remove()}return b.checkCaret},b.caret=function(a,b,c){if(!a||!a.length||a.is(":hidden")||"hidden"===a.css("visibility"))return{};var d,e,f,g,h=a.data("keyboard"),i=h&&h.options.noFocus;return i||a.focus(),"undefined"!=typeof b?("object"==typeof b&&"start"in b&&"end"in b?(d=b.start,e=b.end):"undefined"==typeof c&&(c=b),"number"==typeof b&&"number"==typeof c?(d=b,e=c):"start"===b?d=e=0:"string"==typeof b&&(d=e=a.val().length),a.caret(d,e,i)):(g=a.caret(),d=g.start,e=g.end,f=a[0].value||a.text()||"",{start:d,end:e,text:f.substring(d,e),replaceStr:function(a){return f.substring(0,d)+a+f.substring(e,f.length)}})},a.fn.keyboard=function(b){return this.each(function(){a(this).data("keyboard")||new a.keyboard(this,b)})},a.fn.getkeyboard=function(){return this.data("keyboard")},a.fn.caret=function(a,b,c){if("undefined"==typeof this[0]||this.is(":hidden")||"hidden"===this.css("visibility"))return this;var d,e,f,g,h,i=document.selection,j=this,k=j[0],l=k.scrollTop,m=!1,n=!0;try{m="selectionStart"in k}catch(o){n=!1}return n&&"undefined"!=typeof a?(/(email|number)/i.test(k.type)||(m?(k.selectionStart=a,k.selectionEnd=b):(d=k.createTextRange(),d.collapse(!0),d.moveStart("character",a),d.moveEnd("character",b-a),d.select())),c||!j.is(":visible")&&"hidden"===j.css("visibility")||k.focus(),k.scrollTop=l,this):(/(email|number)/i.test(k.type)?a=b=j.val().length:m?(a=k.selectionStart,b=k.selectionEnd):i?"TEXTAREA"===k.nodeName?(h=j.val(),e=i.createRange(),f=e.duplicate(),f.moveToElementText(k),f.setEndPoint("EndToEnd",e),a=f.text.replace(/\r/g,"\n").length,b=a+e.text.replace(/\r/g,"\n").length):(h=j.val().replace(/\r/g,"\n"),e=i.createRange().duplicate(),e.moveEnd("character",h.length),a=""===e.text?h.length:h.lastIndexOf(e.text),e=i.createRange().duplicate(),e.moveStart("character",-h.length),b=e.text.length):a=b=(k.value||"").length,g=k.value||"",{start:a,end:b,text:g.substring(a,b),replace:function(c){return g.substring(0,a)+c+g.substring(b,g.length)}})},b});
/*
 jquery.fullscreen 1.1.4
 https://github.com/kayahr/jquery-fullscreen-plugin
 Copyright (C) 2012 Klaus Reimer <k@ailis.de>
 Licensed under the MIT license
 (See http://www.opensource.org/licenses/mit-license)
*/
function d(b){var c,a;if(!this.length)return this;c=this[0];c.ownerDocument?a=c.ownerDocument:(a=c,c=a.documentElement);if(null==b){if(!a.cancelFullScreen&&!a.webkitCancelFullScreen&&!a.mozCancelFullScreen)return null;b=!!a.fullScreen||!!a.webkitIsFullScreen||!!a.mozFullScreen;return!b?b:a.fullScreenElement||a.webkitCurrentFullScreenElement||a.mozFullScreenElement||b}b?(b=c.requestFullScreen||c.webkitRequestFullScreen||c.mozRequestFullScreen)&&b.call(c,Element.ALLOW_KEYBOARD_INPUT):(b=a.cancelFullScreen||
a.webkitCancelFullScreen||a.mozCancelFullScreen)&&b.call(a);return this}jQuery.fn.fullScreen=d;jQuery.fn.toggleFullScreen=function(){return d.call(this,!d.call(this))};var e,f,g;e=document;e.webkitCancelFullScreen?(f="webkitfullscreenchange",g="webkitfullscreenerror"):e.mozCancelFullScreen?(f="mozfullscreenchange",g="mozfullscreenerror"):(f="fullscreenchange",g="fullscreenerror");jQuery(document).bind(f,function(){jQuery(document).trigger(new jQuery.Event("fullscreenchange"))});
jQuery(document).bind(g,function(){jQuery(document).trigger(new jQuery.Event("fullscreenerror"))});
!function(t,i,s){function e(t,s){this.wrapper="string"==typeof t?i.querySelector(t):t,this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this.options={resizeScrollbars:!0,mouseWheelSpeed:20,snapThreshold:.334,startX:0,startY:0,scrollY:!0,directionLockThreshold:5,momentum:!0,bounce:!0,bounceTime:600,bounceEasing:"",preventDefault:!0,preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/},HWCompositing:!0,useTransition:!0,useTransform:!0};for(var e in s)this.options[e]=s[e];this.translateZ=this.options.HWCompositing&&h.hasPerspective?" translateZ(0)":"",this.options.useTransition=h.hasTransition&&this.options.useTransition,this.options.useTransform=h.hasTransform&&this.options.useTransform,this.options.eventPassthrough=this.options.eventPassthrough===!0?"vertical":this.options.eventPassthrough,this.options.preventDefault=!this.options.eventPassthrough&&this.options.preventDefault,this.options.scrollY="vertical"==this.options.eventPassthrough?!1:this.options.scrollY,this.options.scrollX="horizontal"==this.options.eventPassthrough?!1:this.options.scrollX,this.options.freeScroll=this.options.freeScroll&&!this.options.eventPassthrough,this.options.directionLockThreshold=this.options.eventPassthrough?0:this.options.directionLockThreshold,this.options.bounceEasing="string"==typeof this.options.bounceEasing?h.ease[this.options.bounceEasing]||h.ease.circular:this.options.bounceEasing,this.options.resizePolling=void 0===this.options.resizePolling?60:this.options.resizePolling,this.options.tap===!0&&(this.options.tap="tap"),"scale"==this.options.shrinkScrollbars&&(this.options.useTransition=!1),this.options.invertWheelDirection=this.options.invertWheelDirection?-1:1,this.x=0,this.y=0,this.directionX=0,this.directionY=0,this._events={},this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY),this.enable()}function o(t,s,e){var o=i.createElement("div"),n=i.createElement("div");return e===!0&&(o.style.cssText="position:absolute;z-index:9999",n.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px"),n.className="iScrollIndicator","h"==t?(e===!0&&(o.style.cssText+=";height:7px;left:2px;right:2px;bottom:0",n.style.height="100%"),o.className="iScrollHorizontalScrollbar"):(e===!0&&(o.style.cssText+=";width:7px;bottom:2px;top:2px;right:1px",n.style.width="100%"),o.className="iScrollVerticalScrollbar"),o.style.cssText+=";overflow:hidden",s||(o.style.pointerEvents="none"),o.appendChild(n),o}function n(s,e){this.wrapper="string"==typeof e.el?i.querySelector(e.el):e.el,this.wrapperStyle=this.wrapper.style,this.indicator=this.wrapper.children[0],this.indicatorStyle=this.indicator.style,this.scroller=s,this.options={listenX:!0,listenY:!0,interactive:!1,resize:!0,defaultScrollbars:!1,shrink:!1,fade:!1,speedRatioX:0,speedRatioY:0};for(var o in e)this.options[o]=e[o];this.sizeRatioX=1,this.sizeRatioY=1,this.maxPosX=0,this.maxPosY=0,this.options.interactive&&(this.options.disableTouch||(h.addEvent(this.indicator,"touchstart",this),h.addEvent(t,"touchend",this)),this.options.disablePointer||(h.addEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.addEvent(t,h.prefixPointerEvent("pointerup"),this)),this.options.disableMouse||(h.addEvent(this.indicator,"mousedown",this),h.addEvent(t,"mouseup",this))),this.options.fade&&(this.wrapperStyle[h.style.transform]=this.scroller.translateZ,this.wrapperStyle[h.style.transitionDuration]=h.isBadAndroid?"0.001s":"0ms",this.wrapperStyle.opacity="0")}var r=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(i){t.setTimeout(i,1e3/60)},h=function(){function e(t){return r===!1?!1:""===r?t:r+t.charAt(0).toUpperCase()+t.substr(1)}var o={},n=i.createElement("div").style,r=function(){for(var t,i=["t","webkitT","MozT","msT","OT"],s=0,e=i.length;e>s;s++)if(t=i[s]+"ransform",t in n)return i[s].substr(0,i[s].length-1);return!1}();o.getTime=Date.now||function(){return(new Date).getTime()},o.extend=function(t,i){for(var s in i)t[s]=i[s]},o.addEvent=function(t,i,s,e){t.addEventListener(i,s,!!e)},o.removeEvent=function(t,i,s,e){t.removeEventListener(i,s,!!e)},o.prefixPointerEvent=function(i){return t.MSPointerEvent?"MSPointer"+i.charAt(9).toUpperCase()+i.substr(10):i},o.momentum=function(t,i,e,o,n,r){var h,a,l=t-i,c=s.abs(l)/e;return r=void 0===r?6e-4:r,h=t+c*c/(2*r)*(0>l?-1:1),a=c/r,o>h?(h=n?o-n/2.5*(c/8):o,l=s.abs(h-t),a=l/c):h>0&&(h=n?n/2.5*(c/8):0,l=s.abs(t)+h,a=l/c),{destination:s.round(h),duration:a}};var h=e("transform");return o.extend(o,{hasTransform:h!==!1,hasPerspective:e("perspective")in n,hasTouch:"ontouchstart"in t,hasPointer:t.PointerEvent||t.MSPointerEvent,hasTransition:e("transition")in n}),o.isBadAndroid=/Android /.test(t.navigator.appVersion)&&!/Chrome\/\d/.test(t.navigator.appVersion),o.extend(o.style={},{transform:h,transitionTimingFunction:e("transitionTimingFunction"),transitionDuration:e("transitionDuration"),transitionDelay:e("transitionDelay"),transformOrigin:e("transformOrigin")}),o.hasClass=function(t,i){var s=new RegExp("(^|\\s)"+i+"(\\s|$)");return s.test(t.className)},o.addClass=function(t,i){if(!o.hasClass(t,i)){var s=t.className.split(" ");s.push(i),t.className=s.join(" ")}},o.removeClass=function(t,i){if(o.hasClass(t,i)){var s=new RegExp("(^|\\s)"+i+"(\\s|$)","g");t.className=t.className.replace(s," ")}},o.offset=function(t){for(var i=-t.offsetLeft,s=-t.offsetTop;t=t.offsetParent;)i-=t.offsetLeft,s-=t.offsetTop;return{left:i,top:s}},o.preventDefaultException=function(t,i){for(var s in i)if(i[s].test(t[s]))return!0;return!1},o.extend(o.eventType={},{touchstart:1,touchmove:1,touchend:1,mousedown:2,mousemove:2,mouseup:2,pointerdown:3,pointermove:3,pointerup:3,MSPointerDown:3,MSPointerMove:3,MSPointerUp:3}),o.extend(o.ease={},{quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(t){return t*(2-t)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(t){return s.sqrt(1- --t*t)}},back:{style:"cubic-bezier(0.175, 0.885, 0.32, 1.275)",fn:function(t){var i=4;return(t-=1)*t*((i+1)*t+i)+1}},bounce:{style:"",fn:function(t){return(t/=1)<1/2.75?7.5625*t*t:2/2.75>t?7.5625*(t-=1.5/2.75)*t+.75:2.5/2.75>t?7.5625*(t-=2.25/2.75)*t+.9375:7.5625*(t-=2.625/2.75)*t+.984375}},elastic:{style:"",fn:function(t){var i=.22,e=.4;return 0===t?0:1==t?1:e*s.pow(2,-10*t)*s.sin((t-i/4)*(2*s.PI)/i)+1}}}),o.tap=function(t,s){var e=i.createEvent("Event");e.initEvent(s,!0,!0),e.pageX=t.pageX,e.pageY=t.pageY,t.target.dispatchEvent(e)},o.click=function(t){var s,e=t.target;/(SELECT|INPUT|TEXTAREA)/i.test(e.tagName)||(s=i.createEvent("MouseEvents"),s.initMouseEvent("click",!0,!0,t.view,1,e.screenX,e.screenY,e.clientX,e.clientY,t.ctrlKey,t.altKey,t.shiftKey,t.metaKey,0,null),s._constructed=!0,e.dispatchEvent(s))},o}();e.prototype={version:"5.1.3",_init:function(){this._initEvents(),(this.options.scrollbars||this.options.indicators)&&this._initIndicators(),this.options.mouseWheel&&this._initWheel(),this.options.snap&&this._initSnap(),this.options.keyBindings&&this._initKeys()},destroy:function(){this._initEvents(!0),this._execEvent("destroy")},_transitionEnd:function(t){t.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this.resetPosition(this.options.bounceTime)||(this.isInTransition=!1,this._execEvent("scrollEnd")))},_start:function(t){if((1==h.eventType[t.type]||0===t.button)&&this.enabled&&(!this.initiated||h.eventType[t.type]===this.initiated)){!this.options.preventDefault||h.isBadAndroid||h.preventDefaultException(t.target,this.options.preventDefaultException)||t.preventDefault();var i,e=t.touches?t.touches[0]:t;this.initiated=h.eventType[t.type],this.moved=!1,this.distX=0,this.distY=0,this.directionX=0,this.directionY=0,this.directionLocked=0,this._transitionTime(),this.startTime=h.getTime(),this.options.useTransition&&this.isInTransition?(this.isInTransition=!1,i=this.getComputedPosition(),this._translate(s.round(i.x),s.round(i.y)),this._execEvent("scrollEnd")):!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd")),this.startX=this.x,this.startY=this.y,this.absStartX=this.x,this.absStartY=this.y,this.pointX=e.pageX,this.pointY=e.pageY,this._execEvent("beforeScrollStart")}},_move:function(t){if(this.enabled&&h.eventType[t.type]===this.initiated){this.options.preventDefault&&t.preventDefault();var i,e,o,n,r=t.touches?t.touches[0]:t,a=r.pageX-this.pointX,l=r.pageY-this.pointY,c=h.getTime();if(this.pointX=r.pageX,this.pointY=r.pageY,this.distX+=a,this.distY+=l,o=s.abs(this.distX),n=s.abs(this.distY),!(c-this.endTime>300&&10>o&&10>n)){if(this.directionLocked||this.options.freeScroll||(o>n+this.options.directionLockThreshold?this.directionLocked="h":n>=o+this.options.directionLockThreshold?this.directionLocked="v":this.directionLocked="n"),"h"==this.directionLocked){if("vertical"==this.options.eventPassthrough)t.preventDefault();else if("horizontal"==this.options.eventPassthrough)return void(this.initiated=!1);l=0}else if("v"==this.directionLocked){if("horizontal"==this.options.eventPassthrough)t.preventDefault();else if("vertical"==this.options.eventPassthrough)return void(this.initiated=!1);a=0}a=this.hasHorizontalScroll?a:0,l=this.hasVerticalScroll?l:0,i=this.x+a,e=this.y+l,(i>0||i<this.maxScrollX)&&(i=this.options.bounce?this.x+a/3:i>0?0:this.maxScrollX),(e>0||e<this.maxScrollY)&&(e=this.options.bounce?this.y+l/3:e>0?0:this.maxScrollY),this.directionX=a>0?-1:0>a?1:0,this.directionY=l>0?-1:0>l?1:0,this.moved||this._execEvent("scrollStart"),this.moved=!0,this._translate(i,e),c-this.startTime>300&&(this.startTime=c,this.startX=this.x,this.startY=this.y)}}},_end:function(t){if(this.enabled&&h.eventType[t.type]===this.initiated){this.options.preventDefault&&!h.preventDefaultException(t.target,this.options.preventDefaultException)&&t.preventDefault();var i,e,o=(t.changedTouches?t.changedTouches[0]:t,h.getTime()-this.startTime),n=s.round(this.x),r=s.round(this.y),a=s.abs(n-this.startX),l=s.abs(r-this.startY),c=0,p="";if(this.isInTransition=0,this.initiated=0,this.endTime=h.getTime(),!this.resetPosition(this.options.bounceTime)){if(this.scrollTo(n,r),!this.moved)return this.options.tap&&h.tap(t,this.options.tap),this.options.click&&h.click(t),void this._execEvent("scrollCancel");if(this._events.flick&&200>o&&100>a&&100>l)return void this._execEvent("flick");if(this.options.momentum&&300>o&&(i=this.hasHorizontalScroll?h.momentum(this.x,this.startX,o,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:n,duration:0},e=this.hasVerticalScroll?h.momentum(this.y,this.startY,o,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:r,duration:0},n=i.destination,r=e.destination,c=s.max(i.duration,e.duration),this.isInTransition=1),this.options.snap){var d=this._nearestSnap(n,r);this.currentPage=d,c=this.options.snapSpeed||s.max(s.max(s.min(s.abs(n-d.x),1e3),s.min(s.abs(r-d.y),1e3)),300),n=d.x,r=d.y,this.directionX=0,this.directionY=0,p=this.options.bounceEasing}return n!=this.x||r!=this.y?((n>0||n<this.maxScrollX||r>0||r<this.maxScrollY)&&(p=h.ease.quadratic),void this.scrollTo(n,r,c,p)):void this._execEvent("scrollEnd")}}},_resize:function(){var t=this;clearTimeout(this.resizeTimeout),this.resizeTimeout=setTimeout(function(){t.refresh()},this.options.resizePolling)},resetPosition:function(t){var i=this.x,s=this.y;return t=t||0,!this.hasHorizontalScroll||this.x>0?i=0:this.x<this.maxScrollX&&(i=this.maxScrollX),!this.hasVerticalScroll||this.y>0?s=0:this.y<this.maxScrollY&&(s=this.maxScrollY),i==this.x&&s==this.y?!1:(this.scrollTo(i,s,t,this.options.bounceEasing),!0)},disable:function(){this.enabled=!1},enable:function(){this.enabled=!0},refresh:function(){this.wrapper.offsetHeight;this.wrapperWidth=this.wrapper.clientWidth,this.wrapperHeight=this.wrapper.clientHeight,this.scrollerWidth=this.scroller.offsetWidth,this.scrollerHeight=this.scroller.offsetHeight,this.maxScrollX=this.wrapperWidth-this.scrollerWidth,this.maxScrollY=this.wrapperHeight-this.scrollerHeight,this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),this.endTime=0,this.directionX=0,this.directionY=0,this.wrapperOffset=h.offset(this.wrapper),this._execEvent("refresh"),this.resetPosition()},on:function(t,i){this._events[t]||(this._events[t]=[]),this._events[t].push(i)},off:function(t,i){if(this._events[t]){var s=this._events[t].indexOf(i);s>-1&&this._events[t].splice(s,1)}},_execEvent:function(t){if(this._events[t]){var i=0,s=this._events[t].length;if(s)for(;s>i;i++)this._events[t][i].apply(this,[].slice.call(arguments,1))}},scrollBy:function(t,i,s,e){t=this.x+t,i=this.y+i,s=s||0,this.scrollTo(t,i,s,e)},scrollTo:function(t,i,s,e){e=e||h.ease.circular,this.isInTransition=this.options.useTransition&&s>0,!s||this.options.useTransition&&e.style?(this._transitionTimingFunction(e.style),this._transitionTime(s),this._translate(t,i)):this._animate(t,i,s,e.fn)},scrollToElement:function(t,i,e,o,n){if(t=t.nodeType?t:this.scroller.querySelector(t)){var r=h.offset(t);r.left-=this.wrapperOffset.left,r.top-=this.wrapperOffset.top,e===!0&&(e=s.round(t.offsetWidth/2-this.wrapper.offsetWidth/2)),o===!0&&(o=s.round(t.offsetHeight/2-this.wrapper.offsetHeight/2)),r.left-=e||0,r.top-=o||0,r.left=r.left>0?0:r.left<this.maxScrollX?this.maxScrollX:r.left,r.top=r.top>0?0:r.top<this.maxScrollY?this.maxScrollY:r.top,i=void 0===i||null===i||"auto"===i?s.max(s.abs(this.x-r.left),s.abs(this.y-r.top)):i,this.scrollTo(r.left,r.top,i,n)}},_transitionTime:function(t){if(t=t||0,this.scrollerStyle[h.style.transitionDuration]=t+"ms",!t&&h.isBadAndroid&&(this.scrollerStyle[h.style.transitionDuration]="0.001s"),this.indicators)for(var i=this.indicators.length;i--;)this.indicators[i].transitionTime(t)},_transitionTimingFunction:function(t){if(this.scrollerStyle[h.style.transitionTimingFunction]=t,this.indicators)for(var i=this.indicators.length;i--;)this.indicators[i].transitionTimingFunction(t)},_translate:function(t,i){if(this.options.useTransform?this.scrollerStyle[h.style.transform]="translate("+t+"px,"+i+"px)"+this.translateZ:(t=s.round(t),i=s.round(i),this.scrollerStyle.left=t+"px",this.scrollerStyle.top=i+"px"),this.x=t,this.y=i,this.indicators)for(var e=this.indicators.length;e--;)this.indicators[e].updatePosition()},_initEvents:function(i){var s=i?h.removeEvent:h.addEvent,e=this.options.bindToWrapper?this.wrapper:t;s(t,"orientationchange",this),s(t,"resize",this),this.options.click&&s(this.wrapper,"click",this,!0),this.options.disableMouse||(s(this.wrapper,"mousedown",this),s(e,"mousemove",this),s(e,"mousecancel",this),s(e,"mouseup",this)),h.hasPointer&&!this.options.disablePointer&&(s(this.wrapper,h.prefixPointerEvent("pointerdown"),this),s(e,h.prefixPointerEvent("pointermove"),this),s(e,h.prefixPointerEvent("pointercancel"),this),s(e,h.prefixPointerEvent("pointerup"),this)),h.hasTouch&&!this.options.disableTouch&&(s(this.wrapper,"touchstart",this),s(e,"touchmove",this),s(e,"touchcancel",this),s(e,"touchend",this)),s(this.scroller,"transitionend",this),s(this.scroller,"webkitTransitionEnd",this),s(this.scroller,"oTransitionEnd",this),s(this.scroller,"MSTransitionEnd",this)},getComputedPosition:function(){var i,s,e=t.getComputedStyle(this.scroller,null);return this.options.useTransform?(e=e[h.style.transform].split(")")[0].split(", "),i=+(e[12]||e[4]),s=+(e[13]||e[5])):(i=+e.left.replace(/[^-\d.]/g,""),s=+e.top.replace(/[^-\d.]/g,"")),{x:i,y:s}},_initIndicators:function(){function t(t){for(var i=h.indicators.length;i--;)t.call(h.indicators[i])}var i,s=this.options.interactiveScrollbars,e="string"!=typeof this.options.scrollbars,r=[],h=this;this.indicators=[],this.options.scrollbars&&(this.options.scrollY&&(i={el:o("v",s,this.options.scrollbars),interactive:s,defaultScrollbars:!0,customStyle:e,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenX:!1},this.wrapper.appendChild(i.el),r.push(i)),this.options.scrollX&&(i={el:o("h",s,this.options.scrollbars),interactive:s,defaultScrollbars:!0,customStyle:e,resize:this.options.resizeScrollbars,shrink:this.options.shrinkScrollbars,fade:this.options.fadeScrollbars,listenY:!1},this.wrapper.appendChild(i.el),r.push(i))),this.options.indicators&&(r=r.concat(this.options.indicators));for(var a=r.length;a--;)this.indicators.push(new n(this,r[a]));this.options.fadeScrollbars&&(this.on("scrollEnd",function(){t(function(){this.fade()})}),this.on("scrollCancel",function(){t(function(){this.fade()})}),this.on("scrollStart",function(){t(function(){this.fade(1)})}),this.on("beforeScrollStart",function(){t(function(){this.fade(1,!0)})})),this.on("refresh",function(){t(function(){this.refresh()})}),this.on("destroy",function(){t(function(){this.destroy()}),delete this.indicators})},_initWheel:function(){h.addEvent(this.wrapper,"wheel",this),h.addEvent(this.wrapper,"mousewheel",this),h.addEvent(this.wrapper,"DOMMouseScroll",this),this.on("destroy",function(){h.removeEvent(this.wrapper,"wheel",this),h.removeEvent(this.wrapper,"mousewheel",this),h.removeEvent(this.wrapper,"DOMMouseScroll",this)})},_wheel:function(t){if(this.enabled){t.preventDefault(),t.stopPropagation();var i,e,o,n,r=this;if(void 0===this.wheelTimeout&&r._execEvent("scrollStart"),clearTimeout(this.wheelTimeout),this.wheelTimeout=setTimeout(function(){r._execEvent("scrollEnd"),r.wheelTimeout=void 0},400),"deltaX"in t)1===t.deltaMode?(i=-t.deltaX*this.options.mouseWheelSpeed,e=-t.deltaY*this.options.mouseWheelSpeed):(i=-t.deltaX,e=-t.deltaY);else if("wheelDeltaX"in t)i=t.wheelDeltaX/120*this.options.mouseWheelSpeed,e=t.wheelDeltaY/120*this.options.mouseWheelSpeed;else if("wheelDelta"in t)i=e=t.wheelDelta/120*this.options.mouseWheelSpeed;else{if(!("detail"in t))return;i=e=-t.detail/3*this.options.mouseWheelSpeed}if(i*=this.options.invertWheelDirection,e*=this.options.invertWheelDirection,this.hasVerticalScroll||(i=e,e=0),this.options.snap)return o=this.currentPage.pageX,n=this.currentPage.pageY,i>0?o--:0>i&&o++,e>0?n--:0>e&&n++,void this.goToPage(o,n);o=this.x+s.round(this.hasHorizontalScroll?i:0),n=this.y+s.round(this.hasVerticalScroll?e:0),o>0?o=0:o<this.maxScrollX&&(o=this.maxScrollX),n>0?n=0:n<this.maxScrollY&&(n=this.maxScrollY),this.scrollTo(o,n,0)}},_initSnap:function(){this.currentPage={},"string"==typeof this.options.snap&&(this.options.snap=this.scroller.querySelectorAll(this.options.snap)),this.on("refresh",function(){var t,i,e,o,n,r,h=0,a=0,l=0,c=this.options.snapStepX||this.wrapperWidth,p=this.options.snapStepY||this.wrapperHeight;if(this.pages=[],this.wrapperWidth&&this.wrapperHeight&&this.scrollerWidth&&this.scrollerHeight){if(this.options.snap===!0)for(e=s.round(c/2),o=s.round(p/2);l>-this.scrollerWidth;){for(this.pages[h]=[],t=0,n=0;n>-this.scrollerHeight;)this.pages[h][t]={x:s.max(l,this.maxScrollX),y:s.max(n,this.maxScrollY),width:c,height:p,cx:l-e,cy:n-o},n-=p,t++;l-=c,h++}else for(r=this.options.snap,t=r.length,i=-1;t>h;h++)(0===h||r[h].offsetLeft<=r[h-1].offsetLeft)&&(a=0,i++),this.pages[a]||(this.pages[a]=[]),l=s.max(-r[h].offsetLeft,this.maxScrollX),n=s.max(-r[h].offsetTop,this.maxScrollY),e=l-s.round(r[h].offsetWidth/2),o=n-s.round(r[h].offsetHeight/2),this.pages[a][i]={x:l,y:n,width:r[h].offsetWidth,height:r[h].offsetHeight,cx:e,cy:o},l>this.maxScrollX&&a++;this.goToPage(this.currentPage.pageX||0,this.currentPage.pageY||0,0),this.options.snapThreshold%1===0?(this.snapThresholdX=this.options.snapThreshold,this.snapThresholdY=this.options.snapThreshold):(this.snapThresholdX=s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width*this.options.snapThreshold),this.snapThresholdY=s.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height*this.options.snapThreshold))}}),this.on("flick",function(){var t=this.options.snapSpeed||s.max(s.max(s.min(s.abs(this.x-this.startX),1e3),s.min(s.abs(this.y-this.startY),1e3)),300);this.goToPage(this.currentPage.pageX+this.directionX,this.currentPage.pageY+this.directionY,t)})},_nearestSnap:function(t,i){if(!this.pages.length)return{x:0,y:0,pageX:0,pageY:0};var e=0,o=this.pages.length,n=0;if(s.abs(t-this.absStartX)<this.snapThresholdX&&s.abs(i-this.absStartY)<this.snapThresholdY)return this.currentPage;for(t>0?t=0:t<this.maxScrollX&&(t=this.maxScrollX),i>0?i=0:i<this.maxScrollY&&(i=this.maxScrollY);o>e;e++)if(t>=this.pages[e][0].cx){t=this.pages[e][0].x;break}for(o=this.pages[e].length;o>n;n++)if(i>=this.pages[0][n].cy){i=this.pages[0][n].y;break}return e==this.currentPage.pageX&&(e+=this.directionX,0>e?e=0:e>=this.pages.length&&(e=this.pages.length-1),t=this.pages[e][0].x),n==this.currentPage.pageY&&(n+=this.directionY,0>n?n=0:n>=this.pages[0].length&&(n=this.pages[0].length-1),i=this.pages[0][n].y),{x:t,y:i,pageX:e,pageY:n}},goToPage:function(t,i,e,o){o=o||this.options.bounceEasing,t>=this.pages.length?t=this.pages.length-1:0>t&&(t=0),i>=this.pages[t].length?i=this.pages[t].length-1:0>i&&(i=0);var n=this.pages[t][i].x,r=this.pages[t][i].y;e=void 0===e?this.options.snapSpeed||s.max(s.max(s.min(s.abs(n-this.x),1e3),s.min(s.abs(r-this.y),1e3)),300):e,this.currentPage={x:n,y:r,pageX:t,pageY:i},this.scrollTo(n,r,e,o)},next:function(t,i){var s=this.currentPage.pageX,e=this.currentPage.pageY;s++,s>=this.pages.length&&this.hasVerticalScroll&&(s=0,e++),this.goToPage(s,e,t,i)},prev:function(t,i){var s=this.currentPage.pageX,e=this.currentPage.pageY;s--,0>s&&this.hasVerticalScroll&&(s=0,e--),this.goToPage(s,e,t,i)},_initKeys:function(i){var s,e={pageUp:33,pageDown:34,end:35,home:36,left:37,up:38,right:39,down:40};if("object"==typeof this.options.keyBindings)for(s in this.options.keyBindings)"string"==typeof this.options.keyBindings[s]&&(this.options.keyBindings[s]=this.options.keyBindings[s].toUpperCase().charCodeAt(0));else this.options.keyBindings={};for(s in e)this.options.keyBindings[s]=this.options.keyBindings[s]||e[s];h.addEvent(t,"keydown",this),this.on("destroy",function(){h.removeEvent(t,"keydown",this)})},_key:function(t){if(this.enabled){var i,e=this.options.snap,o=e?this.currentPage.pageX:this.x,n=e?this.currentPage.pageY:this.y,r=h.getTime(),a=this.keyTime||0,l=.25;switch(this.options.useTransition&&this.isInTransition&&(i=this.getComputedPosition(),this._translate(s.round(i.x),s.round(i.y)),this.isInTransition=!1),this.keyAcceleration=200>r-a?s.min(this.keyAcceleration+l,50):0,t.keyCode){case this.options.keyBindings.pageUp:this.hasHorizontalScroll&&!this.hasVerticalScroll?o+=e?1:this.wrapperWidth:n+=e?1:this.wrapperHeight;break;case this.options.keyBindings.pageDown:this.hasHorizontalScroll&&!this.hasVerticalScroll?o-=e?1:this.wrapperWidth:n-=e?1:this.wrapperHeight;break;case this.options.keyBindings.end:o=e?this.pages.length-1:this.maxScrollX,n=e?this.pages[0].length-1:this.maxScrollY;break;case this.options.keyBindings.home:o=0,n=0;break;case this.options.keyBindings.left:o+=e?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.up:n+=e?1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.right:o-=e?-1:5+this.keyAcceleration>>0;break;case this.options.keyBindings.down:n-=e?1:5+this.keyAcceleration>>0;break;default:return}if(e)return void this.goToPage(o,n);o>0?(o=0,this.keyAcceleration=0):o<this.maxScrollX&&(o=this.maxScrollX,this.keyAcceleration=0),n>0?(n=0,this.keyAcceleration=0):n<this.maxScrollY&&(n=this.maxScrollY,this.keyAcceleration=0),this.scrollTo(o,n,0),this.keyTime=r}},_animate:function(t,i,s,e){function o(){var d,u,m,f=h.getTime();return f>=p?(n.isAnimating=!1,n._translate(t,i),void(n.resetPosition(n.options.bounceTime)||n._execEvent("scrollEnd"))):(f=(f-c)/s,m=e(f),d=(t-a)*m+a,u=(i-l)*m+l,n._translate(d,u),void(n.isAnimating&&r(o)))}var n=this,a=this.x,l=this.y,c=h.getTime(),p=c+s;this.isAnimating=!0,o()},handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t);break;case"orientationchange":case"resize":this._resize();break;case"transitionend":case"webkitTransitionEnd":case"oTransitionEnd":case"MSTransitionEnd":this._transitionEnd(t);break;case"wheel":case"DOMMouseScroll":case"mousewheel":this._wheel(t);break;case"keydown":this._key(t);break;case"click":t._constructed||(t.preventDefault(),t.stopPropagation())}}},n.prototype={handleEvent:function(t){switch(t.type){case"touchstart":case"pointerdown":case"MSPointerDown":case"mousedown":this._start(t);break;case"touchmove":case"pointermove":case"MSPointerMove":case"mousemove":this._move(t);break;case"touchend":case"pointerup":case"MSPointerUp":case"mouseup":case"touchcancel":case"pointercancel":case"MSPointerCancel":case"mousecancel":this._end(t)}},destroy:function(){this.options.interactive&&(h.removeEvent(this.indicator,"touchstart",this),h.removeEvent(this.indicator,h.prefixPointerEvent("pointerdown"),this),h.removeEvent(this.indicator,"mousedown",this),h.removeEvent(t,"touchmove",this),h.removeEvent(t,h.prefixPointerEvent("pointermove"),this),h.removeEvent(t,"mousemove",this),h.removeEvent(t,"touchend",this),h.removeEvent(t,h.prefixPointerEvent("pointerup"),this),h.removeEvent(t,"mouseup",this)),this.options.defaultScrollbars&&this.wrapper.parentNode.removeChild(this.wrapper)},_start:function(i){var s=i.touches?i.touches[0]:i;i.preventDefault(),i.stopPropagation(),this.transitionTime(),this.initiated=!0,this.moved=!1,this.lastPointX=s.pageX,this.lastPointY=s.pageY,this.startTime=h.getTime(),this.options.disableTouch||h.addEvent(t,"touchmove",this),this.options.disablePointer||h.addEvent(t,h.prefixPointerEvent("pointermove"),this),this.options.disableMouse||h.addEvent(t,"mousemove",this),this.scroller._execEvent("beforeScrollStart")},_move:function(t){var i,s,e,o,n=t.touches?t.touches[0]:t;h.getTime();this.moved||this.scroller._execEvent("scrollStart"),this.moved=!0,i=n.pageX-this.lastPointX,this.lastPointX=n.pageX,s=n.pageY-this.lastPointY,this.lastPointY=n.pageY,e=this.x+i,o=this.y+s,this._pos(e,o),t.preventDefault(),t.stopPropagation()},_end:function(i){if(this.initiated){if(this.initiated=!1,i.preventDefault(),i.stopPropagation(),h.removeEvent(t,"touchmove",this),h.removeEvent(t,h.prefixPointerEvent("pointermove"),this),h.removeEvent(t,"mousemove",this),this.scroller.options.snap){var e=this.scroller._nearestSnap(this.scroller.x,this.scroller.y),o=this.options.snapSpeed||s.max(s.max(s.min(s.abs(this.scroller.x-e.x),1e3),s.min(s.abs(this.scroller.y-e.y),1e3)),300);this.scroller.x==e.x&&this.scroller.y==e.y||(this.scroller.directionX=0,this.scroller.directionY=0,this.scroller.currentPage=e,this.scroller.scrollTo(e.x,e.y,o,this.scroller.options.bounceEasing))}this.moved&&this.scroller._execEvent("scrollEnd")}},transitionTime:function(t){t=t||0,this.indicatorStyle[h.style.transitionDuration]=t+"ms",!t&&h.isBadAndroid&&(this.indicatorStyle[h.style.transitionDuration]="0.001s")},transitionTimingFunction:function(t){this.indicatorStyle[h.style.transitionTimingFunction]=t},refresh:function(){this.transitionTime(),this.options.listenX&&!this.options.listenY?this.indicatorStyle.display=this.scroller.hasHorizontalScroll?"block":"none":this.options.listenY&&!this.options.listenX?this.indicatorStyle.display=this.scroller.hasVerticalScroll?"block":"none":this.indicatorStyle.display=this.scroller.hasHorizontalScroll||this.scroller.hasVerticalScroll?"block":"none",this.scroller.hasHorizontalScroll&&this.scroller.hasVerticalScroll?(h.addClass(this.wrapper,"iScrollBothScrollbars"),h.removeClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="8px":this.wrapper.style.bottom="8px")):(h.removeClass(this.wrapper,"iScrollBothScrollbars"),h.addClass(this.wrapper,"iScrollLoneScrollbar"),this.options.defaultScrollbars&&this.options.customStyle&&(this.options.listenX?this.wrapper.style.right="2px":this.wrapper.style.bottom="2px"));this.wrapper.offsetHeight;this.options.listenX&&(this.wrapperWidth=this.wrapper.clientWidth,this.options.resize?(this.indicatorWidth=s.max(s.round(this.wrapperWidth*this.wrapperWidth/(this.scroller.scrollerWidth||this.wrapperWidth||1)),8),this.indicatorStyle.width=this.indicatorWidth+"px"):this.indicatorWidth=this.indicator.clientWidth,this.maxPosX=this.wrapperWidth-this.indicatorWidth,"clip"==this.options.shrink?(this.minBoundaryX=-this.indicatorWidth+8,this.maxBoundaryX=this.wrapperWidth-8):(this.minBoundaryX=0,this.maxBoundaryX=this.maxPosX),this.sizeRatioX=this.options.speedRatioX||this.scroller.maxScrollX&&this.maxPosX/this.scroller.maxScrollX),this.options.listenY&&(this.wrapperHeight=this.wrapper.clientHeight,this.options.resize?(this.indicatorHeight=s.max(s.round(this.wrapperHeight*this.wrapperHeight/(this.scroller.scrollerHeight||this.wrapperHeight||1)),8),this.indicatorStyle.height=this.indicatorHeight+"px"):this.indicatorHeight=this.indicator.clientHeight,this.maxPosY=this.wrapperHeight-this.indicatorHeight,"clip"==this.options.shrink?(this.minBoundaryY=-this.indicatorHeight+8,this.maxBoundaryY=this.wrapperHeight-8):(this.minBoundaryY=0,this.maxBoundaryY=this.maxPosY),this.maxPosY=this.wrapperHeight-this.indicatorHeight,this.sizeRatioY=this.options.speedRatioY||this.scroller.maxScrollY&&this.maxPosY/this.scroller.maxScrollY),this.updatePosition()},updatePosition:function(){var t=this.options.listenX&&s.round(this.sizeRatioX*this.scroller.x)||0,i=this.options.listenY&&s.round(this.sizeRatioY*this.scroller.y)||0;this.options.ignoreBoundaries||(t<this.minBoundaryX?("scale"==this.options.shrink&&(this.width=s.max(this.indicatorWidth+t,8),this.indicatorStyle.width=this.width+"px"),t=this.minBoundaryX):t>this.maxBoundaryX?"scale"==this.options.shrink?(this.width=s.max(this.indicatorWidth-(t-this.maxPosX),8),this.indicatorStyle.width=this.width+"px",t=this.maxPosX+this.indicatorWidth-this.width):t=this.maxBoundaryX:"scale"==this.options.shrink&&this.width!=this.indicatorWidth&&(this.width=this.indicatorWidth,this.indicatorStyle.width=this.width+"px"),i<this.minBoundaryY?("scale"==this.options.shrink&&(this.height=s.max(this.indicatorHeight+3*i,8),this.indicatorStyle.height=this.height+"px"),i=this.minBoundaryY):i>this.maxBoundaryY?"scale"==this.options.shrink?(this.height=s.max(this.indicatorHeight-3*(i-this.maxPosY),8),this.indicatorStyle.height=this.height+"px",i=this.maxPosY+this.indicatorHeight-this.height):i=this.maxBoundaryY:"scale"==this.options.shrink&&this.height!=this.indicatorHeight&&(this.height=this.indicatorHeight,this.indicatorStyle.height=this.height+"px")),this.x=t,this.y=i,this.scroller.options.useTransform?this.indicatorStyle[h.style.transform]="translate("+t+"px,"+i+"px)"+this.scroller.translateZ:(this.indicatorStyle.left=t+"px",this.indicatorStyle.top=i+"px")},_pos:function(t,i){0>t?t=0:t>this.maxPosX&&(t=this.maxPosX),0>i?i=0:i>this.maxPosY&&(i=this.maxPosY),t=this.options.listenX?s.round(t/this.sizeRatioX):this.scroller.x,i=this.options.listenY?s.round(i/this.sizeRatioY):this.scroller.y,this.scroller.scrollTo(t,i)},fade:function(t,i){if(!i||this.visible){clearTimeout(this.fadeTimeout),this.fadeTimeout=null;var s=t?250:500,e=t?0:300;t=t?"1":"0",this.wrapperStyle[h.style.transitionDuration]=s+"ms",this.fadeTimeout=setTimeout(function(t){this.wrapperStyle.opacity=t,this.visible=+t}.bind(this,t),e)}}},e.utils=h,"undefined"!=typeof module&&module.exports?module.exports=e:t.IScroll=e}(window,document,Math);
!function(t){"use strict";function e(t){return null!==t&&t===t.window}function n(t){return e(t)?t:9===t.nodeType&&t.defaultView}function a(t){var e,a,i={top:0,left:0},o=t&&t.ownerDocument;return e=o.documentElement,"undefined"!=typeof t.getBoundingClientRect&&(i=t.getBoundingClientRect()),a=n(o),{top:i.top+a.pageYOffset-e.clientTop,left:i.left+a.pageXOffset-e.clientLeft}}function i(t){var e="";for(var n in t)t.hasOwnProperty(n)&&(e+=n+":"+t[n]+";");return e}function o(t){if(d.allowEvent(t)===!1)return null;for(var e=null,n=t.target||t.srcElement;null!==n.parentElement;){if(!(n instanceof SVGElement||-1===n.className.indexOf("waves-effect"))){e=n;break}if(n.classList.contains("waves-effect")){e=n;break}n=n.parentElement}return e}function r(e){var n=o(e);null!==n&&(c.show(e,n),"ontouchstart"in t&&(n.addEventListener("touchend",c.hide,!1),n.addEventListener("touchcancel",c.hide,!1)),n.addEventListener("mouseup",c.hide,!1),n.addEventListener("mouseleave",c.hide,!1))}var s=s||{},u=document.querySelectorAll.bind(document),c={duration:750,show:function(t,e){if(2===t.button)return!1;var n=e||this,o=document.createElement("div");o.className="waves-ripple",n.appendChild(o);var r=a(n),s=t.pageY-r.top,u=t.pageX-r.left,d="scale("+n.clientWidth/100*10+")";"touches"in t&&(s=t.touches[0].pageY-r.top,u=t.touches[0].pageX-r.left),o.setAttribute("data-hold",Date.now()),o.setAttribute("data-scale",d),o.setAttribute("data-x",u),o.setAttribute("data-y",s);var l={top:s+"px",left:u+"px"};o.className=o.className+" waves-notransition",o.setAttribute("style",i(l)),o.className=o.className.replace("waves-notransition",""),l["-webkit-transform"]=d,l["-moz-transform"]=d,l["-ms-transform"]=d,l["-o-transform"]=d,l.transform=d,l.opacity="1",l["-webkit-transition-duration"]=c.duration+"ms",l["-moz-transition-duration"]=c.duration+"ms",l["-o-transition-duration"]=c.duration+"ms",l["transition-duration"]=c.duration+"ms",l["-webkit-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",l["-moz-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",l["-o-transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",l["transition-timing-function"]="cubic-bezier(0.250, 0.460, 0.450, 0.940)",o.setAttribute("style",i(l))},hide:function(t){d.touchup(t);var e=this,n=(1.4*e.clientWidth,null),a=e.getElementsByClassName("waves-ripple");if(!(a.length>0))return!1;n=a[a.length-1];var o=n.getAttribute("data-x"),r=n.getAttribute("data-y"),s=n.getAttribute("data-scale"),u=Date.now()-Number(n.getAttribute("data-hold")),l=350-u;0>l&&(l=0),setTimeout(function(){var t={top:r+"px",left:o+"px",opacity:"0","-webkit-transition-duration":c.duration+"ms","-moz-transition-duration":c.duration+"ms","-o-transition-duration":c.duration+"ms","transition-duration":c.duration+"ms","-webkit-transform":s,"-moz-transform":s,"-ms-transform":s,"-o-transform":s,transform:s};n.setAttribute("style",i(t)),setTimeout(function(){try{e.removeChild(n)}catch(t){return!1}},c.duration)},l)},wrapInput:function(t){for(var e=0;e<t.length;e++){var n=t[e];if("input"===n.tagName.toLowerCase()){var a=n.parentNode;if("i"===a.tagName.toLowerCase()&&-1!==a.className.indexOf("waves-effect"))continue;var i=document.createElement("i");i.className=n.className+" waves-input-wrapper";var o=n.getAttribute("style");o||(o=""),i.setAttribute("style",o),n.className="waves-button-input",n.removeAttribute("style"),a.replaceChild(i,n),i.appendChild(n)}}}},d={touches:0,allowEvent:function(t){var e=!0;return"touchstart"===t.type?d.touches+=1:"touchend"===t.type||"touchcancel"===t.type?setTimeout(function(){d.touches>0&&(d.touches-=1)},500):"mousedown"===t.type&&d.touches>0&&(e=!1),e},touchup:function(t){d.allowEvent(t)}};s.displayEffect=function(e){e=e||{},"duration"in e&&(c.duration=e.duration),c.wrapInput(u(".waves-effect")),"ontouchstart"in t&&document.body.addEventListener("touchstart",r,!1),document.body.addEventListener("mousedown",r,!1)},s.attach=function(e){"input"===e.tagName.toLowerCase()&&(c.wrapInput([e]),e=e.parentElement),"ontouchstart"in t&&e.addEventListener("touchstart",r,!1),e.addEventListener("mousedown",r,!1)},t.Waves=s,document.addEventListener("DOMContentLoaded",function(){s.displayEffect()},!1)}(window);
/*
jquery-circle-progress - jQuery Plugin to draw animated circular progress bars

URL: http://kottenator.github.io/jquery-circle-progress/
Author: Rostyslav Bryzgunov <kottenator@gmail.com>
Version: 1.1.3
License: MIT
*/
(function($) {
    function CircleProgress(config) {
        this.init(config);
    }

    CircleProgress.prototype = {
        //----------------------------------------------- public options -----------------------------------------------
        /**
         * This is the only required option. It should be from 0.0 to 1.0
         * @type {number}
         */
        value: 0.0,

        /**
         * Size of the circle / canvas in pixels
         * @type {number}
         */
        size: 100.0,

        /**
         * Initial angle for 0.0 value in radians
         * @type {number}
         */
        startAngle: -Math.PI,

        /**
         * Width of the arc. By default it's auto-calculated as 1/14 of size, but you may set it explicitly in pixels
         * @type {number|string}
         */
        thickness: 'auto',

        /**
         * Fill of the arc. You may set it to:
         *   - solid color:
         *     - { color: '#3aeabb' }
         *     - { color: 'rgba(255, 255, 255, .3)' }
         *   - linear gradient (left to right):
         *     - { gradient: ['#3aeabb', '#fdd250'], gradientAngle: Math.PI / 4 }
         *     - { gradient: ['red', 'green', 'blue'], gradientDirection: [x0, y0, x1, y1] }
         *   - image:
         *     - { image: 'http://i.imgur.com/pT0i89v.png' }
         *     - { image: imageObject }
         *     - { color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' } - color displayed until the image is loaded
         */
        fill: {
            gradient: ['#3aeabb', '#fdd250']
        },

        /**
         * Color of the "empty" arc. Only a color fill supported by now
         * @type {string}
         */
        emptyFill: 'rgba(0, 0, 0, .1)',

        /**
         * Animation config (see jQuery animations: http://api.jquery.com/animate/)
         */
        animation: {
            duration: 1200,
            easing: 'circleProgressEasing'
        },

        /**
         * Default animation starts at 0.0 and ends at specified `value`. Let's call this direct animation.
         * If you want to make reversed animation then you should set `animationStartValue` to 1.0.
         * Also you may specify any other value from 0.0 to 1.0
         * @type {number}
         */
        animationStartValue: 0.0,

        /**
         * Reverse animation and arc draw
         * @type {boolean}
         */
        reverse: false,

        /**
         * Arc line cap ('butt', 'round' or 'square')
         * Read more: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.lineCap
         * @type {string}
         */
        lineCap: 'butt',

        //-------------------------------------- protected properties and methods --------------------------------------
        /**
         * @protected
         */
        constructor: CircleProgress,

        /**
         * Container element. Should be passed into constructor config
         * @protected
         * @type {jQuery}
         */
        el: null,

        /**
         * Canvas element. Automatically generated and prepended to the {@link CircleProgress.el container}
         * @protected
         * @type {HTMLCanvasElement}
         */
        canvas: null,

        /**
         * 2D-context of the {@link CircleProgress.canvas canvas}
         * @protected
         * @type {CanvasRenderingContext2D}
         */
        ctx: null,

        /**
         * Radius of the outer circle. Automatically calculated as {@link CircleProgress.size} / 2
         * @protected
         * @type {number}
         */
        radius: 0.0,

        /**
         * Fill of the main arc. Automatically calculated, depending on {@link CircleProgress.fill} option
         * @protected
         * @type {string|CanvasGradient|CanvasPattern}
         */
        arcFill: null,

        /**
         * Last rendered frame value
         * @protected
         * @type {number}
         */
        lastFrameValue: 0.0,

        /**
         * Init/re-init the widget
         * @param {object} config - Config
         */
        init: function(config) {
            $.extend(this, config);
            this.radius = this.size / 2;
            this.initWidget();
            this.initFill();
            this.draw();
        },

        /**
         * @protected
         */
        initWidget: function() {
            var canvas = this.canvas = this.canvas || $('<canvas>').prependTo(this.el)[0];
            canvas.width = this.size;
            canvas.height = this.size;
            this.ctx = canvas.getContext('2d');
        },

        /**
         * This method sets {@link CircleProgress.arcFill}
         * It could do this async (on image load)
         * @protected
         */
        initFill: function() {
            var self = this,
                fill = this.fill,
                ctx = this.ctx,
                size = this.size;

            if (!fill)
                throw Error("The fill is not specified!");

            if (fill.color)
                this.arcFill = fill.color;

            if (fill.gradient) {
                var gr = fill.gradient;

                if (gr.length == 1) {
                    this.arcFill = gr[0];
                } else if (gr.length > 1) {
                    var ga = fill.gradientAngle || 0, // gradient direction angle; 0 by default
                        gd = fill.gradientDirection || [
                            size / 2 * (1 - Math.cos(ga)), // x0
                            size / 2 * (1 + Math.sin(ga)), // y0
                            size / 2 * (1 + Math.cos(ga)), // x1
                            size / 2 * (1 - Math.sin(ga))  // y1
                        ];

                    var lg = ctx.createLinearGradient.apply(ctx, gd);

                    for (var i = 0; i < gr.length; i++) {
                        var color = gr[i],
                            pos = i / (gr.length - 1);

                        if ($.isArray(color)) {
                            pos = color[1];
                            color = color[0];
                        }

                        lg.addColorStop(pos, color);
                    }

                    this.arcFill = lg;
                }
            }

            if (fill.image) {
                var img;

                if (fill.image instanceof Image) {
                    img = fill.image;
                } else {
                    img = new Image();
                    img.src = fill.image;
                }

                if (img.complete)
                    setImageFill();
                else
                    img.onload = setImageFill;
            }

            function setImageFill() {
                var bg = $('<canvas>')[0];
                bg.width = self.size;
                bg.height = self.size;
                bg.getContext('2d').drawImage(img, 0, 0, size, size);
                self.arcFill = self.ctx.createPattern(bg, 'no-repeat');
                self.drawFrame(self.lastFrameValue);
            }
        },

        draw: function() {
            if (this.animation)
                this.drawAnimated(this.value);
            else
                this.drawFrame(this.value);
        },

        /**
         * @protected
         * @param {number} v - Frame value
         */
        drawFrame: function(v) {
            this.lastFrameValue = v;
            this.ctx.clearRect(0, 0, this.size, this.size);
            this.drawEmptyArc(v);
            this.drawArc(v);
        },

        /**
         * @protected
         * @param {number} v - Frame value
         */
        drawArc: function(v) {
            var ctx = this.ctx,
                r = this.radius,
                t = this.getThickness(),
                a = this.startAngle;

            ctx.save();
            ctx.beginPath();

            if (!this.reverse) {
                ctx.arc(r, r, r - t / 2, a, a + Math.PI * 2 * v);
            } else {
                ctx.arc(r, r, r - t / 2, a - Math.PI * 2 * v, a);
            }

            ctx.lineWidth = t;
            ctx.lineCap = this.lineCap;
            ctx.strokeStyle = this.arcFill;
            ctx.stroke();
            ctx.restore();
        },

        /**
         * @protected
         * @param {number} v - Frame value
         */
        drawEmptyArc: function(v) {
            var ctx = this.ctx,
                r = this.radius,
                t = this.getThickness(),
                a = this.startAngle;

            if (v < 1) {
                ctx.save();
                ctx.beginPath();

                if (v <= 0) {
                    ctx.arc(r, r, r - t / 2, 0, Math.PI * 2);
                } else {
                    if (!this.reverse) {
                        ctx.arc(r, r, r - t / 2, a + Math.PI * 2 * v, a);
                    } else {
                        ctx.arc(r, r, r - t / 2, a, a - Math.PI * 2 * v);
                    }
                }

                ctx.lineWidth = t;
                ctx.strokeStyle = this.emptyFill;
                ctx.stroke();
                ctx.restore();
            }
        },

        /**
         * @protected
         * @param {number} v - Value
         */
        drawAnimated: function(v) {
            var self = this,
                el = this.el,
                canvas = $(this.canvas);

            // stop previous animation before new "start" event is triggered
            canvas.stop(true, false);
            el.trigger('circle-animation-start');

            canvas
                .css({ animationProgress: 0 })
                .animate({ animationProgress: 1 }, $.extend({}, this.animation, {
                    step: function (animationProgress) {
                        var stepValue = self.animationStartValue * (1 - animationProgress) + v * animationProgress;
                        self.drawFrame(stepValue);
                        el.trigger('circle-animation-progress', [animationProgress, stepValue]);
                    }
                }))
                .promise()
                .always(function() {
                    // trigger on both successful & failure animation end
                    el.trigger('circle-animation-end');
                });
        },

        /**
         * @protected
         * @returns {number}
         */
        getThickness: function() {
            return $.isNumeric(this.thickness) ? this.thickness : this.size / 14;
        },

        getValue: function() {
            return this.value;
        },

        setValue: function(newValue) {
            if (this.animation)
                this.animationStartValue = this.lastFrameValue;
            this.value = newValue;
            this.draw();
        }
    };

    //-------------------------------------------- Initiating jQuery plugin --------------------------------------------
    $.circleProgress = {
        // Default options (you may override them)
        defaults: CircleProgress.prototype
    };

    // ease-in-out-cubic
    $.easing.circleProgressEasing = function(x, t, b, c, d) {
        if ((t /= d / 2) < 1)
            return c / 2 * t * t * t + b;
        return c / 2 * ((t -= 2) * t * t + 2) + b;
    };

    /**
     * Draw animated circular progress bar.
     *
     * Appends <canvas> to the element or updates already appended one.
     *
     * If animated, throws 3 events:
     *
     *   - circle-animation-start(jqEvent)
     *   - circle-animation-progress(jqEvent, animationProgress, stepValue) - multiple event;
     *                                                                        animationProgress: from 0.0 to 1.0;
     *                                                                        stepValue: from 0.0 to value
     *   - circle-animation-end(jqEvent)
     *
     * @param configOrCommand - Config object or command name
     *     Example: { value: 0.75, size: 50, animation: false };
     *     you may set any public property (see above);
     *     `animation` may be set to false;
     *     you may use .circleProgress('widget') to get the canvas
     *     you may use .circleProgress('value', newValue) to dynamically update the value
     *
     * @param commandArgument - Some commands (like 'value') may require an argument
     */
    $.fn.circleProgress = function(configOrCommand, commandArgument) {
        var dataName = 'circle-progress',
            firstInstance = this.data(dataName);

        if (configOrCommand == 'widget') {
            if (!firstInstance)
                throw Error('Calling "widget" method on not initialized instance is forbidden');
            return firstInstance.canvas;
        }

        if (configOrCommand == 'value') {
            if (!firstInstance)
                throw Error('Calling "value" method on not initialized instance is forbidden');
            if (typeof commandArgument == 'undefined') {
                return firstInstance.getValue();
            } else {
                var newValue = arguments[1];
                return this.each(function() {
                    $(this).data(dataName).setValue(newValue);
                });
            }
        }

        return this.each(function() {
            var el = $(this),
                instance = el.data(dataName),
                config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

            if (instance) {
                instance.init(config);
            } else {
                var initialConfig = $.extend({}, el.data());
                if (typeof initialConfig.fill == 'string')
                    initialConfig.fill = JSON.parse(initialConfig.fill);
                if (typeof initialConfig.animation == 'string')
                    initialConfig.animation = JSON.parse(initialConfig.animation);
                config = $.extend(initialConfig, config);
                config.el = el;
                instance = new CircleProgress(config);
                el.data(dataName, instance);
            }
        });
    };
})(jQuery);

/*! Hammer.JS - v2.0.6 - 2015-12-23
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2015 Jorik Tangelder;
 * Licensed under the  license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&hb(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==kb?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ib.length;){if(c=ib[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return qb++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:tb?M:ub?P:sb?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ab&&d-e===0,g=b&(Cb|Db)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=nb(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=mb(j.x)>mb(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};(b.eventType===Ab||f.eventType===Cb)&&(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Db&&(i>zb||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=mb(l.x)>mb(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:lb(a.pointers[c].clientX),clientY:lb(a.pointers[c].clientY)},c++;return{timeStamp:nb(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:lb(a[0].clientX),y:lb(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:lb(c/b),y:lb(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Eb:mb(a)>=mb(b)?0>a?Fb:Gb:0>b?Hb:Ib}function H(a,b,c){c||(c=Mb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Mb);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Nb)+I(a[1],a[0],Nb)}function K(a,b){return H(b[0],b[1],Nb)/H(a[0],a[1],Nb)}function L(){this.evEl=Pb,this.evWin=Qb,this.allow=!0,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Tb,this.evWin=Ub,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=Wb,this.evWin=Xb,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Cb|Db)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=Zb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ab|Bb)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ab)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Cb|Db)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a)}function S(a,b){this.manager=a,this.set(b)}function T(a){if(p(a,dc))return dc;var b=p(a,ec),c=p(a,fc);return b&&c?dc:b||c?b?ec:fc:p(a,cc)?cc:bc}function U(a){this.options=hb({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=gc,this.simultaneous={},this.requireFail=[]}function V(a){return a&lc?"cancel":a&jc?"end":a&ic?"move":a&hc?"start":""}function W(a){return a==Ib?"down":a==Hb?"up":a==Fb?"left":a==Gb?"right":""}function X(a,b){var c=b.manager;return c?c.get(a):a}function Y(){U.apply(this,arguments)}function Z(){Y.apply(this,arguments),this.pX=null,this.pY=null}function $(){Y.apply(this,arguments)}function _(){U.apply(this,arguments),this._timer=null,this._input=null}function ab(){Y.apply(this,arguments)}function bb(){Y.apply(this,arguments)}function cb(){U.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function db(a,b){return b=b||{},b.recognizers=l(b.recognizers,db.defaults.preset),new eb(a,b)}function eb(a,b){this.options=hb({},db.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.element=a,this.input=y(this),this.touchAction=new S(this,this.options.touchAction),fb(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function fb(a,b){var c=a.element;c.style&&g(a.options.cssProps,function(a,d){c.style[u(c.style,d)]=b?a:""})}function gb(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var hb,ib=["","webkit","Moz","MS","ms","o"],jb=b.createElement("div"),kb="function",lb=Math.round,mb=Math.abs,nb=Date.now;hb="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var ob=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),pb=h(function(a,b){return ob(a,b,!0)},"merge","Use `assign`."),qb=1,rb=/mobile|tablet|ip(ad|hone|od)|android/i,sb="ontouchstart"in a,tb=u(a,"PointerEvent")!==d,ub=sb&&rb.test(navigator.userAgent),vb="touch",wb="pen",xb="mouse",yb="kinect",zb=25,Ab=1,Bb=2,Cb=4,Db=8,Eb=1,Fb=2,Gb=4,Hb=8,Ib=16,Jb=Fb|Gb,Kb=Hb|Ib,Lb=Jb|Kb,Mb=["x","y"],Nb=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Ob={mousedown:Ab,mousemove:Bb,mouseup:Cb},Pb="mousedown",Qb="mousemove mouseup";i(L,x,{handler:function(a){var b=Ob[a.type];b&Ab&&0===a.button&&(this.pressed=!0),b&Bb&&1!==a.which&&(b=Cb),this.pressed&&this.allow&&(b&Cb&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:xb,srcEvent:a}))}});var Rb={pointerdown:Ab,pointermove:Bb,pointerup:Cb,pointercancel:Db,pointerout:Db},Sb={2:vb,3:wb,4:xb,5:yb},Tb="pointerdown",Ub="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Tb="MSPointerDown",Ub="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Rb[d],f=Sb[a.pointerType]||a.pointerType,g=f==vb,h=r(b,a.pointerId,"pointerId");e&Ab&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Cb|Db)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Vb={touchstart:Ab,touchmove:Bb,touchend:Cb,touchcancel:Db},Wb="touchstart",Xb="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Vb[a.type];if(b===Ab&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Cb|Db)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:vb,srcEvent:a})}}});var Yb={touchstart:Ab,touchmove:Bb,touchend:Cb,touchcancel:Db},Zb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=Yb[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:vb,srcEvent:a})}}),i(R,x,{handler:function(a,b,c){var d=c.pointerType==vb,e=c.pointerType==xb;if(d)this.mouse.allow=!1;else if(e&&!this.mouse.allow)return;b&(Cb|Db)&&(this.mouse.allow=!0),this.callback(a,b,c)},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var $b=u(jb.style,"touchAction"),_b=$b!==d,ac="compute",bc="auto",cc="manipulation",dc="none",ec="pan-x",fc="pan-y";S.prototype={set:function(a){a==ac&&(a=this.compute()),_b&&this.manager.element.style&&(this.manager.element.style[$b]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),T(a.join(" "))},preventDefaults:function(a){if(!_b){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,dc),f=p(d,fc),g=p(d,ec);if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}if(!g||!f)return e||f&&c&Jb||g&&c&Kb?this.preventSrc(b):void 0}},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var gc=1,hc=2,ic=4,jc=8,kc=jc,lc=16,mc=32;U.prototype={defaults:{},set:function(a){return hb(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=X(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=X(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=X(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=X(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;jc>d&&b(c.options.event+V(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=jc&&b(c.options.event+V(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=mc)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(mc|gc)))return!1;a++}return!0},recognize:function(a){var b=hb({},a);return k(this.options.enable,[this,b])?(this.state&(kc|lc|mc)&&(this.state=gc),this.state=this.process(b),void(this.state&(hc|ic|jc|lc)&&this.tryEmit(b))):(this.reset(),void(this.state=mc))},process:function(){},getTouchAction:function(){},reset:function(){}},i(Y,U,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(hc|ic),e=this.attrTest(a);return d&&(c&Db||!e)?b|lc:d||e?c&Cb?b|jc:b&hc?b|ic:hc:mc}}),i(Z,Y,{defaults:{event:"pan",threshold:10,pointers:1,direction:Lb},getTouchAction:function(){var a=this.options.direction,b=[];return a&Jb&&b.push(fc),a&Kb&&b.push(ec),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Jb?(e=0===f?Eb:0>f?Fb:Gb,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Eb:0>g?Hb:Ib,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return Y.prototype.attrTest.call(this,a)&&(this.state&hc||!(this.state&hc)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=W(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i($,Y,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[dc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&hc)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(_,U,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[bc]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Cb|Db)&&!f)this.reset();else if(a.eventType&Ab)this.reset(),this._timer=e(function(){this.state=kc,this.tryEmit()},b.time,this);else if(a.eventType&Cb)return kc;return mc},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===kc&&(a&&a.eventType&Cb?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=nb(),this.manager.emit(this.options.event,this._input)))}}),i(ab,Y,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[dc]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&hc)}}),i(bb,Y,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Jb|Kb,pointers:1},getTouchAction:function(){return Z.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Jb|Kb)?b=a.overallVelocity:c&Jb?b=a.overallVelocityX:c&Kb&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&mb(b)>this.options.velocity&&a.eventType&Cb},emit:function(a){var b=W(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(cb,U,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[cc]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ab&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Cb)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=kc,this.tryEmit()},b.interval,this),hc):kc}return mc},failTimeout:function(){return this._timer=e(function(){this.state=mc},this.options.interval,this),mc},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==kc&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),db.VERSION="2.0.6",db.defaults={domEvents:!1,touchAction:ac,enable:!0,inputTarget:null,inputClass:null,preset:[[ab,{enable:!1}],[$,{enable:!1},["rotate"]],[bb,{direction:Jb}],[Z,{direction:Jb},["swipe"]],[cb],[cb,{event:"doubletap",taps:2},["tap"]],[_]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var nc=1,oc=2;eb.prototype={set:function(a){return hb(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?oc:nc},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&kc)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===oc||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(hc|ic|jc)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof U)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this},off:function(a,b){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this},emit:function(a,b){this.options.domEvents&&gb(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&fb(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},hb(db,{INPUT_START:Ab,INPUT_MOVE:Bb,INPUT_END:Cb,INPUT_CANCEL:Db,STATE_POSSIBLE:gc,STATE_BEGAN:hc,STATE_CHANGED:ic,STATE_ENDED:jc,STATE_RECOGNIZED:kc,STATE_CANCELLED:lc,STATE_FAILED:mc,DIRECTION_NONE:Eb,DIRECTION_LEFT:Fb,DIRECTION_RIGHT:Gb,DIRECTION_UP:Hb,DIRECTION_DOWN:Ib,DIRECTION_HORIZONTAL:Jb,DIRECTION_VERTICAL:Kb,DIRECTION_ALL:Lb,Manager:eb,Input:x,TouchAction:S,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:U,AttrRecognizer:Y,Tap:cb,Pan:Z,Swipe:bb,Pinch:$,Rotate:ab,Press:_,on:m,off:n,each:g,merge:pb,extend:ob,assign:hb,inherit:i,bindFn:j,prefixed:u});var pc="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};pc.Hammer=db,"function"==typeof define&&define.amd?define(function(){return db}):"undefined"!=typeof module&&module.exports?module.exports=db:a[c]=db}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.map
!function() {

	var scrolled = false,
		timeout;

	$(window).on("scroll", function(ev) {
		scrolled = true;

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(function() {
			scrolled = false;
		}, 100);
	});

	function pan(opts) {

		var options = Hammer.assign({
			Pan: {
				direction: Hammer.DIRECTION_HORIZONTAL,
				threshold: 5
			},
			Tap: {},
			container: {
				size: 70,
			},
			block: null,
			target: $('#navbar'),
			width: 70,
			start: 0,
			onStep: function() {},
			onTap: function() {}
		}, opts);

		if (options.reverse) {
			options.width = -options.width;
		}

		var instance = new Hammer.Manager(options.elms[0], {
			recognizers: [
				[Hammer.Pan, options.Pan],
				[Hammer.Tap, options.Tap]
			]
		});

		instance.on("panstart", function(ev) {
			var $target = $(ev.target);

			if (options.block) {
				if (scrolled || options.block.data("hammer.pan") && options.block.data("hammer.pan").options.isMoving === 1) {
					return;
				}
				if (TouchUI.prototype.scroll.iScrolls.body && TouchUI.prototype.scroll.iScrolls.body.directionLocked === "v") {
					return;
				}
			}

			if(options.target[0] === 'target') {
				options.elm = $target.parents(options.target[1]).get(0) || false;
				options.elm = (!options.elm && $target.is(options.target[1])) ? $target[0] : options.elm;
				options.width = ($(options.elm).find('.action-buttons').children().length < 5) ? 106 : 219;

				if (options.reverse) {
					options.width = -options.width;
				}
			} else {
				options.elm = options.target.get(0) || false;
			}

			$(options.elm).removeClass('animate');
		});

		instance.on("panmove panend pancancel", function(ev) {

			if (options.block) {
				if (scrolled || options.block.data("hammer.pan") && options.block.data("hammer.pan").options.isMoving === 1) {
					return;
				}
				if (TouchUI.prototype.scroll.iScrolls.body && TouchUI.prototype.scroll.iScrolls.body.directionLocked === "v") {
					return;
				}
			}

			if(options.elm) {
				var start = $(options.elm).data("panStart") || 0;
				var percent = (100 / options.container.size) * ev.deltaX;
				var pos = (options.container.size / 100) * percent;
				pos = (!start) ? pos : start + pos;

				if (ev.type == 'panend' || ev.type == 'pancancel') {
					if (!start) {
						pos = (pos > (options.width * 0.4)) ? options.width : 0;
					} else {
						pos = (pos < (options.width * 0.6)) ? 0 : options.width;
					}

					if (options.reverse) {
						pos = (!pos) ? options.width : 0;
					}
					$(options.elm).data("panStart", pos);
				}

				if (!options.reverse) {
					pos = Math.max(0, Math.min(options.width, pos));
				} else {
					pos = Math.max(options.width, Math.min(0, pos));
				}

				if (pos < -options.Pan.threshold || pos > options.Pan.threshold) {
					instance.set({ isMoving: 1 });
				}

				options.onStep.call(instance, pos, options.elm, ev);

				if (ev.type == 'panend' || ev.type == 'pancancel') {
					setTimeout(function() {
						instance.set({ isMoving: 0 });
					}, 10);
				}
			}

		});

		instance.on("tap", function(ev) {
			options.onTap.call(instance, ev, options.elm);
		});

		$(options.elms[0]).data("hammer.pan", instance);

	};

	$.fn.hammerPan = function(options) {
		options.elms = this;
		new pan(options);
		return this;
	};

}();

ko.bindingHandlers.circle = {
	maths: function(actual, target) {

		if( target && target > 1 ) {
			return { progress: actual / target, target: target };
		} else if( !target && actual ) {
			return { progress: actual };
		}

		return { progress: 0 };

	},
	init: function(element, bindings, allBindings, viewModel, bindingContext) {
		var total = ko.bindingHandlers.circle.maths(bindings().actual(), bindings().target());
		var color = $("#navbar").css("background-color");

		$(element).circleProgress({
				value: 0.001,
				arcCoef: 0.7,
				size: 100,
				thickness: 8,
				lineCap: 'round',
				fill: { color: color }
			})
			.data("targetTemp", total.progress)
			.on("changed", function(e, value) {
				if (!value) {
					bindingContext.$parent.setTargetToZero(viewModel);
				} else {
					viewModel.newTarget(value);
					bindingContext.$parent.setTarget(viewModel);
				}
			});

	},
	update: function(element, bindings) {
		var $elm = $(element);
		var total = ko.bindingHandlers.circle.maths(bindings().actual(), bindings().target());
		var target = parseFloat($elm.data("targetTemp"));
		var setTo = (total.target) ? total.progress : (target) ? total.progress / target : 0;

		if (total.target) {
			$elm.data("targetTemp", total.target);
		}

		if (TouchUI.prototype.settings.colors) {
			$elm.data('circle-progress').arcFill = TouchUI.prototype.settings.colors.mainColor();
		}

		$elm.circleProgress('value', setTo)

	}
};

// Arc layout
$.circleProgress.defaults.arcCoef = 0.5; // range: 0..1
$.circleProgress.defaults.startAngle = 0.5 * Math.PI;

$.circleProgress.defaults.drawArc = function(v) {
	var ctx = this.ctx,
		r = this.radius,
		t = this.getThickness(),
		c = this.arcCoef,
		a = this.startAngle + (1 - c) * Math.PI;

	v = Math.max(0, Math.min(1, v));

	ctx.save();
	ctx.beginPath();

	if (!this.reverse) {
		ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI * v);
	} else {
		ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI, a + 2 * c * (1 - v) * Math.PI, a);
	}

	ctx.lineWidth = t;
	ctx.lineCap = this.lineCap;
	ctx.strokeStyle = this.arcFill;
	ctx.stroke();
	ctx.restore();
};

$.circleProgress.defaults.drawEmptyArc = function(v) {
	var ctx = this.ctx,
		r = this.radius,
		t = this.getThickness(),
		c = this.arcCoef,
		a = this.startAngle + (1 - c) * Math.PI;

	v = Math.max(0, Math.min(1, v));

	if (v < 1) {
		ctx.save();
		ctx.beginPath();

		if (v <= 0) {
			ctx.arc(r, r, r - t / 2, a, a + 2 * c * Math.PI);
		} else {
			if (!this.reverse) {
				ctx.arc(r, r, r - t / 2, a + 2 * c * Math.PI * v, a + 2 * c * Math.PI);
			} else {
				ctx.arc(r, r, r - t / 2, a, a + 2 * c * (1 - v) * Math.PI);
			}
		}

		ctx.lineWidth = t;
		ctx.lineCap = this.lineCap;
		ctx.strokeStyle = this.emptyFill;
		ctx.stroke();
		ctx.restore();
	}
};

$(function() {
	var namespace = ".touchui.dropdown";

	$(document)
		.off('.dropdown')
		.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
		.on('click.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
			var $dropdownToggle = $(e.currentTarget);
			var $dropdownContainer = $dropdownToggle.parent();
			var $dropdownMenu = $dropdownContainer.children('.dropdown-menu');

			// Stop the hashtag from propagating
			e.preventDefault();

			// Toggle the targeted dropdown
			$dropdownContainer.toggleClass("open");

			// Refresh current scroll and add a min-height so we can reach the dropdown if needed
			// self.components.dropdown.containerMinHeight.call(self, $dropdownContainer, $dropdownToggle);

			// Skip everything if we are in a dropdown toggling a dropdown (one click event is enuff!)
			if( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) {
				return;
			}

			if( $dropdownContainer.is('#all_touchui_settings') ) {
				$('#navbar').toggleClass("open");
			}

			// Remove all other active dropdowns
			$('.open [data-toggle="dropdown"]').not($dropdownToggle).parent().removeClass('open');

			// Notify main TouchUI scope
			$(document).trigger("dropdown-open.touchui", [$dropdownMenu, $dropdownToggle]);

			// Check if we scrolled (touch devices wont trigger this click event after scrolling so assume we didn't move)
			$(document).off("click"+namespace).on("click"+namespace, function(eve) {
				var moved = ( !TouchUI.prototype.settings.hasTouch ) ? TouchUI.prototype.scroll.currentActive.moved : false,
					$target = $(eve.target);

				if (
					!moved && // If scrolling did not move
					!$target.parents(".ui-pnotify").length && // if not a click within notifiaction
					(
						!$target.parents().is($dropdownContainer) || // if clicks are not made within the dropdown container
						$target.is('a:not([data-toggle="dropdown"])') || // Unless it's a link but not a [data-toggle]
						$target.parent().is('a:not([data-toggle="dropdown"])')
					)
				) {
					$(document).off(eve);
					$dropdownContainer.removeClass('open');
					$dropdownMenu.removeAttr('style');

					if( $dropdownContainer.is('#all_touchui_settings') ) {
						$('#navbar').removeClass("open");
					}

					$(document).trigger("dropdown-closed.touchui");
				}
			});
		});

});

ko.bindingHandlers.slider = {
	init: function(element, bindings, allBindings, viewModel, bindingContext) {
		if(!bindingContext.$data.key) return;

		$(element).touchuiSlider({
				isBed: (bindingContext.$data.key() === "bed"),
				max: bindings().max,
				steps: bindings().steps,
				value: bindings().value(),
				enable: bindings().enable,
				points: [
					{name: "", bed: 0, extruder: 0},
					{name: "", bed: bindings().max, extruder: bindings().max}
				].concat(bindingContext.$root.temperature_profiles())
			})
			.on("changed", function(e, value) {
				bindings().value(value);
			});
	},
	update: function(element, bindings, allBindings, viewModel, bindingContext) {
		if(!bindingContext.$data.key) return;

		$(element).touchuiSlider('value', bindings().value());

		if(bindings().enable) {
			$(element).touchuiSlider('enable', true);
		} else {
			$(element).touchuiSlider('enable', false);
		}
	}
};

(function($) {

	function decimalAdjust(value, inc) {
		return Math.ceil(value/inc)*inc;
	}

	function Slider(config) {
		this.startup(config);
		this.init();
	}

	Slider.prototype = {

		parent: "#dashboard > .inner",
		steps: 0.4,
		value: 0,
		initValue: 0,

		startup: function(config) {
			$.extend(this, config);

			var self = this;
			var start = false;
			var namespace = ".touchui.slider";

			this.initValue = this.value;

			this.$slider = $('<div class="slidert"></div>').insertBefore(this.$elm);
			this.$grid = $('<div class="grid"></div>').appendTo(this.$slider);
			this.$hightlight = $('<div class="highlight"></div>').appendTo(this.$grid);
			this.$input = $('<div class="input"><input type="number"></div>')
				.appendTo(this.$slider)
				.find('input')
				.on("change", function(e) {
					self.setValue(self.$input.val());
				})
				.val(self.value);

			this.$confirm = $('<div class="confirm"></div>')
				.appendTo(this.$hightlight)
				.on("click", function() {
					self.$elm.trigger("changed", self.value);
					self.$slider.removeClass('confirmValue');
				});

			this.$error = $('<div class="error"></div>')
				.appendTo(this.$hightlight)
				.on("click", function() {
					self.$slider.removeClass('confirmValue');
				});

			this.$fake = $('<div class="fake"></div>').appendTo(this.$grid)
				.on("click"+namespace, function(e) {
					var progress = (e.offsetX / self.$fake.width()) * self.max;
					self.setValue(Math.round(progress));
					self.confirmValue();
				});

			this.$knob = $('<div class="knob"></div>')
				.appendTo(this.$grid)
				.on("mousedown"+namespace+" touchstart"+namespace, function(e) {
					var width = parseFloat(self.$grid.width());
					try {
						start = e.pageX || e.originalEvent.targetTouches[0].pageX;
					} catch(err) {}

					var startPoint = ((parseFloat(self.$knob.css("left")) || 0) / width) * 100;

					$(document)
						.on("mousemove"+namespace+" touchmove"+namespace, function(e) {
							if(start) {
								try {
									e.preventDefault();
									self.$knob.addClass("focus");

									var current = e.pageX || e.originalEvent.targetTouches[0].pageX;
									var progress = ((current - start) / width) * 100;

									progress = decimalAdjust(parseFloat(progress + startPoint), self.steps) || 0;

									self.setValue(Math.round(self.max * (progress / 100)));

								} catch(err) {}
							}

						})
						.on("mouseup"+namespace+" touchend"+namespace, function(e) {
							self.$knob.removeClass("focus");
							start = false;
							$(document).off(namespace);

							self.confirmValue();
						});
				});

				_.each(self.points, function(elm) {
					$('<div class="hotpoint"><span>'+elm.name+'</span></div>')
						.appendTo(self.$grid)
						.css('left', (((self.isBed) ? elm.bed / self.max : elm.extruder / self.max) * 100)+"%")
						.on('click', function() {
							self.setValue((self.isBed) ? elm.bed : elm.extruder);
							self.confirmValue();
						});
				});

				self.setValue(self.value);

		},

		init: function() {
			var self = this;
			var $elm = this.$elm;
			var $slider = this.$slider;
			var namespace = ".touchui.slider-click";

			$elm
				.off("click"+namespace)
				.on("click"+namespace, function(e) {

					$('.slidert')
						.removeClass('done')
						.removeClass('active')
						.removeClass('moving');

					$('.circle.active')
						.removeClass('active');

					$slider
						.addClass('moving');

					self.setPosition();

					setTimeout(function() {

						$slider.removeClass('moving');
						$elm.addClass('active');

						$slider
							.addClass('active')
							.one("animationend webkitAnimationEnd oAnimationEnd", function() {
								$slider.css({
									left: 0,
									right: 0
								});
							})
							.one("transitionend webkitTransitionEnd oTransitionEnd", function() {
								$slider.addClass('done');
							});

						$(document).on("mousedown"+namespace+" touchstart"+namespace, function(e) {
							if (!$(e.target).is(self.$slider) && $(e.target).parents('.slidert.active').length === 0) {
								$('.slidert.active').removeClass('active');
								$('.circle.active').removeClass('active');

								$(document).off(namespace);
								$(window).off(namespace);
							}
						});

						$(window).on("resize"+namespace, function() {
							self.setPosition(true);
						});

					}, 10);
				});

			self.setEnable(self.enable);
		},

		confirmValue: function() {
			this.$slider.addClass('confirmValue');
		},

		setPosition: function(topOnly) {
			var offset = this.$elm.position();
			offset.right = $(this.parent).outerWidth() - (offset.left + this.$elm.outerWidth());

			if(topOnly) {
				delete offset.right;
				delete offset.left;
			}

			this.$slider.css(offset);
		},

		setValue: function(value) {
			value = Math.max(0, Math.min(value, this.max));

			this.$knob.css('left', ((value / this.max) * 100) + "%");
			this.$hightlight.width(((value / this.max) * 100) + "%");
			// this.$label.find('span').text(value);
			this.$input.val(value);
			this.value = value;
		},

		setEnable: function(enable) {

			if (enable) {
				this.$slider.removeClass("disabled");
			} else {
				this.$slider.addClass("disabled");
			}

			self.enable = enable;
		},

		cofirmValue: function() {
			this.$elm.trigger("changed", this.value);
		}

	};

	$.fn.touchuiSlider = function(configOrCommand, commandArgument) {
		var dataName = 'slider',
			firstInstance = this.data(dataName);

		if (configOrCommand == 'value') {
			if (!firstInstance)
				throw Error('Calling "value" method on not initialized instance is forbidden');
			if (typeof commandArgument == 'undefined') {
				return firstInstance.getValue();
			} else {
				var newValue = arguments[1];
				return this.each(function() {
					var instance = $(this).data(dataName);

					if(instance.initValue === newValue) return;
					instance.initValue = newValue;
					instance.setValue(newValue);
				});
			}
		}

		if (configOrCommand == 'enable') {
			if (!firstInstance)
				throw Error('Calling "value" method on not initialized instance is forbidden');
			if (typeof commandArgument == 'undefined') {
				return firstInstance.enable;
			} else {
				var newValue = arguments[1];
				return this.each(function() {
					return $(this).data(dataName).setEnable(newValue);
				});
			}
		}

		return this.each(function() {
			var el = $(this),
				instance = el.data(dataName),
				config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

			if (instance) {
				instance.init(config);
			} else {
				var initialConfig = $.extend({}, el.data());
				config = $.extend(initialConfig, config);
				config.$elm = el;
				instance = new Slider(config);
				el.data(dataName, instance);
			}
		});
	};

})(jQuery);
