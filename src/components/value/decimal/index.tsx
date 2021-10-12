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
  setDecimal,
} from "@inrupt/solid-client";
import { SessionContext } from "../../../context/sessionContext";

import { updateDataset, useProperty } from "../../../helpers";
import { Props } from "..";

type DecimalProps = Omit<Props, "locale" | "dataType">;

const DecimalValue: React.FC<DecimalProps> = (props: DecimalProps) => {
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
    type: "decimal",
    property: propProperty,
    properties: propProperties,
  });

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const formattedValue: string = thingValue?.toString() ?? "";

  const [value, setValue] = useState<string>(formattedValue);

  /* Save Value value in the pod */
  const saveHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      formattedValue !== value &&
      thing &&
      dataset &&
      e.target.reportValidity()
    ) {
      const updatedResource = setDecimal(
        thing,
        property,
        parseFloat(value as string)
      );
      try {
        let savedDataset;
        if (saveDatasetTo) {
          savedDataset = await saveSolidDatasetAt(
            saveDatasetTo,
            setThing(dataset, updatedResource),
            { fetch }
          );
          await updateDataset(saveDatasetTo, setDataset);
        } else if (hasResourceInfo(dataset)) {
          savedDataset = await saveSolidDatasetAt(
            getSourceUrl(dataset),
            setThing(dataset, updatedResource),
            { fetch }
          );
          await updateDataset(getSourceUrl(dataset), setDataset);
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
          onError(saveError as Error);
        }
      }
    }
  };

  return (
    <>
      {
        // eslint-disable-next-line react/jsx-props-no-spreading
        !edit && dataset && thing && <span {...other}>{`${value}`}</span>
      }
      {edit && dataset && thing && (
        <input
          type="number"
          step="any"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onBlur={(e) => autosave && saveHandler(e)}
          value={value}
        />
      )}
    </>
  );
};

DecimalValue.defaultProps = {
  autosave: false,
  edit: false,
};

export default DecimalValue;
