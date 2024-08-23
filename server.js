import 'dotenv/config'
import Hapi from "@hapi/hapi";

import Controllers from "./controller/index.js";

export default async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route(Controllers);

  await server.start();
  console.log("Server running on %s", server.info.uri);

  process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });

  return server
};



