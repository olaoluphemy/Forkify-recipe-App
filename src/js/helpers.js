import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

// export const getJSON = async function (url) {
//   try {
//     const res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.status} ${res.status}`);

//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

export const getJSON = async function (url, recipe) {
  try {
    const res = await createJSON(url, recipe);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.status} ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, recipe) {
  try {
    const res = await Promise.race([
      timeout(TIMEOUT_SEC),
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(recipe),
      }),
    ]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.status} ${res.status}`);

    return data;
  } catch (err) {
    throw err;
  }
};
export const createJSON = async function (url, recipe) {
  try {
    let res;

    if (recipe)
      res = await Promise.race([
        timeout(TIMEOUT_SEC),
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(recipe),
        }),
      ]);

    if (!recipe) res = await Promise.race([timeout(TIMEOUT_SEC), fetch(url)]);

    return res;
  } catch (err) {
    throw err;
  }
};
