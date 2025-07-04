import Server from "./server.ts";

const main = () => {
  const server = new Server();
  Deno.serve({ port: 3000 }, server.initialize());
};

main();