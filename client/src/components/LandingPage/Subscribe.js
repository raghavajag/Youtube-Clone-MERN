import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import axios from "axios";

import { useState } from "react";
function Subscribe({ id, userTo, authenticated, loading, history }) {
  console.log(`Subscribe Page`)
  const [subNum, setSubNum] = useState(0);
  const [subscribed, setSubscribed] = useState(null);
  const onSubscribe = () => {
    let subscribeVariable = {
      userTo,
      userFrom: id,
    };
    if (subscribed === true) {
      axios
        .post("/api/subscriber/unSubscribe", subscribeVariable)
        .then((response) => {
          if (response.data.success) {
            setSubNum(subNum - 1);
            setSubscribed(!subscribed);
          } else {
            alert("Failed to unsubscribe");
          }
        });
    } else {
      axios.post("/api/subscriber/subscribe", subscribeVariable).then((res) => {
        if (res.data.success) {
          setSubNum(subNum + 1);
          setSubscribed(!subscribed);
        } else {
          alert("failed To Sub");
        }
      });
    }
  };
  useEffect(() => {
    const subscribeNumber = {
      userTo,
      userFrom: id,
    };
    axios
      .post("/api/subscriber/subscribeNumber", subscribeNumber)
      .then((res) => {
        if (res.data.success) {
          setSubNum(res.data.subscribeNumber);
        } else {
          alert("Filed to get subscriber Number");
        }
      });
    axios.post("/api/subscriber/subscribed", subscribeNumber).then((res) => {
      if (res.data.success) {
        setSubscribed(res.data.subscribed);
      } else {
        alert("Failed to get Subscribed Information");
      }
    });
  }, [id, userTo]);
  return (
    <>
      {!authenticated && !loading ? (
        <Button color="secondary" onClick={() => history.push("/login")}>
          {" "}
          {subscribed ? "Subscribed" : "Subscribe"} {subNum}
        </Button>
      ) : subscribed !== null ? (
        <Button
          onClick={() => onSubscribe()}
          color={subscribed ? "default" : "secondary"}
          variant="contained"
        >
          {subscribed ? "Subscribed" : "Subscribe"} {subNum}
        </Button>
      ) : null}
    </>
  );
}

export default React.memo(Subscribe);
