//
// Copyright Inrupt Inc.
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

import type { ReactElement } from "react";
import React from "react";
import { addUrl, createThing } from "@inrupt/solid-client";
import { Video } from "../../src/components/video";

export default {
  title: "Components/Video",
  component: Video,
  argTypes: {
    thing: {
      description: `The [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the video src from. Uses a Thing from context if not supplied.`,
      control: { type: null },
    },
    property: {
      type: { required: true },
      description: `The property of the [Thing](https://docs.inrupt.com/developer-tools/javascript/client-libraries/reference/glossary/#term-Thing) to retrieve the src URL from.`,
    },
    edit: {
      description: `If true, renders an input to allow a new video file to be selected.`,
    },
    autosave: {
      description: `If true, uploads and persists a new video once selected.`,
    },
    maxSize: {
      description: `The maximum permitted file size, in kB`,
    },
    inputProps: {
      description: `Additional attributes to be passed to the file input, if \`edit\` is true`,
      control: { type: null },
    },
    onSave: {
      description: `Function to be called on saving a new image.`,
      control: { type: null },
    },
    onError: {
      description: `Function to be called on error.`,
      control: { type: null },
    },
    errorComponent: {
      description: `Component to be rendered in case of error.`,
      control: { type: null },
    },
    loadingComponent: {
      description: `A loading component to show while fetching the dataset. If \`null\` the default loading message won't be displayed`,
      control: { type: null },
    },
  },
};

export function EditFalse({
  edit,
  autosave,
  maxSize,
}: {
  edit: boolean;
  autosave: boolean;
  maxSize: number;
}): ReactElement {
  const exampleUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
  const exampleProperty = `http://www.w3.org/2006/vcard/ns#hasPhoto`;
  const exampleThing = addUrl(createThing(), exampleProperty, exampleUrl);
  return (
    <Video
      thing={exampleThing}
      property={exampleProperty}
      edit={edit}
      autosave={autosave}
      maxSize={maxSize}
    />
  );
}

EditFalse.args = {
  edit: false,
  autosave: false,
  maxSize: 100,
  property: "http://www.w3.org/2006/vcard/ns#hasPhoto",
};

EditFalse.parameters = {
  actions: { disable: true },
};

export function EditTrue({
  edit,
  autosave,
  maxSize,
}: {
  edit: boolean;
  autosave: boolean;
  maxSize: number;
}): ReactElement {
  const exampleUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
  const exampleProperty = `http://www.w3.org/2006/vcard/ns#hasPhoto`;
  const exampleThing = addUrl(createThing(), exampleProperty, exampleUrl);

  return (
    <Video
      thing={exampleThing}
      property={exampleProperty}
      edit={edit}
      autosave={autosave}
      maxSize={maxSize}
    />
  );
}

EditTrue.args = {
  edit: true,
  autosave: true,
  maxSize: 100,
  property: "http://www.w3.org/2006/vcard/ns#hasPhoto",
};

EditTrue.parameters = {
  actions: { disable: true },
};

export function ErrorComponent(): ReactElement {
  const exampleUrl =
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";

  const exampleProperty = `http://www.w3.org/2006/vcard/ns#hasPhoto`;
  const exampleThing = addUrl(createThing(), exampleProperty, exampleUrl);

  return (
    <Video
      thing={exampleThing}
      property="https://example.com/bad-url"
      errorComponent={({ error }) => <span>{error.toString()}</span>}
    />
  );
}

ErrorComponent.parameters = {
  actions: { disable: true },
  controls: { disable: true },
};
