import {
  is,
  flatten,
  match,
  map,
  values,
  dropRepeats,
  fromPairs,
  toPairs,
  unnest,
  pair,
} from 'ramda';
import jVar from 'json-variables';
import { lazy, useMemo, FC } from 'react';

import { RecoilState, SerializableParam } from 'recoil';


type ObjectKeyType = string | number;

type DefinitionType = {
  [propName in ObjectKeyType]: unknown;
};


export interface VizConfig extends DefinitionType { 
  type:string,
  dataSources?: { [x: string]: unknown; } | { [x: number]: unknown; }
}
export interface FormConfig extends DefinitionType {
  type:string,
  tokens: { [x: string]: string; }
  dataSources?: { [x: string]: unknown; } | { [x: number]: unknown; }
}

type Config = VizConfig | FormConfig;

interface GeneratedPack {
  Comp: FC<{ config:Config }>,
  config: Config,
  name: string
}

interface Factory {
  (tokenAtom:[string,RecoilState<any>][], dataAtom:[string,RecoilState<any>][]): React.FunctionComponent<{ config:Config }>
}

export const getTokenFromString = (s:string):string[] => {
  const isString = is(String);
  if (!isString(s)) {
    return [];
  }
  const tokensRaw = match(/\{(.*?)\}/g, s);
  const tokens = map((str) => `${str.substr(1, str.length - 2)}`, tokensRaw);
  return tokens;
};



export const flatObject: (obj: DefinitionType) => object = (obj) => {

  const getEntries: (o: DefinitionType | number | string, prefix?: string) => [string,unknown][] = (o, prefix = '') =>
      unnest(map(([k, v]:[string, DefinitionType|string|number]) => {
        if (is(Object, v)) {
          const entryObject = v as DefinitionType;
          return getEntries(entryObject, `${prefix}${k}.`);
        }
        return [pair(`${prefix}${k}`, v)];
      }, toPairs(o as DefinitionType)));

  return fromPairs(getEntries(obj));
};

export const getTokensArrayFromConfig: (obj: DefinitionType) => string[] = (obj) => {
  const flattenedObject = flatObject(obj);
  const tokensRaw = flatten(map(getTokenFromString, values(flattenedObject)));
  const tokens = dropRepeats(tokensRaw);
  return tokens;
};

export const renderJson = (obj) =>
  jVar(obj, {
    heads: '{',
    tails: '}',
  });

// export function loadComponent(scope, module) {
//   return async () => {
//     // Initializes the share scope. This fills it with known provided modules from this build and all remotes
//     await __webpack_init_sharing__('default');
//     const container = window[scope]; // or get the container somewhere else
//     // Initialize the container, it may provide shared modules
//     await container.init(__webpack_share_scopes__.default);
//     const factory = await window[scope].get(module);
//     const Module = factory();
//     return Module;
//   };
// }

export const generator = (factory:Factory, tokenFamily:(param: SerializableParam) => RecoilState<string>, dataAtomFamily: (param: SerializableParam) => RecoilState<any[]>)  => 
(config: Config, key:string, relatedTokensId:string[]):GeneratedPack => {
  const relatedTokens = map((k:string) => pair(k, tokenFamily(k)), relatedTokensId);
  const { dataSources } = config;
  const dataSourceTuples = toPairs(dataSources);
  const relatedDataSources = map(([k,v]:[string, string]) => pair(k, dataAtomFamily(v)), dataSourceTuples);
  return {
    Comp: factory(relatedTokens, relatedDataSources),
    config,
    name: key
  }
}

export const useImportResources:(type:string)=>React.LazyExoticComponent<React.ComponentType<any>> = (type) => useMemo(
  () => {
    // return lazy(loadComponent('resources', `./${type}`));
    const path = type.replace('.', '/');
    return lazy(() => import(`../${path}`));
  },
  [type]
);

export default null;
