# RouteX

<span class="badge-npmversion"><a href="https://npmjs.org/package/@tralse/routex" title="View this project on NPM"><img src="https://img.shields.io/npm/v/%40tralse%2Froutex" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/pg" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/%40tralse%2Froutex.svg" alt="NPM downloads" /></a></span>

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

#### Description

1. `Automatic Configuration Loading`: The function automatically loads the configuration (`routex.json`, `routex.config.js`, etc.) relative to the caller's directory (`__dirname`).

2. `Dynamic Route Loading`: Routes are dynamically loaded from the specified routesPath directory in the configuration file. It supports CommonJS (`*.js, *.cjs`) and ECMAScript Module (`*.mjs`) formats.

3. `Recursive Directory Walk`: The function recursively scans the routesPath directory, mounting routes based on file extensions (`js, ts, mjs`).

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

## Changelogs

Stay tuned for updates. [See the CHANGELOG file](./CHANGELOG.md) for details.

## Contributing

Contributions are welcome! Fork the repository, make improvements, and submit a pull request.

## License

This project is licensed under the MIT License. [See the LICENSE file](./LICENSE) for details.
