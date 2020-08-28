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
  getStringInLocaleOne,
  getStringUnlocalizedOne,
  setStringInLocale,
  setStringUnlocalized,
  setThing,
  saveSolidDatasetAt,
  getFetchedFrom,
  hasResourceInfo,
  getBoolean,
  getDatetime,
  getDecimal,
  getInteger,
  getUrl,
  setBoolean,
  setDatetime,
  setDecimal,
  setInteger,
  setUrl,
} from "@inrupt/solid-client";
import DatasetContext from "../../context/datasetContext";
import ThingContext from "../../context/thingContext";
import SessionContext from "../../context/sessionContext";

export type DataType =
  | "boolean"
  | "datetime"
  | "decimal"
  | "integer"
  | "string"
  | "url";

export type Props = {
  dataSet?: SolidDataset;
  property: Url | UrlString;
  thing?: Thing;
  dataType: DataType;
  saveDatasetTo?: Url | UrlString;
  autosave?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  edit?: boolean;
  locale?: string;
  onSave?(): void | null;
  onError?(error: Error): void | null;
} & React.HTMLAttributes<HTMLSpanElement>;

export default function Value({
  thing: propThing,
  dataSet: propDataset,
  property,
  dataType,
  saveDatasetTo,
  locale,
  onSave,
  onError,
  edit,
  autosave,
  inputProps,
  ...other
}: Props): ReactElement {
  const { fetch } = useContext(SessionContext);
  const [value, setValue] = useState<string | number | boolean | null>("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setErrorState] = useState<string | null>();
  const [initialValue, setInitialValue] = useState<string | number | null>("");

  const datasetContext = useContext(DatasetContext);
  const { dataset: contextDataset } = datasetContext;

  const thingContext = useContext(ThingContext);
  const { thing: contextThing } = thingContext;

  const dataset = propDataset || contextDataset;
  const thing = propThing || contextThing;

  useEffect(() => {
    if (thing) {
      switch (dataType) {
        case "boolean":
          setValue(getBoolean(thing, property) ?? false);
          break;
        case "datetime": {
          const datetime = getDatetime(thing, property);
          const datetimeString = datetime
            ? datetime
                .toISOString()
                .substring(0, datetime.toISOString().length - 5)
            : null;
          setValue(datetimeString);
          break;
        }
        case "decimal":
          setValue(getDecimal(thing, property));
          break;
        case "integer":
          setValue(getInteger(thing, property));
          break;
        case "url":
          setValue(getUrl(thing, property));
          break;
        default:
          if (locale) {
            setValue(getStringInLocaleOne(thing, property, locale));
          } else {
            setValue(getStringUnlocalizedOne(thing, property));
          }
      }
    }
  }, [thing, property, locale, dataType]);

  /* Save Value value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      initialValue !== value &&
      thing &&
      dataset &&
      e.target.reportValidity()
    ) {
      let updatedResource = thing;
      switch (dataType) {
        case "boolean":
          updatedResource = setBoolean(thing, property, value as boolean);
          break;
        case "datetime":
          updatedResource = setDatetime(thing, property, new Date(`${value}Z`));
          break;
        case "decimal": {
          updatedResource = setDecimal(
            thing,
            property,
            parseFloat(value as string)
          );

          break;
        }
        case "integer": {
          updatedResource = setInteger(
            thing,
            property,
            parseInt(value as string, 10)
          );

          break;
        }
        case "url":
          updatedResource = setUrl(thing, property, value as string);
          break;
        default:
          if (locale) {
            updatedResource = setStringInLocale(
              thing,
              property,
              value as string,
              locale
            );
          } else {
            updatedResource = setStringUnlocalized(
              thing,
              property,
              value as string
            );
          }
      }

      try {
        if (saveDatasetTo) {
          await saveSolidDatasetAt(
            saveDatasetTo,
            setThing(dataset, updatedResource),
            { fetch }
          );
        } else if (hasResourceInfo(dataset)) {
          await saveSolidDatasetAt(
            getFetchedFrom(dataset),
            setThing(dataset, updatedResource),
            { fetch }
          );
        } else {
          setErrorState(() => {
            throw new Error(
              "Please provide saveDatasetTo location for new data"
            );
          });
        }
        if (onSave) {
          onSave();
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
    return <span>fetching data in progress</span>;
  }

  let inputType;
  switch (dataType) {
    case "boolean":
      inputType = "checkbox";
      break;
    case "datetime":
      inputType = "datetime-local";
      break;
    case "decimal":
      inputType = "number";
      break;
    case "integer":
      inputType = "number";
      break;
    case "url":
      inputType = "url";
      break;
    default:
      inputType = "text";
  }

  return (
    <>
      {
        // eslint-disable-next-line react/jsx-props-no-spreading
        !edit && dataset && thing && <span {...other}>{`${value}`}</span>
      }
      {edit && dataset && thing && (
        <input
          type={inputType}
          checked={
            dataType === "boolean" && typeof value === "boolean"
              ? value
              : undefined
          }
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
          onFocus={(e) => setInitialValue(e.target.value)}
          onChange={(e) => {
            if (dataType === "boolean") {
              setValue(e.target.checked);
            } else {
              setValue(e.target.value);
            }
          }}
          onBlur={(e) => autosave && saveHandler(e)}
          value={
            dataType !== "boolean" && typeof value !== "boolean"
              ? value || ""
              : "on"
          }
          pattern={
            dataType === "datetime"
              ? "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
              : undefined
          }
          placeholder={dataType === "datetime" ? "yyyy-mm-ddThh:mm" : undefined}
        />
      )}
    </>
  );
}

Value.defaultProps = {
  autosave: false,
  edit: false,
};
