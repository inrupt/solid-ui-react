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

import React, { ReactElement, useEffect, useState, useCallback } from "react";
import {
  Thing,
  Url,
  UrlString,
  getUrlOne,
  unstable_overwriteFile as overwriteFile,
  unstable_fetchFile as fetchFile,
} from "@inrupt/solid-client";

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
  const src = getUrlOne(thing, property);
  if (!src) {
    throw new Error("URL not found for given property");
  }
  const [imgBase64, setImgBase64] = useState("");

  const fetchImage = useCallback(async () => {
    const imageBlob = await fetchFile(src);
    const imageObjectUrl = URL.createObjectURL(imageBlob);
    setImgBase64(imageObjectUrl);
  }, [src]);

  useEffect(() => {
    // eslint-disable-next-line no-void
    void fetchImage();
  }, [fetchImage]);

  const handleChange = async (input: EventTarget & HTMLInputElement) => {
    const fileList = input.files;
    if (autosave && fileList && fileList.length > 0) {
      try {
        const file = fileList[0];
        if (maxSize !== undefined && file.size > maxSize * 1024) {
          input.setCustomValidity(
            `The selected file must not be larger than ${maxSize}kB`
          );
          input.reportValidity();
          return;
        }
        input.setCustomValidity("");
        await overwriteFile(src, file);
        // eslint-disable-next-line no-void
        void fetchImage();
        if (onSave) {
          onSave();
        }
      } catch (error) {
        if (onError) {
          onError(error);
        }
      }
    }
  };
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <img src={imgBase64} alt={alt ?? ""} {...imgOptions} />
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
