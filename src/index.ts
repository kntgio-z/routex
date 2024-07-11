import { Express } from "express";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import loadConfig from "./config";
import { log } from "@tralse/developer-logs";

interface Options {
  debug: boolean;
  makeReport: boolean;
}

/**
 * Loads and registers routes from a specified directory into an Express application.
 *
 * @remarks
 * This function is already usable in `.mjs` modules.
 *
 * @param app - The Express application instance.
 * @param rootDir - The root directory containing the routes configuration.
 * @param options - Optional configuration for debugging and reporting.
 * @returns A promise that resolves when all routes are loaded.
 */
export const RouteX = async (
  app: Express,
  rootDir: string,
  options?: Options
): Promise<void> => {
  const config = await loadConfig(rootDir);
  const routesPath = path.resolve(rootDir, config.routesPath);

  let filesRead = 0;
  let filesSuccessRead = 0;
  let ignoredFiles = 0;
  let loadedRoutes = 0;
  let misses = 0;

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
        filesRead++;
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

          const newRoutePath = `/${routePath}`;
          const isIgnored = /\/_.*$/.test(newRoutePath);

          if (isIgnored) {
            ignoredFiles++;
            continue;
          }

          try {
            if (ext === ".js" || ext === ".ts") {
              const route = require(filePath);
              app.use(newRoutePath, route);
            } else if (ext === ".mjs") {
              const routeUrl = pathToFileURL(filePath).href;
              const { default: route } = await import(routeUrl);
              app.use(newRoutePath, route);
            }
            log.green(`Loaded route: ${newRoutePath}`, "routex");
            loadedRoutes++;
            filesSuccessRead++;
          } catch (error) {
            log.red(
              `ROUTE_ERR: Error loading route: ${newRoutePath}. ${
                options?.debug
                  ? ""
                  : "To view full error, add a parameter {debug: true} to the RouteX method."
              }`,
              "routex"
            );
            if (options?.debug) console.error(error);
            misses++;
          }
        }
      }
    } catch (error) {
      log.red(
        `DIR_ERR: Error reading directory: ${dirPath}. ${
          options?.debug
            ? ""
            : "To view full error, add a parameter {debug: true} to the RouteX method."
        }`,
        "routex"
      );
      if (options?.debug) console.error(error);
      misses++;
    }
  };

  await walkDirectory(routesPath);

  if (options?.makeReport) {
    const report = `
    -------- RouteX Report --------
    Total files processed: ${filesRead}
    - Successfully read: ${filesSuccessRead}
    - Ignored: ${ignoredFiles}
    - Errors encountered: ${misses}
    --------------------------------
    Routes loaded: ${loadedRoutes}
    --------------------------------
    Success rate: ${(((filesRead - misses) / filesRead) * 100).toFixed(2)}%
    `;
    log.brightBlue(report, "routex");
  }
};
