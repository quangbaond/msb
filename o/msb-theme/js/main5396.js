/*1698666014000*/
/*1698666014000*/
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

/*Begin common tracking*/
const trackingClickNameSpace = "click.tracking";
const url = new URL(window.location.href);

const newUtmData = {
  utm_id: url.searchParams.get("utm_id"),
  utm_source: url.searchParams.get("utm_source"),
  utm_medium: url.searchParams.get("utm_medium"),
  utm_campaign: url.searchParams.get("utm_campaign"),
  utm_term: url.searchParams.get("utm_term"),
  utm_content: url.searchParams.get("utm_content"),
};

const getCookieValueByName = (name) => {
  const nameEQ = name + "=",
    ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return JSON.parse(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const browserName = (agent = window.navigator.userAgent.toLowerCase()) => {
  switch (true) {
    case agent.indexOf("edge") > -1:
      return "MS Edge";
    case agent.indexOf("edg/") > -1:
      return "Edge ( chromium based)";
    case agent.indexOf("opr") > -1 && !!window.opr:
      return "Opera";
    case agent.indexOf("chrome") > -1 && !!window.chrome:
      return "Chrome";
    case agent.indexOf("trident") > -1:
      return "MS IE";
    case agent.indexOf("firefox") > -1:
      return "Mozilla Firefox";
    case agent.indexOf("safari") > -1:
      return "Safari";
    default:
      return "other";
  }
};

const browserVersion = () => {
  const ua = navigator.userAgent;
  let tem;
  let M =
    ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) ||
    [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return "IE " + (tem[1] || "");
  }
  if (M[1] === "Chrome") {
    tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
    if (tem != null) return tem.slice(1).join(" ").replace("OPR", "Opera");
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, "-?"];
  if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
  return M.join(" ");
};

const nonAccentVietnamese = (str) => {
  str = str.toLowerCase();
  str = str.replace(
    /[\u00E0\u00E1\u1EA1\u1EA3\u00E3\u00E2\u1EA7\u1EA5\u1EAD\u1EA9\u1EAB\u0103\u1EB1\u1EAF\u1EB7\u1EB3\u1EB5]/g,
    "a"
  );
  str = str.replace(
    /[\u00E8\u00E9\u1EB9\u1EBB\u1EBD\u00EA\u1EC1\u1EBF\u1EC7\u1EC3\u1EC5]/g,
    "e"
  );
  str = str.replace(/[\u00EC\u00ED\u1ECB\u1EC9\u0129]/g, "i");
  str = str.replace(
    /[\u00F2\u00F3\u1ECD\u1ECF\u00F5\u00F4\u1ED3\u1ED1\u1ED9\u1ED5\u1ED7\u01A1\u1EDD\u1EDB\u1EE3\u1EDF\u1EE1]/g,
    "o"
  );
  str = str.replace(
    /[\u00F9\u00FA\u1EE5\u1EE7\u0169\u01B0\u1EEB\u1EE9\u1EF1\u1EED\u1EEF]/g,
    "u"
  );
  str = str.replace(/[\u1EF3\u00FD\u1EF5\u1EF7\u1EF9]/g, "y");
  str = str.replace(/\u0111/g, "d");
  str = str.replace(/[\u0300\u0301\u0303\u0309\u0323]/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/[\u02C6\u0306\u031B]/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
};

const toSnakeCase = (str) => {
  return (
    str &&
    str
      .match(
        /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
      )
      .map((x) => x.toLowerCase())
      .join("_")
  );
};

const getStoryScreenFunction = () =>
  toSnakeCase(nonAccentVietnamese($(document).attr("title")));

const commonAdditionalData = {
  created_at: new Date().toLocaleString(),
  device_type: (window.deviceName =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
      ? "Mobile/Tablet"
      : "Desktop"),
  browser: browserName(),
  browser_version: browserVersion(),
  language: themeDisplay.getLanguageId(),
  session_id: Liferay.authToken,
  ...JSON.parse(window.localStorage.getItem("utm_data")),
  website_url: window.location.hostname,
};

const commonData = {
  cif_number: "",
  channel__id: "550bb5d7-63d2-4f11-8daa-8d06520fb456",
  channel_user_id: Liferay.authToken,
  story_screen_function: getStoryScreenFunction(),
};

window.commonData = commonData;
window.commonAdditionalData = commonAdditionalData;

const trackingViewPageData = {
  ...window.commonData,
  additional_data: window.commonAdditionalData,
  channel_journey: "view",
  journey_story: "view_pages",
  description: `Truy cap man hinh ${$(document).attr("title")}`,
};

window.dataForGA = (data) => {
  delete data.cif_number;
  delete data.channel__id;
  delete data.channel_user_id;
  delete data.additional_data.session_id;
  return data;
};

window.pushEventTracking = async (data) => {
  const response = await fetch(
    "https://apigateway.msb.com.vn/cdp_di_customer_behavior/1.0.0/push-event",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": window.location.hostname,
        apiKey:
          "eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImFkbWluIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJtc2Igd2Vic2l0ZSIsImlkIjo4LCJ1dWlkIjoiM2RiYWZhMTMtNmJkZi00YjVhLThiY2MtNzI1NGE1NGU1YWYwIn0sImlzcyI6Imh0dHBzOlwvXC8xMC4wLjY1Ljk0Ojk0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJVbmxpbWl0ZWQiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6bnVsbH19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInBlcm1pdHRlZFJlZmVyZXIiOiIiLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJDRFBfRElfQ1VTVE9NRVJfQkVIQVZJT1IiLCJjb250ZXh0IjoiXC9jZHBfZGlfY3VzdG9tZXJfYmVoYXZpb3JcLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn1dLCJwZXJtaXR0ZWRJUCI6IiIsImlhdCI6MTYzNjcwOTI2MSwianRpIjoiZDIyNzk0ZDctOWQ4My00YWUyLTg4OGEtNjIwNWZkNjg3M2FiIn0=.ZVxWxdg6Apyq4PIulhTVtz1X0T-6ExLC-gbysiWAPZdyRpQlfo55WseW-gbIRVNQsV7AOeaUDvbIDRgzPEYyFaCYKliJi_1umpQIaGlk3S8LgKDc_HgIi93xA4Qvi2vdBD3W018S4wyze08F0K0VbjqURTPi7kusdktwHQWufNg9E3drCYZnYdL9A6GocliE_QX5JBNNPcyGsRhoT7SBY4cQMEWc-_BUem4A3Ih3L8A9f5mVbLGNfBU8GUR2VbavqDqTOHL9wMUGC0TTwb5SiqrGhPBNCtYWGvok5Q4TLOx44VJWfiNzGINP9C9cIZWKuu6xmJB31rbVzFATjDeySw==",
      },
      body: JSON.stringify(data),
    }
  );
};

window.pushProfileToMobio = async (data) => {
  // const response = await fetch(
  //   "https://apigateway.msb.com.vn/cdp_di_customer_behavior/1.0.0/push-event",
  //   {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //       "Access-Control-Allow-Origin": window.location.hostname,
  //       apiKey:
  //         "eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImFkbWluIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJtc2Igd2Vic2l0ZSIsImlkIjo4LCJ1dWlkIjoiM2RiYWZhMTMtNmJkZi00YjVhLThiY2MtNzI1NGE1NGU1YWYwIn0sImlzcyI6Imh0dHBzOlwvXC8xMC4wLjY1Ljk0Ojk0NDNcL29hdXRoMlwvdG9rZW4iLCJ0aWVySW5mbyI6eyJVbmxpbWl0ZWQiOnsidGllclF1b3RhVHlwZSI6InJlcXVlc3RDb3VudCIsImdyYXBoUUxNYXhDb21wbGV4aXR5IjowLCJncmFwaFFMTWF4RGVwdGgiOjAsInN0b3BPblF1b3RhUmVhY2giOnRydWUsInNwaWtlQXJyZXN0TGltaXQiOjAsInNwaWtlQXJyZXN0VW5pdCI6bnVsbH19LCJrZXl0eXBlIjoiUFJPRFVDVElPTiIsInBlcm1pdHRlZFJlZmVyZXIiOiIiLCJzdWJzY3JpYmVkQVBJcyI6W3sic3Vic2NyaWJlclRlbmFudERvbWFpbiI6ImNhcmJvbi5zdXBlciIsIm5hbWUiOiJDRFBfRElfQ1VTVE9NRVJfQkVIQVZJT1IiLCJjb250ZXh0IjoiXC9jZHBfZGlfY3VzdG9tZXJfYmVoYXZpb3JcLzEuMC4wIiwicHVibGlzaGVyIjoiYWRtaW4iLCJ2ZXJzaW9uIjoiMS4wLjAiLCJzdWJzY3JpcHRpb25UaWVyIjoiVW5saW1pdGVkIn1dLCJwZXJtaXR0ZWRJUCI6IiIsImlhdCI6MTYzNjcwOTI2MSwianRpIjoiZDIyNzk0ZDctOWQ4My00YWUyLTg4OGEtNjIwNWZkNjg3M2FiIn0=.ZVxWxdg6Apyq4PIulhTVtz1X0T-6ExLC-gbysiWAPZdyRpQlfo55WseW-gbIRVNQsV7AOeaUDvbIDRgzPEYyFaCYKliJi_1umpQIaGlk3S8LgKDc_HgIi93xA4Qvi2vdBD3W018S4wyze08F0K0VbjqURTPi7kusdktwHQWufNg9E3drCYZnYdL9A6GocliE_QX5JBNNPcyGsRhoT7SBY4cQMEWc-_BUem4A3Ih3L8A9f5mVbLGNfBU8GUR2VbavqDqTOHL9wMUGC0TTwb5SiqrGhPBNCtYWGvok5Q4TLOx44VJWfiNzGINP9C9cIZWKuu6xmJB31rbVzFATjDeySw==",
  //     },
  //     body: JSON.stringify(data),
  //   }
  // );
  const response = true;
};

window.pushProfileToMobioUAT = async (data) => {
  const response = await fetch(
    "https://apigateways-uat.msb.com.vn/cdp_di_customer_behavior/1.0.0/push-event",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": window.location.hostname,
        apiKey:
          "eyJ4NXQiOiJOVGRtWmpNNFpEazNOalkwWXpjNU1tWm1PRGd3TVRFM01XWXdOREU1TVdSbFpEZzROemM0WkE9PSIsImtpZCI6ImdhdGV3YXlfY2VydGlmaWNhdGVfYWxpYXMiLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJhZG1pbkBjYXJib24uc3VwZXIiLCJhcHBsaWNhdGlvbiI6eyJvd25lciI6ImFkbWluIiwidGllclF1b3RhVHlwZSI6bnVsbCwidGllciI6IlVubGltaXRlZCIsIm5hbWUiOiJERiBMYW5kaW5nIFBhZ2UiLCJpZCI6OSwidXVpZCI6IjQ4ODBhYmVkLTI1NDEtNDE2Ni1iYTRiLWI1MTM2OTRhYWJmOCJ9LCJpc3MiOiJodHRwczpcL1wvMTAuMC42NS45NDo5NDQzXC9vYXV0aDJcL3Rva2VuIiwidGllckluZm8iOnsiVW5saW1pdGVkIjp7InRpZXJRdW90YVR5cGUiOiJyZXF1ZXN0Q291bnQiLCJncmFwaFFMTWF4Q29tcGxleGl0eSI6MCwiZ3JhcGhRTE1heERlcHRoIjowLCJzdG9wT25RdW90YVJlYWNoIjp0cnVlLCJzcGlrZUFycmVzdExpbWl0IjowLCJzcGlrZUFycmVzdFVuaXQiOm51bGx9fSwia2V5dHlwZSI6IlBST0RVQ1RJT04iLCJwZXJtaXR0ZWRSZWZlcmVyIjoiIiwic3Vic2NyaWJlZEFQSXMiOlt7InN1YnNjcmliZXJUZW5hbnREb21haW4iOiJjYXJib24uc3VwZXIiLCJuYW1lIjoiQ0RQX0RJX0NVU1RPTUVSX0JFSEFWSU9SIiwiY29udGV4dCI6IlwvY2RwX2RpX2N1c3RvbWVyX2JlaGF2aW9yXC8xLjAuMCIsInB1Ymxpc2hlciI6ImFkbWluIiwidmVyc2lvbiI6IjEuMC4wIiwic3Vic2NyaXB0aW9uVGllciI6IlVubGltaXRlZCJ9XSwicGVybWl0dGVkSVAiOiIiLCJpYXQiOjE2NDI0Nzc1MzMsImp0aSI6ImNhZGYxOTIwLTMwNmItNDhiNS1iMDIyLWY1NzJiMDg3NzEzMiJ9.lot30kfhpJg6kAPM9VSNQXEAzXVoMhFTl6DSWZFDwRoxhL5sDmIwgHu11XZoWd4CMTA0QPoXGGT6DygHh4nlFjsDZxrdcmH2zPEb--fikGLf1__Xv-IXzZWDGi_cRvbG_h5RkTbe0a3OTldD2eHhUxwAG1fSSKtsSqA0I4r2Yri-RKn9gXHSC3MbOQEy_mRyU0BiYHvosZdmSNsmwZX7LDjxsGbC-ymV1rg0zcJdopIAKofN-nZkV-uUDsH_q0id7QQaKUahf7Dt20dywbCCAsP06w7l-4PYgXncE1aqUb6lhH_Yir2nGkw1iaU5ZMqZpyb3alI198VvC2fkgBMz0g==",
      },
      body: JSON.stringify(data),
    }
  );
};
const trackingElementHyperLink = function () {
  const data = {
    ...window.commonData,
    channel_journey: "click",
    journey_story: "click_hyperlink",
    additional_data: {
      ...window.commonAdditionalData,
      element: this.outerHTML,
      destination_page: this.text?.replace(/\s\s+/g, " ")?.trim(),
      url_destination_page: this.href,
    },
  };
  try {
    window.pushEventTracking(data).then(() => {});
    data.event = "event_43";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  } catch (e) {
    console.log(e);
  }
};

const trackingElementButton = function () {
  const data = {
    ...window.commonData,
    channel_journey: "click",
    journey_story: "click_button",
    additional_data: {
      ...window.commonAdditionalData,
      element: this.outerHTML,
      destination_page: this.text?.replace(/\s\s+/g, " ")?.trim(),
      url_destination_page: this.href,
    },
  };
  try {
    window.pushEventTracking(data).then(() => {});
    data.event = "event_47";
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(data);
  } catch (e) {
    console.log(e);
  }
};

/*
 * This function gets loaded when all the HTML, not including the portlets, is
 * loaded.
 */
AUI().ready(function () {
  if (window.location.href.indexOf("utm_") > -1) {
    window.localStorage.setItem("utm_data", JSON.stringify(newUtmData));
  }

  $(document).on("DOMSubtreeModified", "body", function () {
    $("a")
      .unbind(trackingClickNameSpace)
      .bind(trackingClickNameSpace, trackingElementHyperLink);
    $("button")
      .unbind(trackingClickNameSpace)
      .bind(trackingClickNameSpace, trackingElementButton);
  });

  try {
    window.pushEventTracking(trackingViewPageData).then(() => {});
  } catch (e) {
    console.log(e);
  }

  /*End common tracking*/
});

/*
 * This function gets loaded after each and every portlet on the page.
 *
 * portletId: the current portlet's id
 * node: the Alloy Node object of the current portlet
 */
Liferay.Portlet.ready(function (_portletId, _node) {});

/*
 * This function gets loaded when everything, including the portlets, is on
 * the page.
 */
Liferay.on("allPortletsReady", function () {
  /*Begin Tracking video */
  function playTracking(videoName) {
    const data = {
      ...window.commonData,
      channel_journey: "video",
      journey_story: "video_play",
      additional_data: {
        ...window.commonAdditionalData,
        product: window.commonData.story_screen_function,
        video_name: videoName,
      },
    };
    console.log(data);
    try {
      window.pushEventTracking(data).then(() => {}); // mobio
      let gaData = window.dataForGA(data);
      gaData.event = "event_62";
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gaData); // GA
    } catch (e) {
      console.log(e);
    }
  }

  function pauseTracking(videoName, duration) {
    const data = {
      ...window.commonData,
      channel_journey: "video",
      journey_story: "video_pause",
      additional_data: {
        ...window.commonAdditionalData,
        product: window.commonData.story_screen_function,
        video_name: videoName,
        play_duration: duration,
      },
    };
    console.log(data);
    try {
      window.pushEventTracking(data).then(() => {}); // mobio
      let gaData = window.dataForGA(data);
      gaData.event = "event_65";
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(gaData); // GA
    } catch (e) {
      console.log(e);
    }
  }

  window.onYouTubeIframeAPIReady = function () {
    const videos = document.getElementsByClassName("video-container");
    for (let i = 0; i < videos.length; i++) {
      let player = new YT.Player(videos[i], {
        events: {
          onStateChange: (e) => onPlayerStateChange(e, player),
        },
      });
    }
  };

  function onPlayerStateChange(event, yplayer) {
    console.log("window.YT.PlayerState ", window.YT.PlayerState);
    switch (event.data) {
      case window.YT.PlayerState.ENDED:
      case window.YT.PlayerState.PAUSED:
        console.log("pause video");
        pauseTracking(
          yplayer.playerInfo.videoData.title,
          yplayer.playerInfo.currentTime
        );
        break;
      case window.YT.PlayerState.PLAYING:
        console.log("play video");
        playTracking(yplayer.playerInfo.videoData.title);
        break;
    }
  }

  $(document).ready(() => {
    if (window.YT) {
      window.YT.ready(() => {
        window.onYouTubeIframeAPIReady();
      });
    }
  });
  /*End Tracking video */
});
