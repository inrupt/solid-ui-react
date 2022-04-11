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

import React, { ReactElement, useContext } from "react";
import {
  Url,
  UrlString,
  saveFileInContainer,
  WithResourceInfo,
} from "@inrupt/solid-client";
import { SessionContext } from "../../context/sessionContext";

export type Props = {
  saveLocation: Url | UrlString;
  inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, "multiple">;
  autosave?: boolean;
  onSave?: (savedFile?: File & WithResourceInfo) => void;
  onError?: (error: Error) => void;
};

export function FileUpload({
  saveLocation,
  onError,
  onSave,
  inputProps,
  autosave,
}: Props & React.HTMLAttributes<HTMLSpanElement>): ReactElement {
  const { fetch } = useContext(SessionContext);

  const handleChange = async (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    // This is a typescript bug, as target.files should always be a FileList:
    if (!target.files) {
      return;
    }

    if (!autosave) {
      return;
    }

    try {
      const savedFile = await saveFileInContainer(
        saveLocation,
        target.files[0],
        {
          slug: target.files[0].name ? target.files[0].name : undefined,
          fetch,
        }
      );
      if (onSave) {
        onSave(savedFile);
      }
    } catch (saveError) {
      if (onError) {
        onError(saveError as Error);
      }
    }
  };

  return (
    <>
      <input
        type="file"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...inputProps}
        onChange={(e) => handleChange(e)}
        data-testid="form-input"
      />
    </>
  );
}
