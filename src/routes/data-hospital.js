const express = require('express');
const router = express.Router();

//Invoca el contendio de ../data-hospital.json mediante const products y lo exporta para su uso
const hospitales = require('../data-hospital.json');

router.get('/', (req, res) => {
  res.json(hospitales);
});

module.exports = router;