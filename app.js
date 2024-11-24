const fs = require("fs");
const express = require('express');
const { mean, median, mode } = require('./operations');

const app = express();
app.set('view engine', 'ejs'); 

const port = 3000;


function parseNumsArray(numsAsStrings) {
    let nums = [];
    for(let i = 0; i < numsAsStrings.length; i++) {
        let val = Number(numsAsStrings[i]);

        if (Number.isNaN(val)) {
            return new Error(`The value '${numsAsStrings[i]}' at index ${i} is not a valid number.`);
        }

        nums.push(val);
    }
    return nums;
}

app.get('/mean', (req, res) => {
    let numsAsStrings = req.query.nums ? req.query.nums.split(',') :
    undefined;

    if(!numsAsStrings) {
        return res.status(400).json({ error: "'nums' are required." });
    }

    let numsOrError = parseNumsArray(numsAsStrings);
    if(numsOrError instanceof Error) {
        return res.status(400).json({ error: numsOrError.message });
    }

    let value = mean(numsOrError);
    return res.json({ operation: 'mean', value });
});

app.get('/median', (req, res) => {
    let numsAsStrings = req.query.nums ? req.query.nums.split(',') :
    undefined;

    if(!numsAsStrings) {
        return res.status(400).json({ error: "'nums' are required." });
    }

    let numsOrError = parseNumsArray(numsAsStrings);
    if(numsOrError instanceof Error) {
        return res.status(400).json({ error: numsOrError.message });
    }

    let value = median(numsOrError);
    return res.json({ operation: 'median', value });
});

app.get('/mode', (req, res) => {
    let numsAsStrings = req.query.nums ? req.query.nums.split(',') :
    undefined;

    if(!numsAsStrings) {
        return res.status(400).json({ error: "'nums' are required." });
    }

    let numsOrError = parseNumsArray(numsAsStrings);
    if(numsOrError instanceof Error) {
        return res.status(400).json({ error: numsOrError.message });
    }

    let value = mode(numsOrError);
    return res.json({ operation: 'mode', value });
});

function writeToFile(operation, value) {
    let timestamp = new Date().toISOString();

    // New code for File I/O
    const data = { timestamp, operation, value };
    fs.appendFileSync('results.json', JSON.stringify(data) + "\n");
}

// Reusable function to handle a request for any operation
function handleOperation(operation, req, res) {
    let numsAsStrings = req.query.nums ? req.query.nums.split(',') : undefined;

    if(!numsAsStrings) {
        return res.status(400).json({ error: "'nums' are required." });
    }

    let numsOrError = parseNumsArray(numsAsStrings);
    if(numsOrError instanceof Error) {
        return res.status(400).json({ error: numsOrError.message });
    }

    let value = operation(numsOrError);
    if (req.query.save === "true") {
        writeToFile(operation.name, value); // Save results if required
    }

    respondBasedOnHeader(req, res, operation.name, value);
}

function calculateOperation(operation, numsAsStrings) {
    if(!numsAsStrings) {
        throw new Error("'nums' are required.");
    }

    let numsOrError = parseNumsArray(numsAsStrings);
    if(numsOrError instanceof Error) {
        throw numsOrError;
    }

    let value = operation(numsOrError);
    return value;
}

function respondBasedOnHeader(req, res, operationName, value) {
    if (req.accepts('html')) {
        // Respond with HTML
        res.render('operationResult', { operation: operationName, value: value });
    } else if (req.accepts('application/json')) {
        // Respond with JSON
        res.json({ operation: operationName, value: value });
    } else {
        // Respond with a 406 Not Acceptable status code
        res.status(406).send('Not Acceptable');
    }
}

app.get('/mean', (req, res) => handleOperation(mean, req, res));
app.get('/median', (req, res) => handleOperation(median, req, res));
app.get('/mode', (req, res) => handleOperation(mode, req, res));

// New "/all" route
app.get('/all', (req, res) => {
    try {
        let numsAsStrings = req.query.nums ? req.query.nums.split(',') : undefined;

        let meanValue = calculateOperation(mean, numsAsStrings);
        let medianValue = calculateOperation(median, numsAsStrings);
        let modeValue = calculateOperation(mode, numsAsStrings);

        if (req.query.save === "true") {
            writeToFile('mean', meanValue);
            writeToFile('median', medianValue);
            writeToFile('mode', modeValue);
        }

        let response = {
            operation: "all",
            mean: meanValue,
            median: medianValue,
            mode: modeValue
        };
        respondBasedOnHeader(req, res, 'all', response);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});