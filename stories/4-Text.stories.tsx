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
import { Thing } from "@solid/lit-pod";
import { fetchProfileName } from "../src/helpers/fetch-lit-pod";
import Text from "../src/Text";

export default {
  title: "Text component",
  component: Text,
};

export function TextEditFalse(): ReactElement {
  return <Text locale="en" />;
}

export function TextEditTrue(): ReactElement {
  const [profileResource, setProfileResource] = useState<string | null>();
  const [profile, setProfile] = useState<Thing | null>();
  const [containerIri, setContainerIri] = useState<string | null>();

  async function fetchData() {
    try {
      await fetchProfileName(
        "https://ldp.demo-ess.inrupt.com/norbertand/profile/card"
      )
        .then((result) => {
          setProfileResource(result.profileResource);
          setProfile(result.profile);
          setContainerIri(result.containerIri);
        })
        .finally((result) => {
          return console.log(result);
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

  if (profile) {
    return (
      <Text
        locale="en"
        dataSet={profileResource}
        thing={profile}
        predicate={containerIri}
        edit
      />
    );
  }
  return <p>Thing missing</p>;
}
