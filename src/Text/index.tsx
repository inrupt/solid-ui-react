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

type Props = {
  className?: string;
  dataSet: LitDataset & WithResourceInfo;
  predicate: UrlString | string;
  thing: Thing;
  autosave?: boolean;
  edit?: boolean;
  locale?: string;
  onSave?(): void | null;
  onError?(): (error: Error) => void | null;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Text({
  thing,
  dataSet,
  predicate,
  locale,
  className,
  onSave,
  onError,
  edit,
  autosave,
  ...inputOptions
}: Props): ReactElement {
  const [text, setText] = useState<string | null>("");

  useEffect(() => {
    if (locale) {
      setText(LitPodFns.getStringInLocaleOne(thing, predicate, locale));
    } else {
      setText(LitPodFns.getStringUnlocalizedOne(thing, predicate));
    }
  }, [thing, predicate, locale]);

  /* Save text value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    let updatedResource: LitPodFns.Thing;
    if (locale) {
      updatedResource = LitPodFns.setStringInLocale(
        thing,
        predicate,
        newValue,
        locale
      );
    } else {
      updatedResource = LitPodFns.setStringUnlocalized(
        thing,
        predicate,
        newValue
      );
    }
    try {
      await saveLitDatasetAt(
        getFetchedFrom(dataSet),
        setThing(dataSet, updatedResource)
      );
      if (onSave) {
        onSave();
      }
    } catch (error) {
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <>
      {!edit && <span className={className}>{text}</span>}
      {edit && (
        <input
          type="text"
          className={className}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => autosave && saveHandler(e)}
          value={text || ""}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputOptions}
        />
      )}
    </>
  );
}

Text.defaultProps = {
  autosave: false,
  className: null,
  edit: false,
};
