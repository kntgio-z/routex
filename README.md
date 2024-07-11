# RouteX

<span class="badge-npmversion"><a href="https://npmjs.org/package/@tralse/routex" title="View this project on NPM"><img src="https://img.shields.io/npm/v/%40tralse%2Froutex" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/%40tralse%2Froutex" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/%40tralse%2Froutex.svg" alt="NPM downloads" /></a></span>

RouteX is a lightweight package designed to simplify the management and loading of routes in an Express.js application based on configuration files. It automates the process of routing setup, allowing developers to define routes in configuration files and seamlessly integrate them into their Express.js projects.

**ANNOUNCEMENT**: This version is now usable in `.mjs` files! Exclusive documentation of `.mjs` files will be released soon.

## `RouteX` Function

The `RouteX` function in RouteX facilitates automatic loading of routes into an Express.js application based on a specified configuration file (`routex.json`, `routex.config.js`, `routex.config.mjs`, `routex.config.cjs`). It recursively scans the specified directory for route files and dynamically mounts them in the Express app.

### Installation

Install RouteX via npm:

```bash
npm install @tralse/routex
```

### Usage

```javascript
const express = require("express");
const { RouteX } = require("@tralse/routex");
const { fileURLToPath } = require("url");

const app = express();

(async () => {
  // Load routes using RouteX
  await RouteX(app, __dirname);

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

### Configuration

Place one of the following configuration files in your project's root directory:

- routex.json
- routex.config.js
- routex.config.mjs
- routex.config.cjs

Example `routex.json`:

```json
{
  "routesPath": "./routes"
}
```

### Function Details

#### Parameters

- `app: Express`: The Express application instance where routes will be mounted.
- `dirname: string`: The filepath of the caller.
- `options: Options` (optional): Configuration options for debugging and reporting.

#### Options

- `debug: boolean` (optional): Enable detailed error logging.
- `makeReport: boolean` (optional): Generate a detailed report after loading routes.

#### Description

1. **Automatic Configuration Loading**: The function automatically loads the configuration (`routex.json`, `routex.config.js`, etc.) relative to the caller's directory (`__dirname`).

2. **Dynamic Route Loading**: Routes are dynamically loaded from the specified routesPath directory in the configuration file. It supports CommonJS (`*.js, *.cjs`) and ECMAScript Module (`*.mjs`) formats.

3. **Recursive Directory Walk**: The function recursively scans the routesPath directory, mounting routes based on file extensions (`js, ts, mjs`).

4. **Detailed Reporting**: The function can generate a comprehensive report on the routing setup process, providing insights into the number of files read, successfully processed, ignored, and errors encountered.

5. **Debug Mode**: When the debug option is enabled, the function provides detailed error logging. This is helpful in troubleshooting issues by displaying specific error messages and stack traces in the console.

#### Example

Assuming the following directory structure:

```text
project/
│
├── routes/
│   │
│   ├── users/
│   │   ├── index.js
│   │   └── [id]/
│   │       └── index.js
│   │
│   ├── products.js
│   │
│   └── invoice/
│       ├── customers.js
│       └── merchants.js
│
├── routex.json
└── index.js
```

**/routes/users/index.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Users list");
});

module.exports = router;
```

**/routes/users/\[id\]/index.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  const { id } = req.params;
  if (id) res.send("Users with id " + id);
  else res.status(400).send({ error: "Invalid id!" });
});

module.exports = router;
```

**/routes/products.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Products list");
});

module.exports = router;
```

**/routes/invoice/customers.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Customers list");
});

module.exports = router;
```

**/routes/invoice/merchants.js:**

```javascript
const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("Merchants list");
});

module.exports = router;
```

**routex.json:**

```json
{
  "routesPath": "./routes"
}
```

In `index.js`, load and start the Express app with RouteX:

```javascript
const express = require("express");
const { RouteX } = require("@tralse/routex");
const { fileURLToPath } = require("url");

const app = express();

(async () => {
  // Load routes using RouteX
  await RouteX(app, __dirname);

  // Start server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
```

After running the server, you can now access the endpoints with format:

```text
http://localhost:3000/users
http://localhost:3000/users/:id
http://localhost:3000/products
http://localhost:3000/invoice/customers
http://localhost:3000/invoice/merchants
```

**NOTE**: All files that is named index will be transformed as the endpoint following its folder name.

### Ignoring Files

RouteX allows you to ignore specific files during the route loading process by starting filenames with an underscore (`_`). This feature is useful for excluding certain files from being automatically registered as routes in your Express application.

#### Example

Assume you have a directory structure like this:

```text
project/
│
├── routes/
│ ├── _ignore.js
│ ├── users/
│ │ ├── index.js
│ │ └── [id]/
│ │ └── index.js
│ └── products.js
```

In this example, `_ignore.js` will not be loaded as a route, while routes defined in `users/` and `products.js` will be automatically registered.

To utilize this feature effectively, ensure that any files you want to ignore are prefixed with `_` in filenames.

### Options Parameter

#### Debugging

RouteX supports a debug mode to provide more detailed error information during route loading. To enable debug mode, pass `{ debug: true }` as an option when calling the RouteX function.

##### Example

```javascript
const express = require("express");
const { RouteX } = require("@tralse/routex");
const { fileURLToPath } = require("url");

const app = express();

(async () => {
await RouteX(app, __dirname, { debug: true });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
})();
```

#### Make Report

Enabling `makeReport` param in options provides a comprehensive summary of the routing setup process, including the total number of files processed, successfully read, ignored, errors encountered, routes loaded, and the overall success rate.

##### Example

```javascript
const express = require("express");
const { RouteX } = require("@tralse/routex");
const { fileURLToPath } = require("url");

const app = express();

(async () => {
await RouteX(app, __dirname, { makeReport: true });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
})();
```

When makeReport is enabled in the options, RouteX generates a detailed report at the end of the routing process:

```text
-------- RouteX Report --------
Total files processed: 10
- Successfully read: 8
- Ignored: 1
- Errors encountered: 1
--------------------------------
Routes loaded: 8
--------------------------------
Success rate: 90.00%
```

## Changelogs

Stay tuned for updates. [See the CHANGELOG file](./CHANGELOG.md) for details.

## Contributing

Contributions are welcome! Fork the repository, make improvements, and submit a pull request.

## License

This project is licensed under the MIT License. [See the LICENSE file](./LICENSE) for details.
