import arrays from './tools/arrays';
import builder from './tools/builder';
import converters from './tools/converters';
import dates from './tools/dates';
import medias from './tools/medias';
import numbers from './tools/numbers';
import storages from './tools/storages';
import strings from './tools/strings';
import utils from './tools/utils';
import validators from './tools/validators';
import logs from './tools/logs';
import jsons from './tools/jsons';
import asyncs from './tools/asyncs';
import ArrayStream from './data/ArrayStream';
import base64 from './data/base64';
import * as types from './types/types'
import binaries from './data/binaries';

const ezt = {
  arrays,
  asyncs,
  ArrayStream,

  base64,
  binaries,
  builder,

  converters,

  dates,

  jsons,

  logs,

  medias,

  numbers,

  storages,
  strings,

  types,

  utils,
  validators
}

export default ezt;
