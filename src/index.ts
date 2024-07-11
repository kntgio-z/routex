import { Express } from "express";
import fs from "fs";
import path from "path";
import loadConfig from "./config";
import { log } from "@tralse/developer-logs";

interface Options {
  debug: boolean;
}

/**
 * Loads and registers routes from a specified directory into an Express application.
 *
 * @remarks
 * This function is currently not usable in `.mjs` modules.
 *
 * @param app - The Express application instance.
 * @param rootDir - The root directory containing the routes configuration.
 * @param options - Optional configuration.
 * @returns A promise that resolves when all routes are loaded.
 */
export const RouteX = async (
  app: Express,
  rootDir: string,
  options?: Options
): Promise<void> => {
  const config = await loadConfig(rootDir);
  const routesPath = path.resolve(rootDir, config.routesPath);

  /**
   * Recursively walks through a directory and registers routes.
   *
   * @param dirPath - The current directory path being walked.
   * @param baseRoute - The base route path.
   */
  const walkDirectory = async (
    dirPath: string,
    baseRoute = ""
  ): Promise<void> => {
    try {
      const files = await fs.promises.readdir(dirPath);

      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = await fs.promises.lstat(filePath);

        if (stats.isDirectory()) {
          await walkDirectory(filePath, path.join(baseRoute, file));
        } else {
          const ext = path.extname(file);
          const routePath = path
            .join(baseRoute, path.basename(file, ext))
            .replace(/\[([^[\]]+)\]/g, ":$1")
            .replace(/\\/g, "/")
            .replace(/\/index$/, "");

          if (ext === ".js" || ext === ".ts") {
            const route = require(filePath);
            const newRoutePath = `/${routePath}`;
            app.use(newRoutePath, route);
            log.green(`Loaded route: ${newRoutePath}`, "routex");
          } else if (ext === ".mjs") {
            const { default: route } = await import(filePath);
            const newRoutePath = `/${routePath}`;
            app.use(newRoutePath, route);
            log.green(`Loaded route: ${newRoutePath}`, "routex");
          }
        }
      }
    } catch (error) {
      log.red(
        `Error loading routes from ${dirPath}. To view full error, add a parameter {debug: true} to the RouteX method.`,
        "routex"
      );
      if (options?.debug) console.error(error);
    }
  };

  await walkDirectory(routesPath);
};
