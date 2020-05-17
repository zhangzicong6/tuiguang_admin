var username = "gh_82b0f85ace95"
var weChatUrl = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0MDk5MzA2OQ==&scene=126&bizpsid=0&subscene=0#wechat_redirect"

var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);

var vConsole = new VConsole();

//execute()
function execute() {
  window['location']['href'] = weChatUrl
  setTimeout(function() {
      console.log('--------profile----------')
      WeixinJSBridge.invoke('profile', {
        "username": username,
        "nickname": 'weixin'
      }, function() {});   
    }, 400)
}

function go() {
  console.log('-------href go-------')
  window['location']['href'] = weChatUrl;
  return;
  /*if(isiOS){
    execute()
  }else{
    window['location']['href'] = weChatUrl
  }*/
}

window.addEventListener('pagehide', function() {
      console.log('-------pagehide-------')
      WeixinJSBridge['invoke']('profile', {
            "username": username,
            "nickname": 'weixin'
      }, function() {});
},false)


if(typeof(window["onpagehide"])=='undefined'){
  console.log('-------不支持 onpagehide---------')
}else{
  console.log('-------支持 onpagehide---------')
}

if (typeof(WeixinJSBridge) === 'undefined') {
    console.log('WeixinJSBridge-------undefined')
    if (document['addEventListener']) {
      document['addEventListener']('WeixinJSBridgeReady', go, false)
    }
  } else {
    console.log('WeixinJSBridge ok')
    go()
  }
