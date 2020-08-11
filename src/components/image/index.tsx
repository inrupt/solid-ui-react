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
import { Thing, Url, UrlString, getUrl } from "@inrupt/solid-client";
import { overwriteFile, retrieveFile } from "../../helpers";

type Props = {
  thing: Thing;
  property: Url | UrlString;
  edit?: boolean;
  autosave?: boolean;
  maxSize?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onSave?: () => void;
  onError?: (error: Error) => void;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export default function Image({
  property,
  thing,
  edit,
  autosave,
  onSave,
  onError,
  maxSize,
  alt,
  inputProps,
  ...imgOptions
}: Props): ReactElement {
  const src = getUrl(thing, property);
  if (!src) {
    throw new Error("URL not found for given property");
  }
  const [imgObjectUrl, setImgObjectUrl] = useState("");

  useEffect(() => {
    retrieveFile(src)
      .then(setImgObjectUrl)
      .catch((error) => {
        if (onError) {
          onError(error);
        } else {
          setImgObjectUrl(() => {
            throw error;
          });
        }
      });
  }, [src, onError]);

  const handleChange = async (input: EventTarget & HTMLInputElement) => {
    const fileList = input.files;
    if (autosave && fileList && fileList.length > 0) {
      const newObjectUrl = await overwriteFile(
        src,
        fileList[0],
        input,
        maxSize,
        onSave,
        onError
      );
      if (newObjectUrl) {
        setImgObjectUrl(newObjectUrl);
      }
    }
  };
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <img src={imgObjectUrl} alt={alt ?? ""} {...imgOptions} />
      {edit && (
        <input
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
          type="file"
          accept="image/*"
          onChange={(e) => handleChange(e.target)}
        />
      )}
    </>
  );
}
