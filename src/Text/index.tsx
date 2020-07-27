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

import React, { ReactElement, useState, useEffect } from "react";
import * as LitPodFns from "@solid/lit-pod";

/* TODO: implement locale and autosave checks plus write tests */

interface IText {
  autosave?: boolean;
  className?: string;
  dataSet: LitPodFns.LitDataset;
  edit?: boolean;
  inputOptions?: Record<string, unknown>;
  locale?: string;
  onSave?: () => void;
  predicate: string;
  thing: LitPodFns.Thing;
}

export default function Text(props: IText): ReactElement {
  const {
    autosave,
    className,
    dataSet,
    edit,
    inputOptions,
    locale,
    onSave,
    predicate,
    thing,
  } = props;

  const [text, setText] = useState<string | null>("");

  let dataGetFnName = `getStringUnlocalizedOne`;
  let dataSetFnName = `setStringUnlocalized`;

  if (locale) {
    dataGetFnName = "getStringInLocaleOne";
    dataSetFnName = "setStringInLocale";
  }

  useEffect(() => {
    setText(LitPodFns[dataGetFnName](thing, predicate, locale));
  }, [thing, predicate, dataGetFnName, locale]);

  /* Save text value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    const {
      resourceInfo: { fetchedFrom },
    } = dataSet;

    const updatedResource = LitPodFns[dataSetFnName](
      thing,
      predicate,
      newValue,
      locale
    );

    const updatedProfileResource = LitPodFns.setThing(dataSet, updatedResource);

    try {
      await LitPodFns.saveLitDatasetAt(fetchedFrom, updatedProfileResource);
      if (onSave) {
        onSave();
      }
      return "saved";
    } catch (error) {
      return error.message;
    }
  };

  return (
    <>
      {!edit && <span className={className}>{text}</span>}
      {edit && (
        <input
          type="text"
          className={className}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputOptions}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => saveHandler(e)}
          value={text || ""}
        />
      )}
    </>
  );
}

Text.defaultProps = {
  autosave: false,
  className: null,
  edit: false,
  inputOptions: {},
  locale: null,
  onSave: () => {},
};
