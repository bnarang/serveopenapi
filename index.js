const express = require('express');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.text({ type: 'text/plain' }));
// Serve static Swagger UI assets
app.use('/api-docs/:spec', swaggerUi.serve);

const apiMap = new Map();


// Fallback route for serving Swagger API documentation based on the path parameter
app.get('/api-docs/:spec', (req, res, next) => {
    const specName = req.params.spec;

    if (apiMap.has(specName)) {
        const swaggerDocument = YAML.parse(apiMap.get(specName));
        swaggerUi.setup(swaggerDocument)(req, res, next);
    } else {
        res.status(404).send('API specification not found');
    }
});

app.post('/api-spec/:spec', (req, res, next) => {

    const specName = req.params.spec;
    apiMap.set(specName, req.body);
    res.send(`API spec received for ${specName}`)
    
});

// Start the server
app.listen(port, () => {
    console.log(`Swagger docs available at http://localhost:${port}/api-docs/:spec`);
});
