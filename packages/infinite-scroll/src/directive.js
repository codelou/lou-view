const ctx = '@@InfiniteScroll';
/**
 *
 * @param fn
 * @param delay
 * @returns {Function}
 */
var throttle = function(fn, delay) {

  var now, lastExec, timer, context, args; //eslint-disable-line
  // 执行函数，并记录执行时间
  var execute = function() {
    fn.apply(context, args);
    lastExec = now;
  };

  return function() {
    context = this;
    args = arguments;

    now = Date.now();

    if (timer) {
      clearTimeout(timer);
      timer = null;
    }

    if (lastExec) {
      var diff = delay - (now - lastExec);
      if (diff < 0) {
        execute();
      } else {
        timer = setTimeout(() => {
          execute();
        }, diff);
      }
    } else {
      execute();
    }
  };
};
/**
 * 滚动的高度
 * @param element
 * @returns {*}
 */
var getScrollTop = function(element) {
  if (element === window) {
    return Math.max(window.pageYOffset || 0, document.documentElement.scrollTop);
  }

  return element.scrollTop;
};

var getComputedStyle = document.defaultView.getComputedStyle;


/**
 * 获取element元素父元素中可滚动的元素，然后监听滚动事件
 * @param element
 * @returns {*}
 */
var getScrollEventTarget = function(element) {
  var currentNode = element;
  // bugfix, see http://w3help.org/zh-cn/causes/SD9013 and http://stackoverflow.com/questions/17016740/onscroll-function-is-not-working-for-chrome
  while (currentNode && currentNode.tagName !== 'HTML' && currentNode.tagName !== 'BODY' && currentNode.nodeType === 1) {
    var overflowY = getComputedStyle(currentNode).overflowY;
    if (overflowY === 'scroll' || overflowY === 'auto') {
      return currentNode;
    }
    currentNode = currentNode.parentNode;
  }
  return window;
};
/**
 * 元素可视区域的高度
 * @param element
 * @returns {number}
 */
var getVisibleHeight = function(element) {
  if (element === window) {
    return document.documentElement.clientHeight;
  }

  return element.clientHeight;
};
/**
 * 元素距离页面最上面的距离
 * @param element
 * @returns {*}
 */
var getElementTop = function(element) {
  if (element === window) {
    return getScrollTop(window);
  }
  return element.getBoundingClientRect().top + getScrollTop(window);
};
/**
 * 元素是否加入dom
 * @param element
 * @returns {boolean}
 */
var isAttached = function(element) {
  var currentNode = element.parentNode;
  while (currentNode) {
    if (currentNode.tagName === 'HTML') {
      return true;
    }
    if (currentNode.nodeType === 11) {
      return false;
    }
    currentNode = currentNode.parentNode;
  }
  return false;
};

var doBind = function() {
  if (this.binded) return; // eslint-disable-line
  this.binded = true;
  // 节点上绑定的对象
  var directive = this;
  var element = directive.el;
  // 获取滚动元素
  directive.scrollEventTarget = getScrollEventTarget(element);
  // 滚动时间监听，监听函数的前后执行间隔大于 200
  directive.scrollListener = throttle(doCheck.bind(directive), 200);
  // 绑定函数
  directive.scrollEventTarget.addEventListener('scroll', directive.scrollListener);

  // 外部变量禁用监听，disabledExpr用于表示是否允许滚动的变量名字
  var disabledExpr = element.getAttribute('infinite-scroll-disabled');
  var disabled = false;

  if (disabledExpr) {
    this.vm.$watch(disabledExpr, function(value) {
      directive.disabled = value;
      // 如果启动自动加载数据，且配置的立即检查，则立即检查
      if (!value && directive.immediateCheck) {
        doCheck.call(directive);
      }
    });
    disabled = Boolean(directive.vm[disabledExpr]);
  }
  directive.disabled = disabled;
  // 触发加载方法的滚动距离阈值（像素）
  var distanceExpr = element.getAttribute('infinite-scroll-distance');
  var distance = 0;
  if (distanceExpr) {
    distance = Number(directive.vm[distanceExpr] || distanceExpr);
    if (isNaN(distance)) {
      distance = 0;
    }
  }
  directive.distance = distance;
  // 若为真，则指令被绑定到元素上后会立即检查是否需要执行加载方法。在初始状态下内容有可能撑不满容器时十分有用。
  var immediateCheckExpr = element.getAttribute('infinite-scroll-immediate-check');
  var immediateCheck = true;
  if (immediateCheckExpr) {
    immediateCheck = Boolean(directive.vm[immediateCheckExpr]);
  }
  directive.immediateCheck = immediateCheck;

  if (immediateCheck) {
    doCheck.call(directive);
  }
  // 一个 event，被执行时会立即检查是否需要执行加载方法。
  var eventName = element.getAttribute('infinite-scroll-listen-for-event');
  if (eventName) {
    directive.vm.$on(eventName, function() {
      doCheck.call(directive);
    });
  }
};
/**
 * 判断是否需要发送加载通知
 * @param force
 */
var doCheck = function(force) {
  // 滚动元素
  var scrollEventTarget = this.scrollEventTarget;
  // 需要分页加载数据的元素
  var element = this.el;
  // 距离
  var distance = this.distance;

  if (force !== true && this.disabled) return; //eslint-disable-line
  var viewportScrollTop = getScrollTop(scrollEventTarget);
  var viewportBottom = viewportScrollTop + getVisibleHeight(scrollEventTarget);

  var shouldTrigger = false;

  if (scrollEventTarget === element) {
    shouldTrigger = scrollEventTarget.scrollHeight - viewportBottom <= distance;
  } else {
    var elementBottom = getElementTop(element) - getElementTop(scrollEventTarget) + element.offsetHeight + viewportScrollTop;

    shouldTrigger = viewportBottom + distance >= elementBottom;
  }

  if (shouldTrigger && this.expression) {
    this.expression();
  }
};

export default {
  // 给元素节点绑定上下文环境
  bind(el, binding, vnode) {
    el[ctx] = {
      el,
      vm: vnode.context,
      expression: binding.value
    };
    const args = arguments;
    el[ctx].vm.$on('hook:mounted', function() {
      el[ctx].vm.$nextTick(function() {
        // el是否加入到dom中
        if (isAttached(el)) {
          doBind.call(el[ctx], args);
        }

        el[ctx].bindTryCount = 0;

        var tryBind = function() {
          if (el[ctx].bindTryCount > 10) return; //eslint-disable-line
          el[ctx].bindTryCount++;
          if (isAttached(el)) {
            doBind.call(el[ctx], args);
          } else {
            setTimeout(tryBind, 50);
          }
        };

        tryBind();
      });
    });
  },

  unbind(el) {
    el[ctx].scrollEventTarget.removeEventListener('scroll', el[ctx].scrollListener);
  }
};
