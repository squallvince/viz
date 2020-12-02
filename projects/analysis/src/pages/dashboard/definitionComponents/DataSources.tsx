import {
  useSetRecoilState,
} from 'recoil';
import {
  mapObjIndexed,
  map,
  values,
  omit,
} from 'ramda';
import React, { useState, useEffect, FC } from 'react';
import dataSourceFactory from '../utils/dataSource';
import { dataAtomFamily, tokenFamily, definitionDataSourceAtom } from './recoilStore';

// only this component can change data and definitionDataSource atoms

interface UpsertDataSource {
  (name: string, config: object):void;
}

interface DeleteDataSource {
  (name: string):void;
}

interface DataStore {
  Comp: FC<{ ds: object }>,
  key: string,
  config: object
}

interface GenerateDataStore {
  (config: object, dataSourceName: string): DataStore
}

const useDataSources = (defaultDataSource: object = {}):[object, UpsertDataSource, DeleteDataSource] => {
  const [dataSources, setDataSources] = useState(defaultDataSource);
  const setDataSourceAtom = useSetRecoilState(definitionDataSourceAtom);
  useEffect(() => setDataSourceAtom(dataSources), [dataSources, setDataSourceAtom]);
  const upsertDataSource:UpsertDataSource = (name, config) => {
    setDataSources({
      ...dataSources,
      [name]: config
    });
  };
  const deleteDataSource:DeleteDataSource = (name) => {
    setDataSources(omit([name], dataSources));
  };

  return [dataSources, upsertDataSource, deleteDataSource];
}

const generateDataStore:GenerateDataStore = (config, dataSourceName) => {
  return {
    Comp: dataSourceFactory(dataAtomFamily(dataSourceName), tokenFamily),
    key: dataSourceName,
    config
  }
};

const DataSources = ({defaultDataSource}) => {
  const [dataSources, upsertDataSource, deleteDataSource] = useDataSources(defaultDataSource); 
  const [DataSourceStores, setDataSourceStores] = useState(mapObjIndexed(generateDataStore, dataSources));

  const updateDataStore:UpsertDataSource = (name, config) => {
    const DataStoreWithoutName = omit([name], DataSourceStores);
    setDataSourceStores({...DataStoreWithoutName, [name]:generateDataStore(config, name)});
    upsertDataSource(name, config);
  }
  const deleteDataStore:DeleteDataSource = (name) => {
    const DataStoreWithoutName = omit([name], DataSourceStores);
    setDataSourceStores(DataStoreWithoutName);
    deleteDataSource(name);
  }

  const addDataStore:UpsertDataSource = (name, config) => {
    const res = {...DataSourceStores, [name]:generateDataStore(config, name)}
    setDataSourceStores(res);
    upsertDataSource(name, config);
  }

  const DataSourceStoresArray = values(DataSourceStores);

  return (<>
   {map(({Comp, key, config}) => <Comp key={key} ds={config} />, DataSourceStoresArray)}
  </>);
}

export default DataSources;
