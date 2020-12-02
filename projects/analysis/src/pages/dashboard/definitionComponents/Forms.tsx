import React, { useState, useEffect, Suspense, FC } from 'react';
import { useSetRecoilState, useRecoilState, useRecoilValue, RecoilState }from 'recoil';
import { map, omit, values, fromPairs, mapObjIndexed, pair } from 'ramda';
import { tokenFamily, dataAtomFamily, definitionFormAtom } from './recoilStore';
import { renderJson, generator, FormConfig, useImportResources } from '../utils/misc';

const formFactory: (tokenAtom:[string,RecoilState<any>][], dataAtom:[string,RecoilState<any>][]) => FC<{ config:FormConfig }> 
= (tokenAtom, dataAtom) => {
  return ({config}) => {
    const tokens = map(([k, tk]) => pair(k, useRecoilState(tk)), tokenAtom);
    const { type, tokens: tks } = config;
    const tokenObj = fromPairs(tokens);
    const EditableTokenAtom = mapObjIndexed((t) => tokenObj[t], tks);
    const data = fromPairs(map(([k,v]) => pair(k, useRecoilValue(v)), dataAtom));
    const Comp = useImportResources(type);
    const configWithToken = renderJson({
      ...config,
      ...tokenObj
    });
    return <Suspense fallback={<div>loading.....</div>}><Comp {...data} con={config} states={EditableTokenAtom} /></Suspense>
  }
}

const generateForm = (config: FormConfig, key:string,) => {
  const relatedTokensId = values(config.tokens);
  return generator(formFactory, tokenFamily, dataAtomFamily)(config, key, relatedTokensId);
}
const Forms = ({ defaultForm, Layout }) => {
  const setDefinitionVizAtom = useSetRecoilState(definitionFormAtom);
  const [ formDef, setVizDef ] = useState(defaultForm);
  useEffect(() => {
    setDefinitionVizAtom(formDef);
  }, [formDef, setDefinitionVizAtom]);
  const [ formPak, setVizComp ] = useState(mapObjIndexed(generateForm, formDef));

  const delViz = (name:string):void => {
    setVizComp(omit([name], formPak));
    setVizDef(omit([name], formDef));
  };

  const upsertViz = (name:string, config:FormConfig):void => {
    setVizComp({
      ...formPak,
      [name]: generateForm(config, name)
    });
    setVizDef({
      ...formDef,
      [name]: config
    })
  };

  return (
    <>
      <Layout>
        {
          map(({ Comp:V, config, name }) => <V key={name} config={config}/>, values(formPak))
        }
      </Layout>
    </>
  );
};

export default Forms;
