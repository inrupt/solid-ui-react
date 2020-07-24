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

interface IText {
  dataSet: LitPodFns.LitDataset;
  thing: LitPodFns.Thing;
  locale?: string;
  edit?: boolean;
  inputOptions?: Record<string, unknown>;
  autosave?: boolean;
  onSave?(): void;
  predicate: string;
}

export default function Text(props: IText): ReactElement {
  const {
    dataSet,
    thing,
    locale,
    edit,
    inputOptions,
    autosave,
    predicate,
    onSave,
  } = props;

  const [text, setText] = useState<string | null>("");

  useEffect(() => {
    setText(
      LitPodFns.getStringUnlocalizedOne(thing, "http://xmlns.com/foaf/0.1/name")
    );
  }, [thing]);

  // const saveResource = async () => {
  //   try {
  //     await litPodFns.saveLitDatasetAt(predicate, thing);
  //     if (onSave) {
  //       onSave();
  //     }
  //     return "saved";
  //   } catch (error) {
  //     return error.message;
  //   }
  // };

  /* Save text value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const {
      datasetInfo: { fetchedFrom },
    } = dataSet;
    const updatedResource = LitPodFns.setStringUnlocalized(
      thing,
      predicate,
      newValue
    );
    const updatedProfileResource = LitPodFns.setThing(
      fetchedFrom,
      updatedResource
    );
    try {
      await LitPodFns.saveLitDatasetAt(predicate, updatedProfileResource);
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
      {!edit && <span>{text}</span>}
      {edit && (
        <input
          type="text"
          // onChange={(e) => setText(e.target.value)}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => saveHandler(e)}
          value={text}
        />
      )}
    </>
  );
}

Text.defaultProps = {
  locale: null,
  inputOptions: {},
  autosave: false,
  edit: false,
  // onSave(): () => {}
};
