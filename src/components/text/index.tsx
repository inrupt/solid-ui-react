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
import {
  Thing,
  SolidDataset,
  Url,
  UrlString,
  getStringInLocaleOne,
  getStringUnlocalizedOne,
  setStringInLocale,
  setStringUnlocalized,
  setThing,
  saveSolidDatasetAt,
  getFetchedFrom,
  hasResourceInfo,
} from "@inrupt/solid-client";

type Props = {
  dataSet: SolidDataset;
  property: Url | UrlString;
  thing: Thing;
  saveDatasetTo?: Url | UrlString;
  autosave?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  edit?: boolean;
  locale?: string;
  onSave?(): void | null;
  onError?(error: Error): void | null;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function Text({
  thing,
  dataSet,
  property,
  saveDatasetTo,
  locale,
  onSave,
  onError,
  edit,
  autosave,
  inputProps,
  ...other
}: Props): ReactElement {
  const [text, setText] = useState<string | null>("");
  const [initialValue, setInitialValue] = useState<string | null>("");

  useEffect(() => {
    if (locale) {
      setText(getStringInLocaleOne(thing, property, locale));
    } else {
      setText(getStringUnlocalizedOne(thing, property));
    }
  }, [thing, property, locale]);
  /* Save text value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (initialValue !== e.target.value) {
      const newValue = e.target.value;
      let updatedResource: Thing;
      if (locale) {
        updatedResource = setStringInLocale(thing, property, newValue, locale);
      } else {
        updatedResource = setStringUnlocalized(thing, property, newValue);
      }

      const datasetSaveLocation = hasResourceInfo(dataSet)
        ? getFetchedFrom(dataSet)
        : saveDatasetTo;

      try {
        if (datasetSaveLocation) {
          await saveSolidDatasetAt(
            datasetSaveLocation,
            setThing(dataSet, updatedResource)
          );
          if (onSave) {
            onSave();
          }
          return;
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    }
  };

  if (!hasResourceInfo(dataSet) && !saveDatasetTo && autosave) {
    throw new Error("Please provide saveDatasetTo location for new data");
  }

  return (
    <>
      {
        // eslint-disable-next-line react/jsx-props-no-spreading
        !edit && <span {...other}>{text}</span>
      }
      {edit && (
        <input
          type={inputProps && inputProps.type ? inputProps.type : "text"}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
          onFocus={(e) => setInitialValue(e.target.value)}
          onChange={(e) => setText(e.target.value)}
          onBlur={(e) => autosave && saveHandler(e)}
          value={text || ""}
        />
      )}
    </>
  );
}

Text.defaultProps = {
  autosave: false,
  edit: false,
};
