import FieldContext, {HOOK_MARK} from 'rc-field-form/es/FieldContext';
import {useCallback, useContext} from "react";
import {NamePath, Store, InternalNamePath, Meta, InternalHooks} from 'rc-field-form/es/interface';
import {getNamePath, setValue, getValue} from 'rc-field-form/es/utils/valueUtil';

function mergePrefixName(prefixName: InternalNamePath, nameList: NamePath[]) {
  return nameList.map((name) => [...prefixName, ...getNamePath(name)])
}

export default function useCurrentForm() {
  const context = useContext(FieldContext);
  const {
    prefixName = [],
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    validateFields,
    resetFields,
    getInternalHooks,
  } = context;

  const getLocalNameList = useCallback(() => {
    const hooks = getInternalHooks(HOOK_MARK) as InternalHooks;
    const fields = hooks.getFields();

    return fields.reduce((acc: InternalNamePath[], field) => {
      const {name} = field;

      if (!Array.isArray(name)) {
        return acc;
      }

      if (prefixName.every((prefix, i) => prefix === name[i])) {
        acc.push(name);
      }

      return acc;
    }, []);
  }, [prefixName, getInternalHooks]);

  /**
   * 获取本地表单域值
   * */
  const getLocalFieldValue = useCallback((name: NamePath) => {
    return getFieldValue([...prefixName, ...getNamePath(name)]);
  }, [prefixName, getFieldValue]);

  /**
   * 获取本地表单域值
   * */
  const getLocalFieldsValue = useCallback((
    nameList?: NamePath[] | true,
    filterFunc?: (meta: Meta) => boolean,
  ) => {
    if (!prefixName.length) {
      return getFieldsValue(nameList, filterFunc);
    }

    if (!nameList || nameList === true) {
      const value = getFieldsValue([prefixName], filterFunc);
      return getValue(value, prefixName);
    }

    const value = getFieldsValue(mergePrefixName(prefixName, nameList), filterFunc);
    return getValue(value, prefixName);
  }, [prefixName, getFieldsValue]);

  /**
   * 设置本地表单域值
   * */
  const setLocalFieldsValue = useCallback((value: Store) => {
    return setFieldsValue(setValue({}, prefixName, value));
  }, [prefixName, setFieldsValue]);

  /**
   * 校验本地表单域
   * */
  const validateLocalFields = useCallback((nameList?: NamePath[]) => {
    if (!prefixName.length) {
      return validateFields(nameList);
    }

    if (nameList && nameList.length > 0) {
      return validateFields(mergePrefixName(prefixName, nameList))
    }

    return validateFields(getLocalNameList());
  }, [
    prefixName,
    validateFields,
    getLocalNameList,
  ]);

  /**
   * 重置本地表单域
   * */
  const resetLocalFields = useCallback((fields?: NamePath[]) => {
    if (!prefixName.length) {
      return resetFields(fields);
    }

    if (fields && fields.length > 0) {
      return resetFields(mergePrefixName(prefixName, fields))
    }

    return resetFields(getLocalNameList());
  }, [
    prefixName,
    resetFields,
    getLocalNameList
  ]);

  return [{
    getFieldsValue,
    getFieldValue,
    setFieldsValue,
    validateFields,
    resetFields,
    getLocalFieldValue,
    getLocalFieldsValue,
    setLocalFieldsValue,
    validateLocalFields,
    resetLocalFields,
  }]
}
