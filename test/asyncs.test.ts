import asyncs from '../lib/tools/asyncs';

test('asyncs:interval() !immediate loop', () => {
  let counter = 0;
  const call = () => {
    console.log(++counter);
  }
  asyncs.interval(call, 1000, false, true)
  return asyncs.manCall((res) => {
    asyncs.lazy(() => {
      res.resolve(true)
      expect(counter).toEqual(3)
    }, 3050)
  })
})

test('asyncs:interval() immediate loop', () => {
  console.log('>>', Date.now())

  let counter = 0;
  const call = () => {
    console.log('call', Date.now())
    console.log(++counter);
  }
  asyncs.interval(call, 1000, true, true)
  return asyncs.manCall((res) => {
    asyncs.lazy(() => {
      res.resolve(true)
      expect(counter).toEqual(4)
    }, 3050)
  })
})

test('asyncs:interval() async call()=>false', () => {
  let counter = 0
  const call = () => {
    console.log(++counter)
    return 4 > counter
  }
  asyncs.interval(call, 0, false, true, true)
  return asyncs.manCall((res) => {
    asyncs.lazy(() => {
      res.resolve(true)
      expect(counter).toEqual(4)
    }, 100)
  })
})

test('asyncs:interval() call.sync waitForCall', () => {
  let counter = 0
  const call = () => {
    console.log(++counter)
  }

  const intervalLazy = 1000
  const expectLazy = 3000
  const expectCounter = Math.floor(expectLazy / intervalLazy)

  asyncs.interval(call, intervalLazy, false, true, true);
  return asyncs.manCall((res) => {
    asyncs.lazy(() => {
      res.resolve(true)
      expect(counter).toEqual(expectCounter)
    }, expectLazy)
  })
})

test('asyncs:interval() call.async !immediate waitForCall', () => {
  let counter = 0
  const call = () => {
    return asyncs.manCall((res) => {
      asyncs.lazy(() => {
        console.log(++counter)
        res.resolve(3 > counter)
      }, 100)
    })
  }

  const intervalLazy = 1000
  const expectLazy = 3000
  const expectCounter = Math.floor(expectLazy / intervalLazy)

  asyncs.interval(call, intervalLazy, false, true, true);
  return asyncs.manCall((res) => {
    asyncs.lazy(() => {
      res.resolve(true)
      expect(counter).toEqual(expectCounter)
    }, expectLazy)
  })
})

test('asyncs:interval() call.async immediate waitForCall', () => {
  let counter = 0
  const call = () => {
    return asyncs.manCall((res) => {
      asyncs.lazy(() => {
        console.log(++counter)
        res.resolve(3 > counter)
      }, 100)
    })
  }

  const intervalLazy = 1000
  const expectLazy = 3000
  const expectCounter = Math.floor(expectLazy / intervalLazy)

  asyncs.interval(call, intervalLazy, true, true, true);
  return asyncs.manCall((res) => {
    asyncs.lazy(() => {
      res.resolve(true)
      expect(counter).toEqual(expectCounter)
    }, expectLazy)
  })
})
