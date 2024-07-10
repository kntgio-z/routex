import fs from "fs";
import path from "path";

interface Config {
  routesPath: string;
}

const defaultConfig: Config = {
  routesPath: "./routes",
};

const configFiles = ["routex.json", "routex.config.js", "routex.config.mjs", "routex.config.cjs"];

const loadConfig = async (rootDir: string): Promise<Config> => {
  for (const configFile of configFiles) {
    const configFilePath = path.join(rootDir, configFile);
    if (fs.existsSync(configFilePath)) {
      if (configFile.endsWith(".json")) {
        return JSON.parse(fs.readFileSync(configFilePath, "utf8"));
      } else if (configFile.endsWith(".js") || configFile.endsWith(".cjs")) {
        return require(configFilePath);
      } else if (configFile.endsWith(".mjs")) {
        const { default: config } = await import(configFilePath);
        return config;
      }
    }
  }
  return defaultConfig;
};

export default loadConfig;
