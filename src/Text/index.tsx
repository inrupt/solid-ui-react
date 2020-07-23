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

interface IText {
  // dataSet: LitPodFns.LitDataset;
  // thing: LitPodFns.Thing;
  locale?: string;
  edit?: boolean;
  inputOptions?: Record<string, unknown>;
  autosave?: boolean;
  // onSave(): void;
  // predicate: string;
}

export default function Text(props: IText): ReactElement {
  const {
    // dataSet,
    // thing,
    locale,
    edit,
    inputOptions,
    autosave,
    // predicate,
    // onSave,
  } = props;

  // const text = locale
  //   ? LitPodFns.getStringWithLocaleOne(thing, predicate, locale)
  //   : LitPodFns.getStringNoLocaleOne(thing, predicate, locale);

  const text = "hello world";

  /* Save text value in the pod */
  const saveHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // eslint-disable-next-line no-console
    console.debug("newValue", newValue);
    /* TODO: call lit-pod set and update functions */
    // onSave();
  };

  return (
    <>
      {!edit && <span>{text}</span>}
      {edit && (
        <input type="text" onBlur={(e) => saveHandler(e)} value={text} />
      )}
    </>
  );
}

Text.defaultProps = {
  locale: null,
  inputOptions: {},
  autosave: false,
  edit: false,
};
