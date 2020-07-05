import React, {useEffect} from "react";
import {Form, Select} from "antd";
import useCurrentForm from "../hooks/useCurrentForm";
import useFieldsValue from "../hooks/useFieldsValue";

const Merchant = () => {
  const [form] = useCurrentForm();
  const [ruleName] = useFieldsValue({
    names: ['ruleName']
  });
  const [merchantId] = useFieldsValue({
    names: ['merchantId'],
    mode: 'local',
  })

  console.log(ruleName, merchantId);

  // @ts-ignore
  window.merchantForm = form;

  console.log(form.getLocalFieldsValue());

  useEffect(() => {
  }, []);

  return (
    <>
      <Form.Item
        name="merchantId"
        label="商户"
        rules={[
          {required: true, message: '请选择'}
        ]}
      >
        <Select options={[
          {value: 1, label: '商户1'},
          {value: 2, label: '商户2'}
        ]} />
      </Form.Item>
    </>
  )
};

export default Merchant;
