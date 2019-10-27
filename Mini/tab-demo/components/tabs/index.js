var behavior = require('../common/behavior')

Component({
  behaviors: [behavior],

  externalClasses: ['custom-class', 'nav-class', 'tab-class', 'tab-active-class', 'line-class'],

  properties: {
    color: String,
    sticky: Boolean,
    animated: Boolean,
    swipeable: Boolean,
    lineWidth: {
      type: Number,
      value: -1
    },
    lineHeight: {
      type: Number,
      value: -1
    },
    active: {
      type: Number,
      value: 0
    },
    type: {
      type: String,
      value: 'line'
    },
    border: {
      type: Boolean,
      value: true
    },
    duration: {
      type: Number,
      value: 0.3
    },
    zIndex: {
      type: Number,
      value: 1
    },
    swipeThreshold: {
      type: Number,
      value: 4
    },
    offsetTop: {
      type: Number,
      value: 0
    }
  },

  data: {
    tabs: [],
    lineStyle: '',
    scrollLeft: 0,
    scrollable: false,
    trackStyle: '',
    wrapStyle: '',
    position: ''
  },

  observers: {
    swipeThreshold() {
      this.set({
        scrollable: this.child.length > this.data.swipeThreshold
      });
    },
    'color, lineWidth, lineHeight'() {
      this.setLine()
    },
    active() {
      this.setActiveTab()
    },
    animated() {
      this.setTrack()
    },
    offsetTop() {
      this.setWrapStyle()
    },
  },

  methods: {
    updateTabs(tabs) {
      tabs = tabs || this.data.tabs;
      this.set({
        tabs,
        scrollable: tabs.length > this.data.swipeThreshold
      });
      this.setActiveTab();
    },

    trigger(eventName, index) {
      this.triggerEvent(eventName, {
        index,
        title: this.data.tabs[index].title
      });
    },

    onTap(event) {
      const { index } = event.currentTarget.dataset;
      if (this.data.tabs[index].disabled) {
        this.trigger('disabled', index);
      } else {
        this.trigger('click', index);
        this.setActive(index);
      }
    },

    setActive(active) {
      if (active !== this.data.active) {
        this.trigger('change', active);
        this.set({ active });
      }
    },

    setLine(skipTransition) {
      if (this.data.type !== 'line') {
        return;
      }

      const { color, active, duration, lineWidth, lineHeight } = this.data;

      this.getRect('.van-tab', true).then(
        (rects) => {
          const rect = rects[active];
          const width = lineWidth !== -1 ? lineWidth : rect.width / 2;
          const height = lineHeight !== -1 ? `height: ${lineHeight}px;` : '';

          let left = rects
            .slice(0, active)
            .reduce((prev, curr) => prev + curr.width, 0);

          left += (rect.width - width) / 2;

          const transition = skipTransition
            ? ''
            : `transition-duration: ${duration}s; -webkit-transition-duration: ${duration}s;`;

          this.set({
            lineStyle: `
            ${height}
            width: ${width}px;
            background-color: ${color};
            -webkit-transform: translateX(${left}px);
            transform: translateX(${left}px);
            ${transition}
          `
          });
        }
      );
    },

    setTrack() {
      const { animated, active, duration } = this.data;

      if (!animated) return '';

      this.getRect('.van-tabs__content').then(
        (rect) => {
          const { width } = rect;

          this.set({
            trackStyle: `
            width: ${width * this.child.length}px;
            left: ${-1 * active * width}px;
            transition: left ${duration}s;
            display: -webkit-box;
            display: flex;
          `
          });

          const props = { width, animated };

          this.child.forEach((item) => {
            item.set(props);
          });
        }
      );
    },

    setActiveTab() {
      this.child.forEach((item, index) => {
        const data = {
          active: index === this.data.active
        };

        if (data.active) {
          data.inited = true;
        }

        if (data.active !== item.data.active) {
          item.set(data);
        }
      });

      this.nextTick(() => {
        this.setLine();
        this.setTrack();
        this.scrollIntoView();
      });
    },

    // scroll active tab into view
    scrollIntoView() {
      const { active, scrollable } = this.data;

      if (!scrollable) {
        return;
      }

      Promise.all([
        this.getRect('.van-tab', true),
        this.getRect('.van-tabs__nav')
      ]).then(
        ([tabRects, navRect]) => {
          const tabRect = tabRects[active];
          const offsetLeft = tabRects
            .slice(0, active)
            .reduce((prev, curr) => prev + curr.width, 0);

          this.set({
            scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2
          });
        }
      );
    },

    setWrapStyle() {
      const { offsetTop, position } = this.data;
      let wrapStyle;

      switch (position) {
        case 'top':
          wrapStyle = `
            top: ${offsetTop}px;
            position: fixed;
          `;
          break;
        case 'bottom':
          wrapStyle = `
            top: auto;
            bottom: 0;
          `;
          break;
        default:
          wrapStyle = '';
      }

      // cut down `set`
      if (wrapStyle === this.data.wrapStyle) return;

      this.set({ wrapStyle });
    },

    observerContentScroll() {
      if (!this.data.sticky) {
        return;
      }

      const { offsetTop } = this.data;
      const { windowHeight } = wx.getSystemInfoSync();

      // 先停止监听工作，后面重新开启监听
      this.createIntersectionObserver().disconnect();

      // @ts-ignore
      this.createIntersectionObserver()
        .relativeToViewport({ top: -(this.navHeight + offsetTop) })
        .observe('.van-tabs', (res) => {
          const { top } = res.boundingClientRect;
          console.log('ttttt', res)

          // 处理从 p3 进入/离开 O2 的情况， 不处理从 p4 进入/离开 O2 的情况
          if (top > offsetTop) { // 内容块上边界在视口上边界以下的区域，直接返回
            console.log('tback')
            return;
          }

          const position = res.intersectionRatio > 0 ? 'top' : 'bottom'; // >0 进入区域， == 0 离开区域

          this.triggerEvent('scroll', {
            scrollTop: top + offsetTop,
            isFixed: position === 'top'
          });
          console.log('topset:', position)
          this.setPosition(position);
        });

      // @ts-ignore
      this.createIntersectionObserver()
        .relativeToViewport({ bottom: -(windowHeight - 1 - offsetTop) })
        .observe('.van-tabs', (res) => {
          const { top, bottom } = res.boundingClientRect;

          console.log('bbb', res)
          // 从 p1 进入 O1 （解除）
          // p2 进入 O1 吸顶
          // p2 离开 O1 （解除）
          // 不处理从 p1 离开 O1 的情况
          if (bottom < this.navHeight) {
            console.log('bback')
            return;
          }

          const position = res.intersectionRatio > 0 ? 'top' : '';

          this.triggerEvent('scroll', {
            scrollTop: top + offsetTop,
            isFixed: position === 'top'
          });

          console.log('bottomset:', position)
          this.setPosition(position);
        });
    },

    setPosition(position) {
      if (position !== this.data.position) {
        this.set({ position }).then(() => {
          this.setWrapStyle();
        });
      }
    }
  },

  attached() {
    this.setLine(true);
    this.setTrack();
    this.scrollIntoView();

    this.getRect('.van-tabs__wrap').then(
      (rect) => {
        this.navHeight = rect.height;
        this.observerContentScroll();
      }
    );
  }
});
