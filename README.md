# RouteX

<span class="badge-npmversion"><a href="https://npmjs.org/package/@tralse/routex" title="View this project on NPM"><img src="https://img.shields.io/npm/v/%40tralse%2Froutex" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/pg" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/%40tralse%2Froutex.svg" alt="NPM downloads" /></a></span>

RouteX is a lightweight package designed to simplify the management and loading of routes in an Express.js application based on configuration files. It automates the process of routing setup, allowing developers to define routes in configuration files and seamlessly integrate them into their Express.js projects.

## `loadRoutes` Function

The `loadRoutes` function in RouteX facilitates automatic loading of routes into an Express.js application based on a specified configuration file (`routex.json`, `routex.config.js`, `routex.config.mjs`, `routex.config.cjs`). It recursively scans the specified directory for route files and dynamically mounts them in the Express app.

### Installation

Install RouteX via npm:

```bash
npm install routex --save
```

### Usage

```javascript
import express from "express";
import loadRoutes from "routex";

const app = express();

// Load routes based on configuration files in the module's directory
await loadRoutes(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
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
  **Description**

1. `Automatic Configuration Loading`: The function automatically loads the configuration (`routex.json`, `routex.config.js`, etc.) relative to the module's directory (`__dirname`).

2. `Dynamic Route Loading`: Routes are dynamically loaded from the specified routesPath directory in the configuration file. It supports CommonJS (`_.js, _.cjs`) and ECMAScript Module (`*.mjs`) formats.

3. `Recursive Directory Walk`: The function recursively scans the routesPath directory, mounting routes based on file extensions (`js, ts, mjs`).

#### Example

Assuming the following directory structure:

```text
project/
│
├── routes/
│ ├── users.mjs
│ ├── products.mjs
│ └── index.mjs
│
├── routex.json
└── index.mjs
```

**users.mjs:**

```javascript
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Users list");
});

export default router;
```

**products.mjs:**

```javascript
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Products list");
});

export default router;
```

**index.mjs:**

```javascript
import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("Homepage");
});

export default router;
```

**routex.json:**

```json
{
  "routesPath": "./routes"
}
```

In `index.mjs`, load and start the Express app with RouteX:

```javascript
Copy code
import express from 'express';
import loadRoutes from 'routex';

const app = express();

// Load routes based on configuration files in the module's directory
await loadRoutes(app);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
```

## Contributing

Contributions are welcome! Fork the repository, make improvements, and submit a pull request.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
