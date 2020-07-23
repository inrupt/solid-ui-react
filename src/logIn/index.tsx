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

import React, { useContext } from "react";
import auth from "solid-auth-client";
import useSession from "../sessionProvider/useSession";
import SessionContext from "../sessionProvider/sessionProviderContext";

interface Props {
  popupUrl?: string;
  authOptions?: Record<string, unknown>;
  children?: React.ReactNode;
  onLogin(): void;
  onError(error: Error): void;
}

const LoginButton: React.FC<Props> = (propsLogin: Props) => {
  const { popupUrl, children, authOptions, onLogin, onError } = propsLogin;
  const options = authOptions || { popupUri: popupUrl };
  const { setSessionRequestInProgress } = useContext(SessionContext);

  const { session, sessionRequestInProgress } = useSession();

  async function LoginHandler() {
    setSessionRequestInProgress(true);
    try {
      await auth.popupLogin(options);
      setSessionRequestInProgress(false);
      onLogin();
    } catch (error) {
      onError(error);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={LoginHandler}
      onKeyDown={LoginHandler}
    >
      {children}
    </div>
  );
};

export default LoginButton;
