import React, {useContext} from 'react';
import {Form, Input, Select} from "antd";
import RuleObjectLayer from "./components/RuleObjectLayer";
import FormAccess from "./components/FormAccess";

function App() {
  const [form] = Form.useForm();

  // @ts-ignore
  window.form = form;

  return (
    <div className="App">
      <Form
        initialValues={{ruleName: 1, ruleInfo: {ruleLayer: 1}}}
        form={form}
      >
        <Form.Item
          name="ruleName"
          label="规则名称"
        >
          <Select options={[{
            value: 1,
            label: '订单链路'
          }, {
            value: 2,
            label: '门店采购'
          }]} />
        </Form.Item>

        <Form.Item
          name="merchants"
          label="商户ID"
          rules={[
            {required: true, message: '请输入商户ID'}
          ]}
        >
          <Input.TextArea />
        </Form.Item>

        <FormAccess name="ruleInfo">
          <RuleObjectLayer />
        </FormAccess>

      </Form>
    </div>
  );
}

export default App;
