import {IDataConsumer, IDataProcessor} from './funcs';

export type Part<T> = Partial<T>;
export type ArrayOrNull<T> = Array<T> | null;
export type TypeOrNull<T> = T | null;
export type PrimaryTypeString =
  'Undefined'
  | 'Null'
  | 'Object'
  | 'Function'
  | 'Array'
  | 'Symbol'
  | 'String'
  | 'Date'
  | 'Number';
export type IdableConvertor<T> = (e: T, k: any) => string;
export type StringOrIdableConvertor<T> = string | IdableConvertor<T>;
export type NumberGenerator<T> = (e: T) => number;
export type SortHandler<T> = (a: any, b: any) => number;
export type PropertyExtractor<T, R> = (e: Part<T>) => R;
export type AttachHandler<T, V> = (e: T) => T;
export type EqualsHandler<T> = (a: T, b: T) => boolean;
export type DoneHandler = (a?: Part<any>, b?: Part<any>) => void;
export type JsonT<T> = { [s: string]: T };
export type Json = JsonT<any>;
export type RawOrPromise<T> = T | Promise<T>
export type Runner<T> = (arg: T) => RawOrPromise<T>;
export type Optional<T> = null | undefined | T;
export type OptionalConsumer<T> = Optional<IDataConsumer<T>>;
export type OptionalDataProgress<T> = Optional<IDataProcessor<T, any>>;
