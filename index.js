const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.json());

// Serve static Swagger UI assets
app.use('/api-docs/:spec', swaggerUi.serve);

// Fallback route for serving Swagger API documentation based on the path parameter
app.get('/api-docs/:spec', (req, res, next) => {
    const specName = req.params.spec;

    const specPath = path.join(__dirname, 'api-specs', `${specName}`);

    if (fs.existsSync(specPath)) {
        try {

            const swaggerDocument = YAML.load(specPath);
            swaggerUi.setup(swaggerDocument)(req, res, next);

        } catch (error) {

            res.status(500).send('Error loading Swagger document');
        }
    } else {
        res.status(404).send('API specification not found');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Swagger docs available at http://localhost:${port}/api-docs/:spec`);
});
