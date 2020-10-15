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
import { Thing, Url, UrlString, getUrl } from "@inrupt/solid-client";
import { overwriteFile, retrieveFile } from "../../helpers";
import { SessionContext } from "../../context/sessionContext";
import ThingContext from "../../context/thingContext";

export type Props = {
  thing?: Thing;
  property: Url | UrlString;
  edit?: boolean;
  autosave?: boolean;
  maxSize?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onSave?: () => void;
  onError?: (error: Error) => void;
  errorComponent?: React.ComponentType<any>;
} & React.ImgHTMLAttributes<HTMLImageElement>;

export function Image({
  property,
  thing: propThing,
  edit,
  autosave,
  onSave,
  onError,
  maxSize,
  alt,
  inputProps,
  errorComponent: ErrorComponent,
  ...imgOptions
}: Props): ReactElement {
  const [error, setError] = useState<null | Error>(null);
  const { fetch } = useContext(SessionContext);

  const thingContext = useContext(ThingContext);
  const { thing: contextThing } = thingContext;

  const thing = propThing || contextThing;

  if (!thing && !error) {
    const thingNotFound = new Error(
      "Thing not found as property or in context"
    );

    if (!ErrorComponent && !onError) {
      throw thingNotFound;
    } else if (onError) {
      onError(thingNotFound);
    }

    setError(thingNotFound);
  }

  const src = thing ? getUrl(thing, property) : null;

  if (!src && !error) {
    const urlNotFound = new Error("URL not found for given property");

    if (!ErrorComponent && !onError) {
      throw urlNotFound;
    } else if (onError) {
      onError(urlNotFound);
    }

    setError(urlNotFound);
  }

  const [imgObjectUrl, setImgObjectUrl] = useState("");

  useEffect(() => {
    if (src) {
      retrieveFile(src, fetch)
        .then(setImgObjectUrl)
        .catch((retrieveError) => {
          if (onError) {
            onError(retrieveError);
            setError(retrieveError);
          } else if (ErrorComponent) {
            setImgObjectUrl("");
            setError(retrieveError);
          } else {
            setImgObjectUrl(() => {
              throw retrieveError;
            });
          }
        });
    }
  }, [src, onError, setError, fetch, ErrorComponent]);

  const handleChange = async (input: EventTarget & HTMLInputElement) => {
    const fileList = input.files;
    if (autosave && fileList && fileList.length > 0 && src) {
      const newObjectUrl = await overwriteFile(
        src,
        fileList[0],
        input,
        fetch,
        maxSize,
        onSave,
        onError
      );

      if (newObjectUrl) {
        setImgObjectUrl(newObjectUrl);
      }
    }
  };

  let imageComponent = null;

  if (src) {
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    imageComponent = <img src={imgObjectUrl} alt={alt ?? ""} {...imgOptions} />;
  } else if (error && ErrorComponent) {
    imageComponent = <ErrorComponent error={error} />;
  }

  return (
    <>
      {imageComponent}
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
