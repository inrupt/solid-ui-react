//
// Copyright 2022 Inrupt Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
// Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
// INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
// PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
// HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
// SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import {
  overwriteFile as solidOverwriteFile,
  getFile,
  Thing,
  SolidDataset,
  UrlString,
  Url,
  getBoolean,
  getDatetime,
  getDecimal,
  getInteger,
  getUrl,
  getStringNoLocale,
  getStringWithLocale,
  getBooleanAll,
  getDatetimeAll,
  getDecimalAll,
  getIntegerAll,
  getStringNoLocaleAll,
  getStringWithLocaleAll,
  getUrlAll,
  getSolidDataset,
} from "@inrupt/solid-client";

import { useContext, useEffect, useState } from "react";

import ThingContext from "../context/thingContext";
import DatasetContext from "../context/datasetContext";

export type CommonProperties = {
  thing?: Thing;
  solidDataset?: SolidDataset;
  property?: Url | UrlString;
  properties?: Url[] | UrlString[];
  edit?: boolean;
  autosave?: boolean;
  onSave?: (savedDataset?: SolidDataset, savedThing?: Thing) => void;
  onError?: (error: Error) => void;
};

export const overwriteFile = async (
  src: string,
  file: File,
  input: EventTarget & HTMLInputElement,
  fetch: typeof window.fetch,
  maxSize?: number,
  onSave?: () => void,
  onError?: (error: Error) => void
): Promise<string | null> => {
  try {
    if (maxSize !== undefined && file.size > maxSize * 1024) {
      input.setCustomValidity(
        `The selected file must not be larger than ${maxSize}kB`
      );
      input.reportValidity();
      return null;
    }
    input.setCustomValidity("");
    await solidOverwriteFile(src, file, { fetch });
    if (onSave) {
      onSave();
    }
    const objectUrl = URL.createObjectURL(file);
    return objectUrl;
  } catch (error) {
    if (onError) {
      onError(error as Error);
    }
    return null;
  }
};

export const retrieveFile = async (
  src: string,
  fetch: typeof window.fetch
): Promise<Blob> => {
  const imageBlob = await getFile(src, { fetch });
  return imageBlob;
};

export type DataType =
  | "boolean"
  | "datetime"
  | "decimal"
  | "integer"
  | "string"
  | "url";

export function getValueByType(
  type: "boolean",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getBoolean>;

export function getValueByType(
  type: "datetime",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getDatetime>;

export function getValueByType(
  type: "decimal",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getDecimal>;

export function getValueByType(
  type: "integer",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getInteger>;

export function getValueByType(
  type: "string",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getStringNoLocale>;

export function getValueByType(
  type: "string",
  thing: Thing,
  property: UrlString | Url,
  locale: string
): ReturnType<typeof getStringWithLocale>;

export function getValueByType(
  type: "string",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getStringNoLocale>;

export function getValueByType(
  type: "url",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getUrl>;

export function getValueByType(
  type: DataType,
  thing: Thing,
  property: UrlString | Url,
  locale?: string
): string | boolean | number | Date | null;

export function getValueByType(
  type: DataType,
  thing: Thing,
  property: UrlString | Url,
  locale?: string
): string | boolean | number | Date | null {
  switch (type) {
    case "boolean":
      return getBoolean(thing, property);
    case "datetime":
      return getDatetime(thing, property);
    case "decimal":
      return getDecimal(thing, property);
    case "integer":
      return getInteger(thing, property);
    case "url":
      return getUrl(thing, property);
    default:
      if (locale) {
        return getStringWithLocale(thing, property, locale);
      }
      return getStringNoLocale(thing, property);
  }
}

export function getValueByTypeAll(
  type: "boolean",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getBooleanAll>;

export function getValueByTypeAll(
  type: "datetime",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getDatetimeAll>;

export function getValueByTypeAll(
  type: "decimal",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getDecimalAll>;

export function getValueByTypeAll(
  type: "integer",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getIntegerAll>;

export function getValueByTypeAll(
  type: "string",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getStringNoLocaleAll>;

export function getValueByTypeAll(
  type: "string",
  thing: Thing,
  property: UrlString | Url,
  locale: string
): ReturnType<typeof getStringWithLocaleAll>;

export function getValueByTypeAll(
  type: "string",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getStringNoLocaleAll>;

export function getValueByTypeAll(
  type: "url",
  thing: Thing,
  property: UrlString | Url
): ReturnType<typeof getUrlAll>;

export function getValueByTypeAll(
  type: DataType,
  thing: Thing,
  property: UrlString | Url,
  locale?: string
): Array<string | boolean | number | Date | null>;

export function getValueByTypeAll(
  type: DataType,
  thing: Thing,
  property: UrlString | Url,
  locale?: string
): Array<string | boolean | number | Date | null> {
  switch (type) {
    case "boolean":
      return getBooleanAll(thing, property);
    case "datetime":
      return getDatetimeAll(thing, property);
    case "decimal":
      return getDecimalAll(thing, property);
    case "integer":
      return getIntegerAll(thing, property);
    case "url":
      return getUrlAll(thing, property);
    default:
      if (locale) {
        return getStringWithLocaleAll(thing, property, locale);
      }
      return getStringNoLocaleAll(thing, property);
  }
}

export function getPropertyForThing(
  propertySelector: typeof getValueByType | typeof getValueByTypeAll,
  type: DataType,
  thing: Thing,
  properties: Array<Url | UrlString>,
  locale?: string
): Url | UrlString | undefined {
  return (
    properties.find((property: Url | UrlString) => {
      return propertySelector(type, thing, property, locale);
    }) || properties[0]
  );
}

export type UseProperty = {
  dataset?: SolidDataset;
  thing?: Thing;
  error?: Error;
  property: Url | UrlString;
  value: string | boolean | number | Date | null;
  setDataset: (dataset: SolidDataset) => void;
  setThing: (thing: Thing) => void;
};

export type UsePropertyProps = {
  thing?: Thing;
  dataset?: SolidDataset;
  property?: Url | UrlString;
  properties?: Url[] | UrlString[];
  type: DataType;
  locale?: string;
};

export function useProperty(props: UsePropertyProps): UseProperty {
  const {
    dataset: propDataset,
    thing: propThing,
    properties: propProperties,
    property: propProperty,
    type,
    locale,
  } = props;

  const { solidDataset: contextDataset, setDataset = () => {} } =
    useContext(DatasetContext);

  const dataset = propDataset || contextDataset;

  const { thing: contextThing, setThing = () => {} } = useContext(ThingContext);

  const thing = propThing || contextThing || undefined;
  let error;

  if (!thing) {
    error = new Error("Thing not found as property or in context");
  }

  const property =
    thing && propProperties
      ? getPropertyForThing(
          getValueByType,
          type,
          thing,
          propProperties,
          locale
        ) || propProperties[0]
      : propProperty;

  if (!property) {
    throw new Error("No property provided");
  }

  const value =
    thing && property ? getValueByType(type, thing, property, locale) : null;

  return {
    dataset,
    thing,
    property,
    error,
    value,
    setDataset,
    setThing,
  };
}

export function useDatetimeBrowserSupport(): boolean | null {
  const [isDatetimeSupported, setIsDatetimeSupported] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    const test = document.createElement("input");
    test.type = "datetime-local";
    setIsDatetimeSupported(test.type !== "text");
  }, []);

  return isDatetimeSupported;
}

export async function updateDataset(
  datasetUrl: string | Url,
  setDataset: (dataset: SolidDataset) => void
): Promise<void> {
  const latestDataset = await getSolidDataset(datasetUrl);
  setDataset(latestDataset);
}
