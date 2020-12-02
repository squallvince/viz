import React, { FC, useState } from "react";
import { Checkbox } from "antd";
import { CheckboxValueType } from "antd/lib/checkbox/Group";

export interface IFieldObj {
  label: string;
  value: string;
  disabled?: boolean;
}
export interface IFieldsHandleProps {
  choosedFields: IFieldObj[];
  currentChoose: CheckboxValueType[];
  addField?: () => void;
  choosedFieldsChange?: (checkedValue: CheckboxValueType[]) => void;
  likeFieldsChange?: (checkedValue: CheckboxValueType[]) => void;
  openDrawer?: () => void;
}
export interface IFieldsHandleState {}

const CheckboxGroup = Checkbox.Group;

const FieldsHandle = (props: IFieldsHandleProps) => {
  const { choosedFields, currentChoose } = props;
  // const [currentLike, setCurrentLike] = useState<CheckboxValueType[]>([]);

  return (
    <>
      <div
        className="handle"
        onClick={() => {
          if (props.openDrawer) {
            props.openDrawer();
          }
        }}
      >
        <div className="add-icon"></div>
        提取字段
      </div>
      <div className="choosed-field">
        <div className="title">选定字段</div>
        <CheckboxGroup
          value={currentChoose}
          onChange={(checkedValue: CheckboxValueType[]) => {
            if (props.choosedFieldsChange) {
              props.choosedFieldsChange(checkedValue);
            }
          }}
        >
          {choosedFields.map((item: IFieldObj) => {
            const style: any = {};
            if (currentChoose.includes(item.value)) {
              style.color = "#5B7EE2";
            }
            return (
              <div key={item.value} className="check-item">
                <Checkbox value={item.value}>
                  <span style={style}>{item.label}</span>
                </Checkbox>
              </div>
            );
          })}
        </CheckboxGroup>
      </div>
      {/* <div className="like-field">
        <div className="title">猜你喜欢</div>
        <CheckboxGroup
          defaultValue={defaultLike}
          value={currentLike}
          onChange={(checkedValue: CheckboxValueType[]) => {
            setCurrentLike(checkedValue);
            console.log(props);
            if (props.likeFieldsChange) {
              console.log(checkedValue);
              props.likeFieldsChange(checkedValue);
            }
          }}
        >
          {likeFields.map((item: IFieldObj) => {
            const style: any = {};
            if (currentLike.includes(item.value)) {
              style.color = "#5B7EE2";
            }
            return (
              <div key={item.value} className="check-item">
                <Checkbox value={item.value}>
                  <span style={style}>{item.label}</span>
                </Checkbox>
              </div>
            );
          })}
        </CheckboxGroup>
      </div> */}
    </>
  );
};

export default FieldsHandle;
