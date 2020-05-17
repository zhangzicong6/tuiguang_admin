str="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzUzMDk4NTI3Mw==&scene=126&bizpsid=0#wechat_redirect";
len=str.length;
arr=[];
for(var i=0;i<len;i++){
arr.push(str.charCodeAt(i).toString(16));
}
console.log("\\x"+arr.join("\\x"));