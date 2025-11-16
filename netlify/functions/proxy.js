// netlify/functions/proxy.js - Optional: for advanced API proxying if needed
// Most users won't need this with the netlify.toml redirects above

exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Proxy function ready" })
  };
};
