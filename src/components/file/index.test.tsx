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

/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import * as SolidFns from "@inrupt/solid-client";
import { FileUpload } from "./index";

const inputOptions = {
  name: "test-name",
  type: "url",
};

/** The File interface provides information about files and allows JavaScript in a web page to access their content. */
interface File extends Blob {
  readonly lastModified: number;
  readonly name: string;
}

declare let File: {
  prototype: File;
  new (fileBits: BlobPart[], fileName: string, options?: FilePropertyBag): File;
};

const savedDataset = SolidFns.createSolidDataset() as any;
jest
  .spyOn(SolidFns, "saveSolidDatasetAt")
  .mockImplementation(() => savedDataset);

describe("<File /> component snapshot test", () => {
  it("matches snapshot", () => {
    const documentBody = render(<FileUpload saveLocation="https://fake.url" />);
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });

  it("matches snapshot with input options", () => {
    const documentBody = render(
      <FileUpload saveLocation="https://fake.url" inputProps={inputOptions} />
    );
    const { baseElement } = documentBody;
    expect(baseElement).toMatchSnapshot();
  });
});

describe("<FileUpload /> component functional testing", () => {
  it("Should call onSave if it is passed with a File", async () => {
    jest
      .spyOn(SolidFns, "saveFileInContainer")
      .mockResolvedValueOnce(
        SolidFns.mockFileFrom("https://danbarclay.inrupt.net/public/foo.txt")
      );
    const onSave = jest.fn();
    const onError = jest.fn();

    const file = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });
    // spoof FileList to match <input type="file"/> input.
    const fileList: Array<File> = [file];

    const { getByTestId } = render(
      <FileUpload
        saveLocation="https://fake.url"
        onSave={onSave}
        onError={onError}
        autosave
      />
    );
    const input = getByTestId("form-input");
    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it("Should call onSave if it is passed with a Blob", async () => {
    jest
      .spyOn(SolidFns, "saveFileInContainer")
      .mockResolvedValueOnce(
        SolidFns.mockFileFrom(
          "https://danbarclay.inrupt.net/public/f98e1a00-c9e7-11eb-99aa-c3d144c71c98.txt"
        )
      );
    const onSave = jest.fn();
    const onError = jest.fn();

    const blob = new Blob(["foo"], {
      type: "text/plain",
    });

    const fileList: Array<Blob> = [blob];

    const { getByTestId } = render(
      <FileUpload
        saveLocation="https://fake.url"
        onSave={onSave}
        onError={onError}
        autosave
      />
    );
    const input = getByTestId("form-input");
    fireEvent.change(input, { target: { files: fileList } });

    await waitFor(() => expect(onSave).toHaveBeenCalled());
  });

  it("Should call onError if saving file to custom location fails", async () => {
    jest.spyOn(SolidFns, "saveFileInContainer").mockRejectedValueOnce(null);
    const onError = jest.fn();
    const onSave = jest.fn();

    const file = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });

    const { getByTestId } = render(
      <FileUpload
        saveLocation="https://this-will-fail.com"
        onError={onError}
        onSave={onSave}
        autosave
      />
    );

    const input = getByTestId("form-input");
    fireEvent.change(input, { target: { files: file } });

    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  it("Should not call saveFileInContainer if autosave is not true", async () => {
    jest.spyOn(SolidFns, "saveFileInContainer").mockRejectedValueOnce(null);
    const onError = jest.fn();
    const onSave = jest.fn();

    const file = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });

    const { getByTestId } = render(
      <FileUpload
        saveLocation="https://this-will-fail.com"
        onError={onError}
        onSave={onSave}
      />
    );

    const input = getByTestId("form-input");
    fireEvent.change(input, { target: { files: file } });
    expect(SolidFns.saveFileInContainer).toHaveBeenCalledTimes(0);
  });
});
