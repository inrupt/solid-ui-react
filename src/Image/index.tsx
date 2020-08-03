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

import React, { ReactElement, useEffect, useState } from "react";
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
  autoSave?: boolean;
  maxSize?: number;
  onSave?: () => void;
  onError?: (error: Error) => void;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export default function Link({
  property,
  thing,
  edit,
  // autoSave,
  // onSave,
  // onError,
  // maxSize,
  alt,
  ...imgOptions
}: Props): ReactElement {
  // const src = getUrlOne(thing, property);
  const src = "https://ldp.demo-ess.inrupt.com/andydavison/private/test.jpg";
  // const src = "https://andydavison.inrupt.net/private/test.jpg";
  if (!src) {
    throw new Error("URL not found for given property");
  }
  const [imgBase64, setImgBase64] = useState("");

  const fetchImage = async () => {
    const imageBlob = await fetchFile(src);
    const imageObjectUrl = URL.createObjectURL(imageBlob);
    setImgBase64(imageObjectUrl);
  };

  useEffect(() => {
    // eslint-disable-next-line no-void
    void fetchImage();
  }, [src]);

  const handleChange = async (fileList: FileList | null) => {
    // TODO do something for 0 files selected?
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      console.log("file", file);
      const response = await overwriteFile(src, file);
      console.log("response", response);
      // eslint-disable-next-line no-void
      void fetchImage();
    }
  };
  return (
    <>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <img src={imgBase64 ?? undefined} alt={alt ?? ""} {...imgOptions} />
      {edit && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleChange(e.target.files)}
        />
      )}
    </>
  );
}
