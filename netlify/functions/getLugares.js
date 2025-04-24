const fetch = require("node-fetch");

exports.getLugares = async () => {
  try {
    const result = await fetch(
      "https://panel.florenciodelgadogurriaran.gal/items/lugar?fields=*.*",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

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
