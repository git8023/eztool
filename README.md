# eztool

Typescript Easy Tools.

项目以 vue3 + typescript 为模板开发.

# API

- [arrays](./doc/arrays.doc.md)
- [builder](./doc/arrays.doc.md)
- [dates](./doc/arrays.doc.md)
- [logs](./doc/arrays.doc.md)
- [numbers](./doc/arrays.doc.md)
- [storages](./doc/arrays.doc.md)
- [strings](./doc/arrays.doc.md)
- [utils](./doc/arrays.doc.md)
- [validators](./doc/arrays.doc.md)

# 版本

- v 0.0.7
    1. 基础结构操作工具
        ```javascript
        // 聚合导入
        import * as ezt from '@hyong8023/eztool'
        ezt.logs.debug('hello eztool')
       
        // 单独导入
        import { utils } from '@hyong8023/eztool/lib/tools/utils'
        let cloneObj = utils.cloneDeep(obj);
        ```

    2. 常用基础样式  
       ts/js
       ```typescript
       import '@hyong8023/eztool/lib/style/dc-base.scss'
       ```
       css/scss
       ```scss
       @import "~@hyong8023/eztool/lib/style/dc-base";
       ```
       提供以 `dc-` 开头的常用样式表
