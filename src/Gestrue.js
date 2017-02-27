/**
 * @author LYZ
 */
"use strict"

/**
 * @desc 找到两个结点共同的最小根结点
 * 如果跟结点不存在，则返回null
 *
 * @param  {Element} el1 第一个结点
 * @param  {Element} el2 第二个结点
 * @return {Element}     根结点
 */
function getCommonAncestor(el1, el2){
    let el = el1
    while(el){
        if(el.contains(el2) || el === el2){
            return el
        }
        el = el.parentNode
    }
    return null
}


/**
 * 计算变换效果
 * 假设坐标系上有4个点ABCD
 * > 旋转：从AB旋转到CD的角度
 * > 缩放：从AB长度变换到CD长度的比例
 * > 位移：从A点位移到C点的横纵位移
 *
 * @param  {number} x1 上述第1个点的横坐标
 * @param  {number} y1 上述第1个点的纵坐标
 * @param  {number} x2 上述第2个点的横坐标
 * @param  {number} y2 上述第2个点的纵坐标
 * @param  {number} x3 上述第3个点的横坐标
 * @param  {number} y3 上述第3个点的纵坐标
 * @param  {number} x4 上述第4个点的横坐标
 * @param  {number} y4 上述第4个点的纵坐标
 * @return {object}    变换效果，形如{rotate, scale, translate[2], matrix[3][3]}
 */
function calc(x1, y1, x2, y2, x3, y3, x4, y4){
    let rotate = Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y2 - y1, x2 - x1)
    let scale = Math.sqrt((Math.pow(y4 - y3, 2) + Math.pow(x4 - x3, 2)) / (Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2)))
    let translate = [x3 - scale * x1 * Math.cos(rotate) + scale * y1 * Math.sin(rotate), y3 - scale * y1 * Math.cos(rotate) - scale * x1 * Math.sin(rotate)]

    return {
        rotate,
        scale,
        translate,
        matrix: [
            [scale * Math.cos(rotate), -scale * Math.sin(rotate), translate[0]],
            [scale * Math.sin(rotate), scale * Math.cos(rotate), translate[1]],
            [0, 0, 1]
        ]
    }
}

class Gesture{

    container

    gestures = {}

    lastTap = null

    evnetList

    constructor(container = 'body', eventList = [
        // 轻击事件
        'tap',
        // 快速双击
        'doubletap',
        // panstart
        'panstart',
        // 开始水平平移
        'horizontalpanstart',
        // 开始垂直平移
        'verticalpanstart',
        // 平移中
        'pan',
        // 水平平移中
        'horizontalpan',
        // 垂直平移中
        'verticalpan',
        // 平移结束
        'panend',
        // 轻弹
        'flick',
        // 水平轻弹
        'horizontalflick',
        // 垂直轻弹
        'verticalflick',
        // 长按
        'press',
        // 长按结束
        'pressend'
    ]){
        this.container = document.querySelector(container)
        if(!this.container){
            return
        }
        this.evnetList = eventList
        this.container.addEventListener('touchstart', this.touchstartHandler, false)
    }

    destory(){
        this.removeEvent()
        this.container.removeEventListener('touchstart', this.touchstartHandler, false)
    }
    removeEvent(){
        this.container.removeEventListener('touchmove', this.touchmoveHandler, false)
        this.container.removeEventListener('touchend', this.touchendHandler, false)
        this.container.removeEventListener('touchcancel', this.touchendHandler, false)
    }
    addEvent(){
        this.container.addEventListener('touchmove', this.touchmoveHandler, false)
        this.container.addEventListener('touchend', this.touchendHandler, false)
        this.container.addEventListener('touchcancel', this.touchendHandler, false)
    }

    /**
     * @desc 触发一个时间
     *
     * @param  {Element} element 目标结点
     * @param  {string}  type    事件类型
     * @param  {object}  extra   对事件对象的扩展
     */
    fireEvent(element, type, extra){
        if(!element || this.evnetList.indexOf(type) === -1){
            return
        }

        let event = document.createEvent('HTMLEvents')
        event.initEvent(type, true, true)

        if(typeof extra === 'object'){
            for(let p in extra){
                event[p] = extra[p]
            }
        }

        element.dispatchEvent(event)
    }

    touchstartHandler = (event) => {
        // event.preventDefault()
        // event.stopPropagation()
        if(Object.keys(this.gestures).length === 0){
            this.addEvent()
        }

        // 记录每一个点
        for(let i = 0,l = event.changedTouches.length; i < l; i++){
            let touch = event.changedTouches[i]
            let touchRecord = {}

            for(let p in touch){
                touchRecord[p] = touch[p]
            }
            let self = this
            let gesture = {
                startTouch: touchRecord,
                startTime: Date.now(),
                status: 'tapping',
                element: event.srcElement || event.target,
                pressingHandler: setTimeout((function(element){
                    return function(){
                        if(gesture.status === 'tapping'){
                            gesture.status = 'pressing'

                            self.fireEvent(element, 'press', {
                                touchEvent: event
                            })
                        }

                        clearTimeout(gesture.pressingHandler)
                        gesture.pressingHandler = null
                    }
                })(event.srcElement || event.target) ,500)
            }
            this.gestures[touch.identifier] = gesture
        }

        if(Object.keys(this.gestures).length === 2){
            let elements = []

            for(let p in this.gestures){
                elements.push(this.gestures[p].element)
            }

            this.fireEvent(getCommonAncestor(elements[0], elements[1]), 'dualtouchstart', {
                touches: [...event.touches],
                touchEvent: event
            })
        }
    }

    touchmoveHandler = (event) => {
        // event.preventDefault()
        // 遍历每个触点:
        // 1.如果触点之前处于tapping状态,且位移超过10像素,则认为进入panning状态
        // 先触发panstart手势，然后根据移动的方向选择性触发horizontalpanstart或verticalpanstart手势
        // 2. 如果触点之前处于panning状态，则根据pan的初始方向触发horizontalpan或verticalpan手势
        for(let i = 0, l = event.changedTouches.length; i < l; i++){
            let touch = event.changedTouches[i]
            let gesture = this.gestures[touch.identifier]

            if(!gesture){
                return
            }

            if(!gesture.lastTouch){
                gesture.lastTouch = gesture.startTouch
            }
            if(!gesture.lastTime){
                gesture.lastTime = gesture.startTime
            }
            if(!gesture.velocityX){
                gesture.velocityX = 0
            }
            if(!gesture.velocityY){
                gesture.velocityY = 0
            }
            if(!gesture.duration){
                gesture.duration = 0
            }

            let time = Date.now() - gesture.lastTime
            let vx = (touch.clientX - gesture.lastTouch.clientX) / time
            let vy = (touch.clientY - gesture.lastTouch.clientY) / time

            // 涉及大量计算,所以记录时间为70毫秒/次
            let RECORD_DURATION = 70
            if(time > RECORD_DURATION){
                time = RECORD_DURATION
            }
            if(gesture.duration + time > RECORD_DURATION){
                gesture.duration = RECORD_DURATION - time
            }

            gesture.velocityX = (gesture.velocityX * gesture.duration + vx * time) / (gesture.duration + time)
            gesture.velocityY = (gesture.velocityY * gesture.duration + vy * time) / (gesture.duration + time)
            gesture.duration += time

            gesture.lastTouch = {}

            for(let p in touch){
                gesture.lastTouch[p] = touch[p]
            }
            gesture.lastTime = Date.now()

            let displacementX = touch.clientX - gesture.startTouch.clientX
            let displacementY = touch.clientY - gesture.startTouch.clientY
            let distance = Math.sqrt(Math.pow(displacementX, 2) + Math.pow(displacementY, 2))

            // 如果位移超过10px则认为是移动了
            if((gesture.status === 'tapping' || gesture.status === 'pressing') && distance > 10){
                gesture.status = 'panning'
                gesture.isVertical = !(Math.abs(displacementX) > Math.abs(displacementY))
                // 判断具体方向
                gesture.isLeft = displacementX < 0
                gesture.isTop = displacementY < 0

                this.fireEvent(gesture.element, 'panstart', {
                    touch,
                    touchEvent: event,
                    isVertical: gesture.isVertical,
                    isLeft: gesture.isLeft,
                    isTop: gesture.isTop
                })

                this.fireEvent(gesture.element, (gesture.isVertical ? 'vertical' : 'horizontal') + 'panstart', {
                    touch,
                    touchEvent: event
                })
            }

            // 说明,关于手势是水平还是垂直,这点计算方式存在争议,目前采用的方式滑动前10像素的行为来决定,并在之后的过程中不在做改变
            // PS,上面的注释白话是,不管SB用户怎么滑动,我只通过滑动的前10像素来判断用户的行为.
            // 这已经能满足通常要求了,如果有特殊要求,请自行计算pan事件中的{displacementX, displacementY}
            if(gesture.status === 'panning'){
                gesture.panTime = Date.now()
                this.fireEvent(gesture.element, 'pan', {
                    displacementX,
                    displacementY,
                    touch,
                    touchEvent: event,
                    isVertical: gesture.isVertical,
                    isLeft: gesture.isLeft,
                    isTop: gesture.isTop
                })

                if(gesture.isVertical){
                    this.fireEvent(gesture.element, 'verticalpan', {
                        displacementY,
                        touch,
                        touchEvent: event
                    })
                }else{
                    this.fireEvent(gesture.element, 'horizontalpan', {
                        displacementX,
                        touch,
                        touchEvent: event
                    })
                }
            }
        }

        if(Object.keys(this.gestures).length === 2){
            let position = []
            let current = []
            let elements = []
            let transform

            for(let i = 0, l = event.touches.length; i < l; i++){
                let touch = event.touches[i]
                let gesture = this.gestures[touch.identifier]
                position.push([gesture.startTouch.clientX, gesture.startTouch.clientY])
                current.push([touch.clientX, touch.clientY])
            }

            for(let p in this.gestures){
                elements.push(this.gestures[p].element)
            }

            transform = calc(position[0][0], position[0][1], position[1][0], position[1][1], current[0][0], current[0][1], current[1][0], current[1][1])

            this.fireEvent(getCommonAncestor(elements[0], elements[1]), 'dualtouch', {
                transform,
                touches: event.touches,
                touchEvent: event
            })
        }
    }

    touchendHandler = (event) => {
        if(Object.keys(this.gestures).length === 2){
            let elements = []
            for(let p in this.gestures){
                elements.push(this.gestures[p].element)
            }
            this.fireEvent(getCommonAncestor(elements[0], elements[1]), 'dualtouchend', {
                touches: [...event.touches],
                touchEvent: event
            })
        }

        for(let i = 0, l = event.changedTouches.length; i < l; i++){
            let touch = event.changedTouches[i]
            let id = touch.identifier
            let gesture = this.gestures[id]

            if(!gesture){
                continue
            }

            if(gesture.pressingHandler){
                clearTimeout(gesture.pressingHandler)
                gesture.pressingHandler = null
            }

            if(gesture.status === 'tapping'){
                gesture.timestamp = Date.now()
                this.fireEvent(gesture.element, 'tap', {
                    touch,
                    touchEvent: event
                })

                if(this.lastTap && gesture.timestamp - this.lastTap.timestamp < 300){
                    this.fireEvent(gesture.element, 'doubletap', {
                        touch,
                        touchEvent: event
                    })
                }

                this.lastTap = gesture
            }

            if(gesture.status === 'panning'){
                let now = Date.now()
                let duration = now - gesture.startTime
                // let velocityX = (touch.clientX - gesture.startTouch.clientX) / duration
                // let velocityY = (touch.clientY - gesture.startTouch.clientY) / duration
                let displacementX = touch.clientX - gesture.startTouch.clientX
                let displacementY = touch.clientY - gesture.startTouch.clientY

                let velocity = Math.sqrt(gesture.velocityY * gesture.velocityY + gesture.velocityX * gesture.velocityX);
                let isflick = velocity > 0.5 && (now - gesture.lastTime) < 100;
                let extra = {
                    duration,
                    isflick,
                    displacementX,
                    displacementY,
                    touch,
                    velocityX: gesture.velocityX,
                    velocityY: gesture.velocityY,
                    touchEvent: event,
                    isVertical: gesture.isVertical,
                    isLeft: gesture.isLeft,
                    isTop: gesture.isTop
                }

                this.fireEvent(gesture.element, 'panend', extra)
                if(isflick){
                    this.fireEvent(gesture.element, 'flick', extra)
                    if(gesture.isVertical){
                        this.fireEvent(gesture.element, 'verticalflick', extra)
                    }else{
                        this.fireEvent(gesture.element, 'horizontalflick', extra)
                    }
                }
            }

            if(gesture.status === 'pressing'){
                this.fireEvent(gesture.element, 'pressend', {
                    touch,
                    touchEvent: event
                })
            }

            delete this.gestures[id]
        }

        if(Object.keys(this.gestures).length === 0){
            this.removeEvent()
        }
    }
}

module.exports = Gesture