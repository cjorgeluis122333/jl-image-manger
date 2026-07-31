import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Redirect root to documentation
  app.get('/', (req, res) => {
    res.redirect('/app/documentation/');
  });

  let viteDevServer: any = null;

  if (process.env.NODE_ENV !== "production") {
    viteDevServer = await createViteServer({
      server: { middlewareMode: true },
      appType: "mpa", // Multi-page app
    });
    app.use(viteDevServer.middlewares);
  } else {
    // In production, we'd serve the built files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
  }

  // SPA fallback for playground
  app.get('/app/playground/*all', async (req, res, next) => {
    if (req.accepts('html')) {
      if (process.env.NODE_ENV !== "production") {
        try {
          const html = fs.readFileSync(path.join(process.cwd(), 'app/playground/index.html'), 'utf-8');
          const transformed = await viteDevServer.transformIndexHtml(req.url, html);
          res.send(transformed);
        } catch (e) {
          next(e);
        }
      } else {
        res.sendFile(path.join(process.cwd(), 'dist/app/playground/index.html'));
      }
    } else {
      next();
    }
  });

  // SPA fallback for documentation
  app.get('/app/documentation/*all', async (req, res, next) => {
    if (req.accepts('html')) {
      if (process.env.NODE_ENV !== "production") {
        try {
          const html = fs.readFileSync(path.join(process.cwd(), 'app/documentation/index.html'), 'utf-8');
          const transformed = await viteDevServer.transformIndexHtml(req.url, html);
          res.send(transformed);
        } catch (e) {
          next(e);
        }
      } else {
        res.sendFile(path.join(process.cwd(), 'dist/app/documentation/index.html'));
      }
    } else {
      next();
    }
  });

  app.get("*all", (req, res) => { res.redirect("/app/documentation/"); });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
