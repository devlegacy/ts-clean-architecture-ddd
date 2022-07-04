export const isUndefined = (obj: any): obj is undefined => typeof obj === 'undefined'
export const isString = (val: any): val is string => typeof val === 'string'
export const isNil = (val: any): val is null | undefined => isUndefined(val) || val === null
