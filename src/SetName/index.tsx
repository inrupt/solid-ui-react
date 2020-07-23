import React, { useState } from "react";
import { setThing, Thing } from "@solid/lit-pod";
import LoginButton from "../logIn/index";
import {
  fetchProfileName,
  setProfileName,
  saveProfileName,
} from "../helpers/fetch-lit-pod";

const SetName: React.FC = () => {
  const [pName, setPName] = useState<string | null>();
  const [pUrl, setPUrl] = useState<string | null>();

  async function loginTest() {
    // eslint-disable-next-line no-alert
    alert("you have logged in");
  }

  async function loginFailed(error: Error) {
    // eslint-disable-next-line no-console
    console.log("ERROR", error.message);
  }

  function handleChange(e: React.FocusEvent<HTMLInputElement>) {
    setPUrl(e.target.value);
  }

  async function fetchData() {
    try {
      if (pUrl) {
        await fetchProfileName(pUrl)
          .then((result) => {
            setPName(result.name);
            const updatedProfile = setProfileName(result.profile);
            const updatedProfileResource = setThing(
              result.profileResource,
              updatedProfile
            );

            void saveProfileName(updatedProfileResource, result.containerIri);
          })
          .finally((result) => {
            return console.log(result);
          });
      }
      return "hello";
    } catch (error) {
      return error.message;
    }
  }

  return (
    <div>
      <LoginButton
        popupUrl="./popup.html"
        onLogin={() => loginTest()}
        onError={(error) => loginFailed(error)}
      />
      <input type="text" onBlur={(e) => handleChange(e)} />
      {pUrl && (
        <button type="button" onClick={() => fetchData()}>
          Get my name
        </button>
      )}
      <h1>{pName}</h1>
    </div>
  );
};

export default SetName;
