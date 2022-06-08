const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();

// settings
app.set('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// static files
app.use(express.static(path.join(__dirname, 'public')));

// start the server
app.listen(app.get('port'), () => {
  console.log(`server on port ${app.get('port')}`);
  console.log('localhost:3000')
});

// routes
//llama a la funcion alojada en ./routes/index y la define en '/data'
app.use('/data', require('./routes/data'));
app.use('/data-hospital', require('./routes/data-hospital'));

//visualizacion lista pacientes
var pacientes = require('./data.json');
app.get('/pacientes', (req, res)=>{
  res.json(pacientes)
})

//visualizacion lista hospitales
var hospitales = require('./data-hospital.json');
app.get('/hospitales', (req, res)=>{
  res.json(hospitales)
})