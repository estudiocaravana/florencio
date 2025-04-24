const fetch = require("node-fetch");

exports.getFromDirectus = async (url, method) => {
  try {
    const result = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (result.errors) {
      console.log({ errors: result.errors });
    } else if (!result || !result.data) {
      console.log({ result });
      return "No results found.";
    }

    return result.data;
  } catch (error) {
    console.log(error);
  }
};
