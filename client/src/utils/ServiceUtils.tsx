export const getBaseUrl = () => {
  switch (process.env.NODE_ENV) {
    case "development":
    case "test":
      return "http://localhost:5000";
    case "production":
      // # TODO - get correct url
      return "to-be-determined";
    default:
      return "http://localhost:5000";
  }
};
