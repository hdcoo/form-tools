import React, {PropsWithChildren, useContext} from "react";
import FieldContext from 'rc-field-form/es/FieldContext';
import {getNamePath} from 'rc-field-form/es/utils/valueUtil';
import {NamePath, InternalNamePath} from 'rc-field-form/es/interface';

interface FormAccessProps {
  name: NamePath;
}

const FormAccess = (props: PropsWithChildren<FormAccessProps>) => {
  const {name, children} = props;
  const context = useContext(FieldContext);
  const parentPrefixName = getNamePath(context.prefixName || []);
  const prefixName: InternalNamePath = [...parentPrefixName, ...getNamePath(name)];

  return (
    <FieldContext.Provider value={{...context, prefixName}}>
      {children}
    </FieldContext.Provider>
  )
};

export default FormAccess;
