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
  Url,
  UrlString,
  setStringWithLocale,
  setStringNoLocale,
  setThing,
  saveSolidDatasetAt,
  getSourceUrl,
  hasResourceInfo,
  setBoolean,
  setDatetime,
  setDecimal,
  setInteger,
  setUrl,
} from "@inrupt/solid-client";
import { SessionContext } from "../../context/sessionContext";

import {
  DataType,
  CommonProperties,
  useProperty,
  UseDatetimeBrowserSupport,
} from "../../helpers";

export type Props = {
  dataType: DataType;
  saveDatasetTo?: Url | UrlString;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  locale?: string;
} & CommonProperties &
  React.HTMLAttributes<HTMLSpanElement>;

/**
 * Retrieves and displays a value of one of a range of types from a given [Dataset](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-SolidDataset)/[Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing)/property. Can also be used to set/update and persist a value.
 */
export function Value({
  thing: propThing,
  solidDataset: propDataset,
  property: propProperty,
  properties: propProperties,
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

  const {
    value: thingValue,
    thing,
    property,
    dataset,
    setDataset,
    error,
  } = useProperty({
    dataset: propDataset,
    thing: propThing,
    property: propProperty,
    properties: propProperties,
    type: dataType,
    locale,
  });

  const isDatetimeSupported = UseDatetimeBrowserSupport();

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  let formattedValue = thingValue;
  let initialBooleanValue = false;

  if (dataType === "boolean") {
    initialBooleanValue = (thingValue as boolean | null) ?? false;
    formattedValue = initialBooleanValue.toString();
  } else if (dataType === "datetime") {
    formattedValue = thingValue
      ? (thingValue as Date)
          .toISOString()
          .substring(0, (thingValue as Date).toISOString().length - 5)
      : null;
  } else if (dataType !== "string") {
    formattedValue = thingValue?.toString() || "";
  }

  const [value, setValue] = useState<string>(formattedValue as string);

  const [booleanValue, setBooleanValue] = useState<boolean>(
    initialBooleanValue as boolean
  );

  useEffect(() => {
    if (dataType === "boolean") {
      setValue(booleanValue.toString());
    }
  }, [booleanValue, dataType]);

  let initialDateValue = "";
  if (
    dataType === "datetime" &&
    !isDatetimeSupported &&
    typeof value === "string"
  ) {
    initialDateValue = value?.split(/T(.+)/)[0].toString();
  }

  let initialTimeValue = "00:00";
  if (
    dataType === "datetime" &&
    !isDatetimeSupported &&
    typeof value === "string"
  ) {
    initialTimeValue = value?.split(/T(.+)/)[1].toString();
  }

  const [time, setTime] = useState<string>(initialTimeValue as string);
  const [date, setDate] = useState<string>(initialDateValue as string);

  useEffect(() => {
    if ((!time && !date) || dataType !== "datetime") return;
    setValue(`${date || ""}T${time || "00:00"}`);
  }, [time, date, dataType]);

  /* Save Value value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      formattedValue !== value &&
      thing &&
      dataset &&
      e.target.reportValidity()
    ) {
      let updatedResource = thing;
      const datetimeValue = value;

      switch (dataType) {
        case "boolean":
          updatedResource = setBoolean(
            thing,
            property,
            booleanValue as boolean
          );
          break;
        case "datetime":
          updatedResource = setDatetime(
            thing,
            property,
            new Date(`${datetimeValue}Z`)
          );
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
            updatedResource = setStringWithLocale(
              thing,
              property,
              value as string,
              locale
            );
          } else {
            updatedResource = setStringNoLocale(
              thing,
              property,
              value as string
            );
          }
      }

      try {
        let savedDataset;
        if (saveDatasetTo) {
          savedDataset = await saveSolidDatasetAt(
            saveDatasetTo,
            setThing(dataset, updatedResource),
            { fetch }
          );

          setDataset(savedDataset);
        } else if (hasResourceInfo(dataset)) {
          savedDataset = await saveSolidDatasetAt(
            getSourceUrl(dataset),
            setThing(dataset, updatedResource),
            { fetch }
          );

          setDataset(savedDataset);
        } else if (onError) {
          onError(
            new Error("Please provide saveDatasetTo location for new data")
          );
        }

        if (!error && onSave) {
          onSave(savedDataset, updatedResource);
        }
      } catch (saveError) {
        if (onError) {
          onError(saveError);
        }
      }
    }
  };

  if (!dataset && !thing) {
    // TODO: provide option for user to pass in loader
    return <span>fetching data in progress</span>;
  }

  let inputType: string | undefined;
  let inputStep;

  switch (dataType) {
    case "boolean":
      inputType = "checkbox";
      break;
    case "datetime":
      inputType = isDatetimeSupported ? "datetime-local" : "date";
      inputStep = "any";
      break;
    case "decimal":
      inputType = "number";
      inputStep = "any";
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
      {edit && dataset && thing && inputType !== "date" && (
        <input
          type={inputType}
          checked={booleanValue}
          step={inputStep}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
          onChange={(e) => {
            if (dataType === "boolean") {
              setBooleanValue(e.target.checked);
            } else {
              setValue(e.target.value);
            }
          }}
          onBlur={(e) => autosave && saveHandler(e)}
          value={value}
          pattern={
            dataType === "datetime"
              ? "[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
              : undefined
          }
          placeholder={dataType === "datetime" ? "yyyy-mm-ddThh:mm" : undefined}
        />
      )}
      {edit && dataset && thing && inputType === "date" && (
        <>
          <input
            type={inputType}
            step={inputStep}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...inputProps}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            onBlur={(e) => autosave && saveHandler(e)}
            value={date}
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
            placeholder="yyyy-mm-ddThh:mm"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            onBlur={(e) => autosave && saveHandler(e)}
          />
        </>
      )}
    </>
  );
}

Value.defaultProps = {
  autosave: false,
  edit: false,
};
