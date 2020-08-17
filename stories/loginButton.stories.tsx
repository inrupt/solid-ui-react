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
import { Button } from "@material-ui/core";
import { withKnobs, text } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";
import { SessionProvider } from "../src/context/sessionContext";
import LoginButton from "../src/components/logIn";

export default {
  title: "Login Button",
  component: LoginButton,
  decorators: [withKnobs],
};

export function WithChildren(): ReactElement {
  return (
    <SessionProvider>
      <LoginButton
        popupUrl={text("Popup URL", "./popup.html")}
        onLogin={action("OnLogin")}
        onError={action("OnError")}
      >
        <Button color="primary">Log In</Button>
      </LoginButton>
    </SessionProvider>
  );
}

export function WithoutChildren(): ReactElement {
  return (
    <SessionProvider>
      <LoginButton
        popupUrl="./popup.html"
        onLogin={action("OnLogin")}
        onError={action("OnError")}
      />
    </SessionProvider>
  );
}
