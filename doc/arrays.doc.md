# arrays 数组工具

- toMap
  > 对象数组通过指定属性名转换为JSON对象
    - 参数:
        - arr: `Array` 目标数组
        - [toKey]: `StringOrIdableConvertor<T>` 转换属性名或处理函数  
          默认值: 'id'
        - [recover]: `Boolean` 是否允许覆盖. 如果为`false`数组元素中指定值存在时报错; 否则只保留最后一个元素.  
          默认值: `true`
        - [recursion]: `(el: T) => Array<T> | any` 元素递归函数. 返回`null`终止.   
          默认值: `()=>null`
    - 返回值: `StringKeysJson<T>`
    - 示例
      ```javascript
      arrays.toMap([1, 2, 3], (e, k) => k); 
      // => {0: 1, 1: 2, 2: 3}
      
      arrays.toMap([{id: 1}, {id: 2}]);
      // => {1: {id: 1}, 2: {id: 2}}
      ```

- intersection

  > 获取交集, 判断引用方式

    - 参数
        - args: `Array<T[]>` 数组列表
    - 返回值: `Array<T>`
    - 示例
      ```javascript
      let data = {id: 1};
      arrays.intersection([0, 1, 2, data], [0, data])
      // => [0, data]
       
      arrays.intersection([0, 1, 2], [3, 4])
      // => []
      ```

- seek

  > 查找(单个)元素(或递归满足条件的数组元素属性值)

    - 参数
        - arr: `Array<T>` 数组
        - observer: `(el: T, index?: number) => true as boolean` 观察者处理函数, `el`是需要的元素返回`truth`, 否则返回`falsy`
        - recursion: `(el: T, index?: number) => null as ArrayOrNull<T>` 元素递归检测处理函数, 中断返回`null`, 否则返回需要递归的`数组`
    - 返回值: `TypeOrNull<{ el: T, index: number }>`
    - 示例
      ```javascript
      let arr = [{id: 0, foo: [{id: 2}, {id: 3}]}, {id: 1}];
      arrays.seek(arr,
        (el, index) => 3 === el.id,
        el => {
          if (el.foo) return el.foo;
          return null;
        });
      // => {
      //  index: 1,
      //  el: {id: 3}
      // }
      ```
- foreach

  > 数组遍历

    - 参数
        - arr: `Array<T>` 数组
        - func: `(e: T, i: number) => (false | any)` 处理函数

    - 返回值: arr `Array<T>`
    - 实例
      ```javascript
      let ret: number[] = [];
      arrays.foreach([1, 2, 3, 4, 5, 6, 7], e => {
        // 进入下次循环
        if (0 === e % 2) return true;
      
        // 只处理 5 以前的数据
        if (5 <= e) return false;
      
        ret.push(e);
      });
      // ret => [1, 3]
      ```

- pushUnique

  > 追加唯一目标值, 如果校验存在则跳过

    - 参数
        - arr: `Array<T>` 数组
        - el: `T` 元素
        - predictor?: `string | ((el: T, i: number) => boolean)` 断言属性或函数, 函数返回`true`则`el`与`arr`中当前元素相同
    - 返回值: `number` 在`arr`中与`el`匹配元素的索引
    - 示例
      ```javascript
      arrays.pushUnique([1, 2, 3], 1) 
      // => 0
      arrays.pushUnique([{id: 1}, {id: 2}], {id: 3}, 'id')
      // => 2, 追加
      arrays.pushUnique([1, {id: 2}, 3], {id: 2}, (el: any) => 2 === el.id)
      // => 1, 查找
      ```

- indexA

  > 查找索引
    - 参数
        - arr: `Array<T>` 数组
        - el: `T` 查找条件
        - predictor: `string | ((el: T, i: number) => boolean)` 断言属性或函数, 函数返回`true`则`el`与`arr`中当前元素相同  
          默认值: `(e) => e === el`
    - 返回值: `number` 匹配成功索引, 失败返回-1
    - 示例
      ```javascript
      arrays.indexA([1, 2, 3], 1)
      // => 0
      arrays.indexA([{id: 1}, {id: 2}], {id: 2}, 'id')
      // => 1
      arrays.indexA([{id: 1}, {id: 2}], {id: 3}, 'id')
      // => -1
      ```


- findA

  > 查找索引
    - 参数
        - arr: `Array<T>` 数组
        - el: `T` 查找条件
        - predictor: `string | ((el: T, i: number) => boolean)` 断言属性或函数, 函数返回`true`则`el`与`arr`中当前元素相同  
          默认值: `(e) => e === el`
    - 返回值: `T | null` 匹配成功返回`T`, 失败返回`null`
    - 示例
      ```javascript
      arrays.findA([1, 2, 3], 1)
      // => 1 (元素值)
      arrays.findA([{id: 1}, {id: 2, foo: 'foo'}], {id: 2}, 'id')
      // => {id: 2, foo: 'foo'}
      arrays.findA([{id: 1}, {id: 2}], {id: 3}, 'id')
      // => null
      ```


- remove

  > 删除元素

    - 参数
        - arr: `Array<T>` 数组
        - el: `T` 查找条件
        - predictor: `string | ((el: T, i: number) => boolean)` 断言属性或函数, 函数返回`true`则`el`与`arr`中当前元素相同  
          默认值: `(e) => e === el`
    - 返回值: `T | null` 成功返回被删除目标值, 否则返回`null`
    - 示例
      ```javascript
      const arr = [1, 2, {id: 3, foo: 'foo'}, {id: 4, bar: 'bar'}, 'b']
      arrays.remove(arr, 1)
      // => 1
      arrays.remove(arr, {id: 3}, 'id')
      // => {id: 3, foo: 'foo'}
      arrays.remove(arr, null, (el, i) => i === el)
      // => null
      arrays.remove<any>(arr, null, el => 'bar' === el.bar)
      // => {id: 4, bar: 'bar'}
      ```

- removeAll

  > 数组减法运算, 对象匹配通过引用判定

    - 参数
        - a: `Array<T>` 数组a
        - b: `Array<T>` 数组b
    - 返回值: `Array<T>` arrA - arrB
    - 示例
      ```javascript
      const arrA = [1, 2, 3]
      const arrB = ['a', 2, 'b']
      arrays.removeAll(arrA, arrB)
      // => [1, 3]
      arrays.removeAll(arrB, arrA)
      // => ['a', 'b']

      const el = {id: 2}
      const arrC = [{id: 1}, el, el];
      const arrD = [{id: 2}, {id: 2, bar: 'bar'}, el];
      arrays.removeAll<any>(arrC, arrD)
      // => [{id: 1}]
      arrays.removeAll<any>(arrD, arrC)
      // => [{id: 2}, {id: 2, bar: 'bar'}]
      ```

----
模板示例
- findA

  > 查找值

    - 参数
    - 返回值
    - 示例



