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

import React, { ReactElement } from "react";
import { FileUpload } from "../../src/components/file";
import config from "../config";

const { host } = config();

export default {
  title: "Components/FileUpload",
  component: File,
  argTypes: {
    saveLocation: {
      type: { required: true },
      description: "Location for the file to be saved at.",
    },
    onError: {
      description: `Function to be called on error.`,
      action: "onError",
    },
    onSave: {
      description: `Function to be called on saving a file.`,
      action: "onSave",
    },
    inputProps: {
      description: `Additional attributes to be passed to the file input.`,
    },
    autosave: {
      description: `If true, persists a new value once entered.`,
    },
  },
};

const defaultInputOptions = {
  name: "test-name",
  className: "test-class",
};

// Not sure why this is complaining.
/* eslint react/require-default-props: 0, react/no-unused-prop-types: 0 */
interface IFile {
  onError: (error: any) => void;
  onSave: () => void;
  inputProps: any;
  autosave: boolean;
}

export function BasicExample({
  onError,
  onSave,
  autosave,
  inputProps,
}: IFile): ReactElement {
  return (
    <FileUpload
      saveLocation={`${host}/example.ttl`}
      onError={onError}
      onSave={onSave}
      inputProps={inputProps}
      autosave={autosave}
    />
  );
}

BasicExample.args = {
  inputProps: { ...defaultInputOptions },
  autosave: true,
};
