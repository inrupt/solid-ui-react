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

import React, { ReactElement, useState, useEffect } from "react";
import * as litPodFns from "@solid/lit-pod";
import { fetchStringResource } from "../src/helpers/fetch-lit-pod";
import Text from "../src/Text";

export default {
  title: "Text component",
  component: Text,
};

export function TextEditFalse(): ReactElement {
  const [dataSet, setDataSet] = useState<litPodFns.LitDataset | null>();
  const [thing, setThing] = useState<litPodFns.Thing | null>();

  async function fetchData() {
    try {
      await fetchStringResource(
        "https://ldp.demo-ess.inrupt.com/norbertand/profile/card",
        "https://ldp.demo-ess.inrupt.com/norbertand/profile/card#me"
      ).then((result) => {
        setDataSet(result.dataSet);
        setThing(result.thing);
      });
    } catch (error) {
      return error.message;
    }
    return "done";
  }

  useEffect(() => {
    // eslint-disable-next-line no-void
    void fetchData();
  }, []);

  if (dataSet && thing) {
    return (
      <Text
        locale="en"
        dataSet={dataSet}
        thing={thing}
        predicate="http://xmlns.com/foaf/0.1/name"
      />
    );
  }
  return <p>Thing missing</p>;
}

export function TextEditTrue(): ReactElement {
  const [dataSet, setDataSet] = useState<litPodFns.LitDataset | null>();
  const [thing, setThing] = useState<litPodFns.Thing | null>();

  async function fetchData() {
    try {
      await fetchStringResource(
        "https://ldp.demo-ess.inrupt.com/norbertand/profile/card",
        "https://ldp.demo-ess.inrupt.com/norbertand/profile/card#me"
      ).then((result) => {
        setDataSet(result.dataSet);
        setThing(result.thing);
      });
    } catch (error) {
      return error.message;
    }
    return "done";
  }

  useEffect(() => {
    // eslint-disable-next-line no-void
    void fetchData();
  }, []);

  if (dataSet && thing) {
    return (
      <Text
        locale="en"
        dataSet={dataSet}
        thing={thing}
        predicate="http://xmlns.com/foaf/0.1/name"
        edit
      />
    );
  }
  return <p>Thing missing</p>;
}
