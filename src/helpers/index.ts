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

import {
  unstable_overwriteFile as unstableOverwriteFile,
  unstable_fetchFile as unstableFetchFile,
  Thing,
  UrlString,
  Url,
  getBoolean,
  getDatetime,
  getDecimal,
  getInteger,
  getUrl,
  getStringInLocaleOne,
  getStringUnlocalizedOne,
} from "@inrupt/solid-client";

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
    await unstableOverwriteFile(src, file, { fetch });
    if (onSave) {
      onSave();
    }
    const objectUrl = URL.createObjectURL(file);
    return objectUrl;
  } catch (error) {
    if (onError) {
      onError(error);
    }
    return null;
  }
};

export const retrieveFile = async (
  src: string,
  fetch: typeof window.fetch
): Promise<string> => {
  const imageBlob = await unstableFetchFile(src, { fetch });
  return URL.createObjectURL(imageBlob);
};

export function getValueByType(
  type: "boolean" | "datetime" | "decimal" | "integer" | "string" | "url",
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
        return getStringInLocaleOne(thing, property, locale);
      }
      return getStringUnlocalizedOne(thing, property);
  }
}

export default { overwriteFile, retrieveFile, getValueByType };
