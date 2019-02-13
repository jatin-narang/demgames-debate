const gameData = require('../data/Module/moduleData.json');
const express = require('express');
const app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));

app.get('/api/game', (req, res) => {
	if (!gameData) res.status(404).send('No data found');
	res.json({ gameData });
});

app.listen(9000, () => console.log('listening'));
