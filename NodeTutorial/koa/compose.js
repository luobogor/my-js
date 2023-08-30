function compose(middleware) {
  return function (context, next) {
    let index

    function dispatch(i) {
      index = i
      let fn = middleware[i]

      if (i === middleware.length) {
        fn = next
      }

      if (!fn) {
        return Promise.resolve()
      }

      return Promise.resolve(fn(context, function next() {
        return dispatch(i + 1)
      }))
    }

    return dispatch(0)
  }
}

const middlewares = compose([
  function one(context, next) {
    console.log('1')
    next().then(() => {
      console.log('1 then')
    })
  },
  function two(context, next) {
    console.log('2')
    next().then(() => {
      console.log('2 then')
    })
  },
  function three(context, next) {
    console.log('3')
    next().then(() => {
      console.log('3 then')
    })
  }
])

middlewares({}).then(function () {
  console.log('队列执行完毕');
})