import Server from "./server.ts";

const main = () => {
  const server = new Server();
  server.start();
};

main();