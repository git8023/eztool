import { arrays } from '../lib/tools/arrays'
import { logger } from '../lib/tools/logs'

arrays.foreach([1, 2, 3], (e, i) => {
  logger.debug(i, e)
})
