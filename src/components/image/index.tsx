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
import {
  addUrl,
  getSourceUrl,
  removeUrl,
  saveFileInContainer,
  saveSolidDatasetAt,
  setThing,
  SolidDataset,
} from "@inrupt/solid-client";
import { overwriteFile, CommonProperties, useProperty } from "../../helpers";

import { SessionContext } from "../../context/sessionContext";
import useFile from "../../hooks/useFile";

export type Props = {
  maxSize?: number;
  saveLocation?: string;
  allowDelete?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  solidDataset?: SolidDataset;
  errorComponent?: React.ComponentType<{ error: Error }>;
  loadingComponent?: React.ComponentType | null;
  deleteComponent?: React.ComponentType<{ onClick: () => void }> | null;
} & CommonProperties &
  React.ImgHTMLAttributes<HTMLImageElement>;

/**
 * Fetches and displays an image, from a src found at a given property of a given [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing). Can also be used to upload a new/replacement image file.
 */
export function Image({
  thing: propThing,
  property: propProperty,
  properties: propProperties,
  edit,
  autosave,
  allowDelete,
  onSave,
  onError,
  maxSize,
  alt,
  inputProps,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent,
  deleteComponent: DeleteComponent,
  saveLocation,
  solidDataset,
  ...imgOptions
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
  if (!value) {
    valueError = new Error("No value found for property.");
  }
  const isFetchingThing = !thing && !thingError;

  const [error, setError] = useState<Error | undefined>(
    thingError ?? valueError,
  );

  useEffect(() => {
    if (error) {
      if (onError) {
        onError(error);
      }
    }
  }, [error, onError, ErrorComponent]);

  const [imgObjectUrl, setImgObjectUrl] = useState<string | undefined>();
  const {
    data,
    error: imgError,
    inProgress: fetchingFileInProgress,
  } = useFile(value as string);

  useEffect(() => {
    if (fetchingFileInProgress) {
      return;
    }
    if (imgError) {
      setError(imgError);
      return;
    }
    const imageObjectUrl = data && URL.createObjectURL(data);
    if (imageObjectUrl) {
      setImgObjectUrl(imageObjectUrl);
    }
  }, [data, fetchingFileInProgress, imgError]);

  const handleDelete = async () => {
    if (
      !propThing ||
      !solidDataset ||
      !propProperty ||
      typeof value !== "string" ||
      !autosave
    ) {
      return;
    }

    try {
      const updatedThing = removeUrl(propThing, propProperty, value);
      const updatedDataset = setThing(solidDataset, updatedThing);
      const datasetSourceUrl = getSourceUrl(solidDataset);
      if (!datasetSourceUrl) return;
      await saveSolidDatasetAt(datasetSourceUrl, updatedDataset, {
        fetch,
      });
    } catch (e) {
      setError(e as Error);
    }
  };

  const handleChange = async (input: EventTarget & HTMLInputElement) => {
    const fileList = input.files;
    if (autosave && fileList && fileList.length > 0) {
      if (value) {
        const newObjectUrl = await overwriteFile(
          value as string,
          fileList[0],
          input,
          fetch,
          maxSize,
          onSave,
          onError,
        );

        if (newObjectUrl) {
          setImgObjectUrl(newObjectUrl);
        }
      } else if (!value && saveLocation) {
        const savedFile = await saveFileInContainer(saveLocation, fileList[0], {
          fetch,
        });
        const savedFileUrl = getSourceUrl(savedFile);
        if (savedFileUrl && propThing && propProperty && solidDataset) {
          setImgObjectUrl(savedFileUrl);
          try {
            const updatedThing = addUrl(propThing, propProperty, savedFileUrl);
            const updatedDataset = setThing(solidDataset, updatedThing);
            const datasetSourceUrl = getSourceUrl(solidDataset);
            if (!datasetSourceUrl) return;
            await saveSolidDatasetAt(datasetSourceUrl, updatedDataset, {
              fetch,
            });
          } catch (e) {
            setError(e as Error);
          }
        }
      }
    }
  };

  let imageComponent = null;

  if (isFetchingThing || fetchingFileInProgress) {
    let loader: JSX.Element | null = (LoadingComponent && (
      <LoadingComponent />
    )) || <span>fetching data in progress</span>;
    if (LoadingComponent === null) {
      loader = null;
    }
    return loader;
  }

  if (error) {
    imageComponent = ErrorComponent ? (
      <ErrorComponent error={error} />
    ) : (
      <span>{error.toString()}</span>
    );
  } else if (value) {
    /* eslint-disable-next-line react/jsx-props-no-spreading */
    imageComponent = <img src={imgObjectUrl} alt={alt ?? ""} {...imgOptions} />;
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
      {allowDelete &&
        (DeleteComponent ? (
          <DeleteComponent onClick={handleDelete} />
        ) : (
          <button type="button" onClick={handleDelete}>
            Delete
          </button>
        ))}
    </>
  );
}
