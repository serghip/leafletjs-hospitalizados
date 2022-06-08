const express = require('express');
const router = express.Router();

//Invoca el contendio de ../data.json mediante const products y lo exporta para su uso
const pacientes = require('../data.json');

router.get('/', (req, res) => {
  res.json(pacientes);
});

module.exports = router;