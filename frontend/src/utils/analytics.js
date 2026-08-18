import ReactGA from "react-ga4";

const TRACKING_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (TRACKING_ID) {
    ReactGA.initialize(TRACKING_ID);
  } else {
    console.warn("VITE_GA_MEASUREMENT_ID no está configurado.");
  }
};

export const logPageView = (path) => {
  if (TRACKING_ID) {
    ReactGA.send({
      hitType: "pageview",
      page: path || window.location.pathname,
    });
  }
};

export const logEvent = (category, action, label = "") => {
  if (TRACKING_ID) {
    ReactGA.event({
      category,
      action,
      label,
    });
  }
};
