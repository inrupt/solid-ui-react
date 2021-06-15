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

import React, { ReactElement, useEffect, useState, useContext } from "react";

import {
  retrieveFile,
  overwriteFile,
  CommonProperties,
  useProperty,
} from "../../helpers";

import { SessionContext } from "../../context/sessionContext";

export type Props = {
  maxSize?: number;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  errorComponent?: React.ComponentType<{ error: Error }>;
  loadingComponent?: React.ComponentType | null;
} & CommonProperties &
  React.VideoHTMLAttributes<HTMLVideoElement>;

/**
 * Fetches and displays a video, from a src found at a given property of a given Thing. Can also be used to upload a new/replacement video file.
 */
export function Video({
  property: propProperty,
  properties: propProperties,
  thing: propThing,
  edit,
  autosave,
  onSave,
  onError,
  maxSize,
  inputProps,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent,
  ...videoOptions
}: Props): ReactElement | null {
  const { fetch } = useContext(SessionContext);

  const values = useProperty({
    thing: propThing,
    property: propProperty,
    properties: propProperties,
    type: "url",
  });

  const { value, thing, error: thingError } = values;
  let valueError;
  if (!edit && !value) {
    valueError = new Error("No value found for property.");
  }

  const isFetchingThing = !thing && !thingError;

  const [error, setError] = useState<Error | undefined>(
    thingError ?? valueError
  );

  useEffect(() => {
    if (error) {
      if (onError) {
        onError(error);
      }
    }
  }, [error, onError, ErrorComponent]);

  const [videoObjectUrl, setVideoObjectUrl] = useState("");

  useEffect(() => {
    if (!thing) {
      return;
    }
    if (value) {
      retrieveFile(value as string, fetch)
        .then(setVideoObjectUrl)
        .catch((retrieveError) => {
          setError(retrieveError);

          if (onError) {
            onError(retrieveError);
          }

          if (ErrorComponent) {
            setVideoObjectUrl("");
          }
        });
    }
  }, [value, onError, setError, fetch, thing, ErrorComponent]);

  const handleChange = async (input: EventTarget & HTMLInputElement) => {
    const fileList = input.files;
    if (autosave && fileList && fileList.length > 0 && value) {
      const newObjectUrl = await overwriteFile(
        value as string,
        fileList[0],
        input,
        fetch,
        maxSize,
        onSave,
        onError
      );
      if (newObjectUrl) {
        setVideoObjectUrl(newObjectUrl);
      }
    }
  };

  let videoComponent = null;

  if (isFetchingThing) {
    let loader: JSX.Element | null = (LoadingComponent && (
      <LoadingComponent />
    )) || <span>fetching data in progress</span>;
    if (LoadingComponent === null) {
      loader = null;
    }
    return loader;
  }

  if (error) {
    videoComponent = ErrorComponent ? (
      <ErrorComponent error={error} />
    ) : (
      <span>{error.toString()}</span>
    );
  } else if (value) {
    videoComponent = (
      /* eslint jsx-a11y/media-has-caption: 0, react/jsx-props-no-spreading: 0 */
      <video
        src={videoObjectUrl || (value as string)}
        controls
        {...videoOptions}
      />
    );
  }

  return (
    <>
      {videoComponent}
      {edit && (
        <input
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...inputProps}
          type="file"
          accept="video/*"
          onChange={(e) => handleChange(e.target)}
        />
      )}
    </>
  );
}
