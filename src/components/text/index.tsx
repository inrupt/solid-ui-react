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

import React, { ReactElement, useState, useEffect, useContext } from "react";
import {
  Thing,
  SolidDataset,
  Url,
  UrlString,
  getStringWithLocale,
  getStringNoLocale,
  setStringWithLocale,
  setStringNoLocale,
  setThing,
  saveSolidDatasetAt,
  getSourceUrl,
  hasResourceInfo,
} from "@inrupt/solid-client";
import DatasetContext from "../../context/datasetContext";
import ThingContext from "../../context/thingContext";
import { SessionContext } from "../../context/sessionContext";

export type Props = {
  dataSet?: SolidDataset;
  property: Url | UrlString;
  thing?: Thing;
  saveDatasetTo?: Url | UrlString;
  autosave?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  edit?: boolean;
  locale?: string;
  onSave?(savedDataset?: SolidDataset, savedThing?: Thing): void | null;
  onError?(error: Error): void | null;
};

export function Text({
  thing: propThing,
  dataSet: propDataset,
  property,
  saveDatasetTo,
  locale,
  onSave,
  onError,
  edit,
  autosave,
  inputProps,
  ...other
}: Props & React.HTMLAttributes<HTMLSpanElement>): ReactElement {
  const { fetch } = useContext(SessionContext);

  const datasetContext = useContext(DatasetContext);
  const { dataset: contextDataset, setDataset } = datasetContext;

  const thingContext = useContext(ThingContext);
  const { thing: contextThing } = thingContext;

  const [text, setText] = useState<string | null>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setErrorState] = useState<string | null>();
  const [initialValue, setInitialValue] = useState<string | null>("");

  const dataset = propDataset || contextDataset;
  const thing = propThing || contextThing;

  useEffect(() => {
    if (thing) {
      if (locale) {
        setText(getStringWithLocale(thing, property, locale));
      } else {
        setText(getStringNoLocale(thing, property));
      }
    }
  }, [thing, property, locale]);

  /* Save text value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (initialValue !== e.target.value && thing && dataset) {
      const newValue = e.target.value;
      let updatedResource: Thing;
      if (locale) {
        updatedResource = setStringWithLocale(
          thing,
          property,
          newValue,
          locale
        );
      } else {
        updatedResource = setStringNoLocale(thing, property, newValue);
      }

      try {
        let savedDataset;
        if (saveDatasetTo) {
          savedDataset = await saveSolidDatasetAt(
            saveDatasetTo,
            setThing(dataset, updatedResource),
            { fetch }
          );

          if (contextDataset) {
            setDataset(savedDataset);
          }
        } else if (hasResourceInfo(dataset)) {
          savedDataset = await saveSolidDatasetAt(
            getSourceUrl(dataset),
            setThing(dataset, updatedResource),
            { fetch }
          );

          if (contextDataset) {
            setDataset(savedDataset);
          }
        } else {
          setErrorState(() => {
            throw new Error(
              "Please provide saveDatasetTo location for new data"
            );
          });
        }
        if (onSave) {
          onSave(savedDataset, updatedResource);
        }
      } catch (error) {
        if (onError) {
          onError(error);
        } else {
          setErrorState(() => {
            throw error;
          });
        }
      }
    }
  };

  if (!dataset && !thing) {
    // TODO: provide option for user to pass in loader
    return <h3>fetching data in progress</h3>;
  }

  return (
    <>
      {
        // eslint-disable-next-line react/jsx-props-no-spreading
        !edit && dataset && thing && <span {...other}>{text}</span>
      }
      {edit && dataset && thing && (
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
