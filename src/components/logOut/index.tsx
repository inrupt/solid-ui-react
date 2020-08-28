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
import SessionContext from "../../context/sessionContext";

export interface Props {
  onLogout?(): void;
  onError?(error: Error): void;
  children?: React.ReactElement;
}

const LogoutButton: React.FC<Props> = (propsLogout: Props) => {
  const { session } = useContext(SessionContext);
  const { children, onLogout, onError } = propsLogout;
  async function LogoutHandler() {
    try {
      await session.logout();
      if (onLogout) onLogout();
    } catch (error) {
      if (onError) onError(error);
    }
  }
  return children ? (
    <div
      role="button"
      tabIndex={0}
      onClick={LogoutHandler}
      onKeyDown={LogoutHandler}
    >
      {children}
    </div>
  ) : (
    <button type="button" onClick={LogoutHandler} onKeyDown={LogoutHandler}>
      Log Out
    </button>
  );
};

export default LogoutButton;
