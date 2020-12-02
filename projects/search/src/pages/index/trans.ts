export function chartToVisua(chartData: any) {
  const classification: { [key: string]: any } = {};
  const { selectDataSchema, datas } = chartData;
  if (selectDataSchema.length === 0) {
    return;
  }
  selectDataSchema.forEach((item: { column: any; type: any }) => {
    let { column, type } = item;
    type = type.toLowerCase();
    if (!(type in classification)) {
      classification[type] = [];
    }
    classification[type].push(column);
  });

  return {
    classification: classification,
    datas: datas,
  };
}

export function transformToTHead(heads: Array<any>) {
  let timeIndex: number | undefined;
  const columns = heads.map((item, index: number) => {
    if (item.column === "_time") {
      timeIndex = index;
    }
    return {
      dataIndex: item.column,
      key: item.column,
      title: item.column,
      width: 200,
      textWrap: "word-break",
      ellipsis: true,
    };
  });

  // 增加对column的排序  将_time字段放在最前面
  if (timeIndex) {
    columns.splice(timeIndex, 1);
    columns.unshift({
      dataIndex: "_time",
      key: "_time",
      title: "_time",
      width: 200,
      textWrap: "word-break",
      ellipsis: true,
    });
  }

  return columns;
}
