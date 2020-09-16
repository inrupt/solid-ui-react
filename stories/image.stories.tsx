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

import React, { ReactElement } from "react";
import Image from "../src/components/image";
import CombinedDataProvider from "../src/context/combinedDataContext";
import config from "./config";

const { host } = config();

export default {
  title: "Components/Image",
  component: Image,
};

interface IWithDatasetProvider {
  datasetUrl: string;
  thingUrl: string;
  property: string;
  edit: boolean;
  maxSize: number;
}

export function WithDatasetProvider({
  thingUrl,
  datasetUrl,
  property,
  edit,
  maxSize,
}: IWithDatasetProvider): ReactElement {
  return (
    <CombinedDataProvider datasetUrl={datasetUrl} thingUrl={thingUrl}>
      <Image property={property} edit={edit} maxSize={maxSize} />
    </CombinedDataProvider>
  );
}

WithDatasetProvider.args = {
  datasetUrl: `${host}/example.ttl`,
  thingUrl: `${host}/example.ttl#exampleImage`,
  property: "http://schema.org/contentUrl",
};
