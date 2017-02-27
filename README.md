# gesture

使用方式

``` js
const Gestrue = require('Gestrue')
new Gestrue('.container') //监听第一个出现的container容器,默认是body,如果container是类名或者标签则选择第一个

// 然后在此元素下,或者当前元素上面触发的手势事件都会被监听

document.querySelector('.child').addEventListener('pan', function(){
	console.log('paning...')
})

// or

$('.child').on('pan', function(){
	console.log('paning...')
})

```