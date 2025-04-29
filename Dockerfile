FROM denoland/deno:2.2.11
WORKDIR /main
COPY . .
RUN deno install
CMD ["deno", "task", "start"]
