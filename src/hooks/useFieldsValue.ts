import {useCallback, useContext, useEffect, useState} from "react";
import {debounce} from 'lodash-es'
import FieldContext, {HOOK_MARK} from 'rc-field-form/es/FieldContext';
import {getValue, getNamePath} from 'rc-field-form/es/utils/valueUtil';
import {
  NamePath,
  InternalNamePath,
  FieldEntity,
  Store,
  ValuedNotifyInfo,
  InternalHooks,
} from 'rc-field-form/es/interface';

interface UseFieldsProps {
  names?: NamePath[];
  mode?: 'global' | 'local';
}

interface FiledProps {
  name?: NamePath;
}

class FakeField implements FieldEntity {
  public props: FiledProps;

  constructor(
    private name: InternalNamePath,
    private rerender: () => void
  ) {
    this.props = {name};
  }

  getErrors = () => [];

  getMeta = () => ({
    touched: false,
    validating: false,
    errors: [],
    name: this.name,
  });

  getNamePath = () => this.name;

  isFieldDirty = () => false;

  isFieldTouched = () => false;

  isFieldValidating = () => false;

  validateRules = () => Promise.resolve([]);

  onStoreChange = (prevStore: Store, namePathList: (InternalNamePath[] | null), info: ValuedNotifyInfo) => {
    const prevValue = getValue(prevStore, this.name);
    const curValue = getValue(info.store, this.name);

    if (prevValue !== curValue) {
      this.rerender();
    }
  };
}

export default function useFieldsValue(props: UseFieldsProps = {}) {
  const {names = [], mode = 'global'} = props;
  const {getFieldValue, prefixName = [], getInternalHooks} = useContext(FieldContext);
  const [, update] = useState({});

  const forceUpdate = useCallback(debounce(() => {
    update({});
  }, 100), []);

  useEffect(() => {
    const isGlobal = mode === 'global';
    const {registerField} = getInternalHooks(HOOK_MARK) as InternalHooks;

    const unregisters = names.map((name) => {
      return registerField(new FakeField(
        isGlobal ?
          getNamePath(name) :
          [...prefixName, ...getNamePath(name)],
        forceUpdate
      ));
    });

    return () => {
      unregisters.forEach((unregister) => unregister());
    }
  }, []);

  if (mode === 'global') {
    return names.map((name) => getFieldValue(name));
  }

  return names.map((name) => {
    return getFieldValue([...prefixName, ...getNamePath(name)]);
  });
}
