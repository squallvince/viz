
const splitColumns = [
  {
    title: '-raw',
    dataIndex: 'raw'
  },
  {
    title: 'field1',
    dataIndex: 'field1'
  },
  {
    title: 'field2',
    dataIndex: 'field2'
  },
  {
    title: 'field3',
    dataIndex: 'field3'
  },
  {
    title: 'field4',
    dataIndex: 'field4'
  },
  {
    title: 'field5',
    dataIndex: 'field5'
  }
];
const splitDataSource = [
  {
    key: '0',
    raw: 'Edward King 0',
    field1: '32',
    field2: 'London, Park Lane no. 0',
    field3: 'London, Park Lane no. 1',
    field4: 'London, Park Lane no. 1',
    field5: 'London, Park Lane no. 1'
  },
  {
    key: '1',
    raw: 'Edward King 1',
    field1: '32',
    field2: 'London, Park Lane no. 0',
    field3: 'London, Park Lane no. 1',
    field4: 'London, Park Lane no. 1',
    field5: 'London, Park Lane no. 1'
  }, {
    key: '2',
    raw: 'Edward King 2',
    field1: '33',
    field2: 'London, Park Lane no. 0',
    field3: 'London, Park Lane no. 1',
    field4: 'London, Park Lane no. 1',
    field5: 'London, Park Lane no. 1'
  },
  {
    key: '3',
    raw: 'Edward King 2',
    field1: '33',
    field2: 'London, Park Lane no. 0',
    field3: 'London, Park Lane no. 1',
    field4: 'London, Park Lane no. 1',
    field5: 'London, Park Lane no. 1'
  }
]
const editKeys = [
  { t: 'field1', eFlag: false },
  { t: 'field2', eFlag: false },
  { t: 'field3', eFlag: false },
  { t: 'field4', eFlag: false },
  { t: 'field5', eFlag: false }
]
const editValues = ['Edward King 0', 'London, Park Lane no. 1', 'Edward King 2', 'Edward King 3', 'Edward King 4']
export default {
  splitColumns,
  splitDataSource,
  editKeys,
  editValues
}