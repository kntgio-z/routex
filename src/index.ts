import { Express } from "express";
import fs from "fs";
import path from "path";
import loadConfig from "./config";

export const RouteX = async (app: Express, rootDir: string): Promise<void> => {
  const config = await loadConfig(rootDir);
  const routesPath = path.resolve(rootDir, config.routesPath);

  const walkDirectory = async (dirPath: string, baseRoute = ""): Promise<void> => {
    try {
      const files = await fs.promises.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.promises.lstat(filePath);

        if (stats.isDirectory()) {
          await walkDirectory(filePath, path.join(baseRoute, file));
        } else {
          const ext = path.extname(file);
          const routePath = path.join(baseRoute, path.basename(file, ext))
            .replace(/\[([^[\]]+)\]/g, ":$1")
            .replace(/\/index$/, "");

          if (ext === ".js" || ext === ".ts") {
            const route = require(filePath);
            const newRoutePath = `/${routePath}`;
            app.use(newRoutePath, route);
            console.log(`Loaded route: ${newRoutePath}`);
          } else if (ext === ".mjs") {
            const { default: route } = await import(filePath);
            const newRoutePath = `/${routePath}`;
            app.use(newRoutePath, route);
            console.log(`Loaded route: ${newRoutePath}`);
          }
        }
      }
    } catch (error) {
      console.error(`Error loading routes from ${dirPath}:`, error);
    }
  };

  await walkDirectory(routesPath);
};
