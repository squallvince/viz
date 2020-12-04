import React, { useState, useEffect, Suspense, FC } from 'react';
import { useSetRecoilState, useRecoilValue, RecoilState } from 'recoil';
import { map, omit, values, fromPairs, mapObjIndexed, pair } from 'ramda';
import { tokenFamily, dataAtomFamily, definitionVizAtom } from './recoilStore';
import { getTokensArrayFromConfig, renderJson, generator, VizConfig, useImportResources } from '../utils/misc';

const vizFactory:(tokenAtom:[string, RecoilState<any>][], dataAtom:[string, RecoilState<any>][]) => FC<{ config:VizConfig }> = (tokenAtom, dataAtom) => {
  return ({ config }) => {
    const tokens = map(([k, tk]) => pair(k, useRecoilValue(tk)), tokenAtom);
    const data = fromPairs(map(([k,v]) => pair(k, useRecoilValue(v)), dataAtom));
    const Comp = useImportResources(config.type);
    const configWithToken = renderJson({
      ...config,
      ...fromPairs(tokens)
    });
    return <Suspense fallback={<div>loading.....</div>}><Comp {...data} opt={config.options} /></Suspense>
  }
}

const generateViz = (config: VizConfig, key:string,) => {
  const relatedTokensId = getTokensArrayFromConfig(config);
  return generator(vizFactory, tokenFamily, dataAtomFamily)(config, key, relatedTokensId);
}

const Vizs = ({ defaultViz, Layout }) => {
  const setDefinitionVizAtom = useSetRecoilState(definitionVizAtom);
  const [vizDef, setVizDef] = useState(defaultViz);

  useEffect(() => {
    setDefinitionVizAtom(vizDef);
  }, [vizDef, setDefinitionVizAtom]);
  const [vizPak, setVizComp] = useState(mapObjIndexed(generateViz, vizDef));

  const delViz = (name:string) => {
    setVizComp(omit([name], vizPak));
    setVizDef(omit([name], vizDef));
  };

  const upsertViz = (name:string, config:VizConfig) => {
    setVizComp({
      ...vizPak,
      [name]: generateViz(config, name)
    });
    setVizDef({
      ...vizDef,
      [name]: config
    })
  };

  return (
    /* <button onClick={()=>upsertViz("table4",{
      "title": "Demo",
      "type": "viz.Line",
      "options": {
        "a": "c",
        "b": "d"
      },
      "dataSources": {
        "primary": "sample"
      }
    })}>add</button>
    <button onClick={()=>delViz("table4")}>del</button>
    <button onClick={()=>upsertViz("table4",{
      "title": "Demo",
      "type": "viz.Line",
      "options": {
        "a": "c",
        "b": "d"
      },
      "dataSources": {
        "primary": "search1"
      }
    })}>update</button> */
      <Layout>{
        map(({ Comp: V, config, name }) => <V key={name} config={config} />, values(vizPak))
      }</Layout>
  );

}


export default Vizs;