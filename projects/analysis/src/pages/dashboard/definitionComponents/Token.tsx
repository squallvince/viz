import React, { useState, useEffect, FC } from 'react';
import {
  useSetRecoilState,
  useRecoilState,
  RecoilState,
} from 'recoil';
import {
  omit,
  mapObjIndexed,
} from 'ramda';
import { tokenFamily, definitionTokenAtom } from './recoilStore';


const TokenStore: FC<{tokenAtom:RecoilState<string|number>, name:string}> = ({tokenAtom, name}) => {
  const [ tokenValue, setTokenValue ] = useRecoilState(tokenAtom);
  return (
    <div>
      {
        tokenValue
      }
      <button onClick={() => setTokenValue(1)}>{name}</button>
    </div>
  );
}


const Token = ({defaultToken}) => {
  const [defToken, setDefToken] = useState(defaultToken);
  const setDefTokenAtom = useSetRecoilState(definitionTokenAtom);
  useEffect(() => {
    setDefTokenAtom(defToken);
  }, [defToken, setDefTokenAtom]);

  const upsertToken = (k:string, v:string|number) =>setDefToken({
    ...defToken,
    [k]: v
  });
  const delToken = (k:string) =>setDefToken(omit([k],defToken));

  const TokenFamily = mapObjIndexed((v,k)=>(<TokenStore key={k} tokenAtom={tokenFamily(k)} name={k}/>),defToken);
  return (
    <>
      {/* {
        map((V)=>V, values(TokenFamily))
      } */}
    </>
  );
};

export default Token;
