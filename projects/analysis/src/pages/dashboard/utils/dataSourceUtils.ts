// This util convert data fetch function to observable which emits json

/*
  input(funtion which returns json)
*/

import {
  from,
  empty,
  Observable,
} from 'rxjs';

import LinkHeader from 'http-link-header';


const toAsync = (fn:Function) => async (...args:any[]) => fn(...args);

export const toObservable = (fn:Function) => {
  const asyncFn = toAsync(fn);
  return (...args:any[]) => from(asyncFn(...args));
};

// This section is used for uql dataSource
// TODO this is a mock
type ObjectKeyType = string | number

export type DataSourceDefinition = {
  [propName in ObjectKeyType]: unknown;
} & {
  query: string;
  options: object;
  type: string;
  name: string;
};
export const translateDataSourceDefinitionToFetch = (def:DataSourceDefinition) => {
  return def.options; //TODO this is mock function
};


export const uqlPaginationStretagy = (getDataSource: { (...args: any[]): Observable<any>; (arg0: any): any; }, res:Response)=> {
  const linkHeader = res.headers.get('Link');
  const next = LinkHeader.parse(linkHeader).get('rel', 'next');
  if (next.length) {
    return getDataSource(next[0].uri);
  }
  return empty();
}
