export default Behavior({
  methods: {
    set(data) {
      return new Promise((resolve) => {
        this.setData(data, resolve)
      })
    },
    getRect(selector, all) {
      return new Promise(resolve => {
        wx.createSelectorQuery()
          .in(this)[all ? 'selectAll' : 'select'](selector)
          .boundingClientRect(rect => {
            if (all && Array.isArray(rect) && rect.length) {
              resolve(rect);
            }

            if (!all && rect) {
              resolve(rect);
            }
          })
          .exec();
      });
    },
    nextTick(fn) {
      return new Promise((r) => {
        setTimeout(() => {
          r()
          if (fn) {
            fn()
          }
        }, 1000 / 30);
      })
    }
  }
});
