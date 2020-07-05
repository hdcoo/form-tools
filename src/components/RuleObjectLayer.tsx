import React, {useEffect} from "react";
import {Form, Select} from "antd";
import useFieldsValue from "../hooks/useFieldsValue";
import useCurrentForm from "../hooks/useCurrentForm";
import FormAccess from "./FormAccess";
import Merchant from "./Merchant";

const RuleObjectLayer = () => {
  const [ruleName] = useFieldsValue({
    names: ['ruleName']
  });

  const [form] = useCurrentForm();

  // @ts-ignore
  window.localForm = form;

  console.log(form.getLocalFieldsValue());

  useEffect(() => {
    form.setLocalFieldsValue({
      ruleLayer: 2,
    });
  }, []);

  return (
    <>
      <Form.Item
        name="ruleLayer"
        label="适用维度"
      >
        <Select options={[
          {value: 1, label: '维度1'},
          {value: 2, label: '维度2'}
        ]} />
      </Form.Item>
      {ruleName === 1 &&
        <Form.Item
          name="ruleId"
          label="适用对象"
          rules={[
            {required: true, message: '请选择适用对象'}
          ]}
        >
          <Select options={[
            {value: 1, label: '规则1'},
            {value: 2, label: '规则2'}
          ]} />
        </Form.Item>
      }
      <FormAccess name="merchant">
        <Merchant />
      </FormAccess>
    </>
  )
};

export default RuleObjectLayer;
