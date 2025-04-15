import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { BlankEnv, BlankSchema } from 'hono/types';
import { serveStatic } from 'hono/deno';

export default class Server {
  start() {
    console.log('Server is started');
    const app = new Hono();
    this.appMethod(app);

    Deno.serve({ port: 3000 }, app.fetch);
  }

  private appMethod(app: Hono<BlankEnv, BlankSchema, '/'>) {
    app.use(logger());
    app.get('/', serveStatic({ root: './public' }));
  }
}
