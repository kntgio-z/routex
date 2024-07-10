import { Express } from 'express';
import fs from 'fs';
import path from 'path';
import loadConfig from './config';

export const RouteX = async (app: Express, rootDir: string): Promise<void> => {
  const config = await loadConfig(rootDir);
  const routesPath = path.resolve(rootDir, config.routesPath);

  const walkDirectory = async (dirPath: string, baseRoute = ''): Promise<void> => {
    const files = fs.readdirSync(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const routePath = path.join(baseRoute, file).replace(/\\/g, '/').replace(/\.[jt]s$/, '');

      if (fs.lstatSync(filePath).isDirectory()) {
        await walkDirectory(filePath, routePath);
      } else if (file.endsWith('.js') || file.endsWith('.ts')) {
        const route = require(filePath);
        app.use(routePath, route);
        console.log(`Loaded route: ${routePath}`);
      } else if (file.endsWith('.mjs')) {
        const { default: route } = await import(filePath);
        app.use(routePath, route);
        console.log(`Loaded route: ${routePath}`);
      }
    }
  };

  await walkDirectory(routesPath);
};
