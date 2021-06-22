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

import React, { useState, useEffect, useContext } from "react";
import {
  setThing,
  saveSolidDatasetAt,
  getSourceUrl,
  hasResourceInfo,
  setDatetime,
  getSolidDataset,
} from "@inrupt/solid-client";
import { SessionContext } from "../../../context/sessionContext";

import { useProperty, useDatetimeBrowserSupport } from "../../../helpers";
import { Props } from "..";

type DatetimeProps = Omit<Props, "locale" | "dataType">;

const DatetimeValue: React.FC<DatetimeProps> = (props: DatetimeProps) => {
  const {
    thing: propThing,
    solidDataset: propDataset,
    property: propProperty,
    properties: propProperties,
    saveDatasetTo,
    onSave,
    onError,
    edit,
    autosave,
    inputProps,
    ...other
  } = props;

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
    type: "datetime",
    property: propProperty,
    properties: propProperties,
  });

  const isDatetimeSupported = useDatetimeBrowserSupport();

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const formattedValue = thingValue
    ? (thingValue as Date)
        .toISOString()
        .substring(0, (thingValue as Date).toISOString().length - 5)
    : null;

  const [value, setValue] = useState<string>(formattedValue as string);

  let initialDateValue = "";
  if (!isDatetimeSupported) {
    initialDateValue = value?.split(/T(.+)/)[0].toString();
  }

  let initialTimeValue = "00:00";
  if (!isDatetimeSupported) {
    initialTimeValue = value?.split(/T(.+)/)[1]?.toString();
  }

  const [time, setTime] = useState<string>(initialTimeValue);
  const [date, setDate] = useState<string>(initialDateValue);

  useEffect(() => {
    if ((!time && !date) || isDatetimeSupported) return;
    setValue(`${date ?? ""}T${time ?? "00:00"}`);
  }, [time, date, isDatetimeSupported]);

  /* Save Value value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      formattedValue !== value &&
      thing &&
      dataset &&
      e.target.reportValidity()
    ) {
      const datetimeValue = value;

      const updatedResource = setDatetime(
        thing,
        property,
        new Date(`${datetimeValue}Z`)
      );

      try {
        let savedDataset;
        if (saveDatasetTo) {
          savedDataset = await saveSolidDatasetAt(
            saveDatasetTo,
            setThing(dataset, updatedResource),
            { fetch }
          );

          const latestDataset = await getSolidDataset(saveDatasetTo);
          setDataset(latestDataset);
        } else if (hasResourceInfo(dataset)) {
          savedDataset = await saveSolidDatasetAt(
            getSourceUrl(dataset),
            setThing(dataset, updatedResource),
            { fetch }
          );

          const latestDataset = await getSolidDataset(getSourceUrl(dataset));
          setDataset(latestDataset);
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

  let inputType: string;

  if (isDatetimeSupported) {
    inputType = "datetime-local";
  } else {
    inputType = "datetime-workaround";
  }

  return (
    <>
      {
        // eslint-disable-next-line react/jsx-props-no-spreading
        !edit && dataset && thing && <span {...other}>{`${value}`}</span>
      }
      {edit && dataset && thing && inputType === "datetime-local" && (
        <input
          type={inputType}
          aria-label="Date and Time"
          step="any"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={(e) => autosave && saveHandler(e)}
          value={value}
          pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}"
          placeholder="yyyy-mm-ddThh:mm"
        />
      )}
      {edit && dataset && thing && inputType === "datetime-workaround" && (
        <>
          <input
            type="date"
            aria-label="Date"
            step="any"
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...inputProps}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            onBlur={(e) => autosave && saveHandler(e)}
            value={date}
            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}"
            placeholder="yyyy-mm-dd"
          />
          <input
            type="time"
            aria-label="Time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            onBlur={(e) => autosave && saveHandler(e)}
            pattern="[0-9]{2}:[0-9]{2}"
          />
        </>
      )}
    </>
  );
};

DatetimeValue.defaultProps = {
  autosave: false,
  edit: false,
};

export default DatetimeValue;
