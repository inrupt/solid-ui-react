/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, { ReactElement } from "react";
import * as LitPodFns from "@solid/lit-pod";

enum DATA_TYPES {
  Boolean = "Boolean",
  Datetime = "Datetime",
  Decimal = "Decimal",
  Integer = "Integer",
  String = "String",
}

// TODO: finish implementing. Make typescript happy. Implement edit mode.

const DATA_TYPE_TO_FN = {
  [DATA_TYPES.Boolean]: LitPodFns.getBooleanOne,
}

interface IValue {
  thing: LitPodFns.Thing;
  dataType: DATA_TYPES;
  locale?: string;
  edit: boolean;
  inputOptions?: Object;
  autosave: boolean;
  onSave: Function;
  predicate: string;
}

export default function Value(props: IValue): ReactElement {
  const {
    thing,
    dataType,
    locale,
    edit,
    inputOptions,
    autosave,
    predicate,
    onSave,
  } = props;

  let dataFnName = `get${dataType}One`;

  if (dataType === DATA_TYPES.String ) {
    dataFnName = "getStringNoLocaleOne";

    if (locale) {
      dataFnName = "getStringWithLocaleOne";
    }
  }

  const value = LitPodFns[dataFnName](thing, predicate, locale);

  return <span>{ value }</span>;
}