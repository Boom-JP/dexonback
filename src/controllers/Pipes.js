var express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()
const moment = require('moment');
const database = require('../configs/database');
const { default: next } = require("next");


router.post('/add', jsonParser, (req, res) => {
    var line_number = req.body.line_number
    var location = req.body.location
    var from = req.body.from
    var to = req.body.to
    var drawing_number = req.body.drawing_number
    var service = req.body.service
    var material = req.body.material
    var inservice_date = req.body.inservice_date
    var pipe_size = req.body.pipe_size
    var original_thickness = req.body.original_thickness
    var stress = req.body.stress
    var joint_efficiency = req.body.joint_efficiency
    var ca = req.body.ca
    var design_life = req.body.design_life
    var design_pressure = req.body.design_pressure
    var operating_pressure = req.body.operating_pressure
    var design_temperature = req.body.design_temperature
    var operating_temperature = req.body.operating_temperature
    var values = [line_number, 
                  location, 
                  from, 
                  to, 
                  drawing_number, 
                  service, 
                  material,
                  inservice_date,
                  pipe_size,
                  original_thickness,
                  stress,
                  joint_efficiency,
                  ca,
                  design_life,
                  design_pressure,
                  operating_pressure,
                  design_temperature,
                  operating_temperature
                ];
    var sql =   ` 
                  INSERT INTO INFO (line_number, 
                                    location, 
                                    \`from\`, 
                                    \`to\`, 
                                    drawing_number,
                                    service,
                                    material,
                                    inservice_date,
                                    pipe_size,
                                    original_thickness,
                                    stress,
                                    joint_efficiency,
                                    ca,
                                    design_life,
                                    design_pressure,
                                    operating_pressure,
                                    design_temperature,
                                    operating_temperature) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `

    database.query(sql, values, (err,results, fields) => {
            if (err){
                return res.json({status: 'error', message: err})
            }
            // console.log(results);
            // console.log(fields);
            return res.status(201).json({status: "ok"})
        }
    )
})

router.delete('/remove/:key', jsonParser, function (req, res){
    const id = req.params.key;
    // console.log(id);
    var sql = 'DELETE FROM INFO WHERE id= ?'
    database.query(sql, id, (err, result) => {
        if (err){ return res.json({status: 'error', message: err});}
        return res.status(200).json('removed')
        // res.redirect('/index');
    })
})

router.patch('/update', jsonParser, function (req, res){
    var id = req.body.id
    var line_number = req.body.line_number
    var location = req.body.location
    var from = req.body.from
    var to = req.body.to
    var drawing_number = req.body.drawing_number
    var service = req.body.service
    var material = req.body.material
    var inservice_date = moment(req.body.inservice_date).format('YYYY-MM-DD')
    var pipe_size = req.body.pipe_size
    var original_thickness = req.body.original_thickness
    var stress = req.body.stress
    var joint_efficiency = req.body.joint_efficiency
    var ca = req.body.ca
    var design_life = req.body.design_life
    var design_pressure = req.body.design_pressure
    var operating_pressure = req.body.operating_pressure
    var design_temperature = req.body.design_temperature
    var operating_temperature = req.body.operating_temperature
    var sql = ` UPDATE INFO
                SET line_number = '${line_number}',
                    location = '${location}',
                    \`from\` = '${from}',
                    \`to\` = '${to}',
                    drawing_number = '${drawing_number}',
                    service = '${service}',
                    material = '${material}',
                    inservice_date = '${inservice_date}',
                    pipe_size = '${pipe_size}',
                    original_thickness = '${original_thickness}',
                    stress = '${stress}',
                    joint_efficiency = '${joint_efficiency}',
                    ca = '${ca}',
                    design_life = '${design_life}',
                    design_pressure = '${design_pressure}',
                    operating_pressure = '${operating_pressure}',
                    design_temperature = '${design_temperature}',
                    operating_temperature = '${operating_temperature}',
                    updated_date = CURRENT_TIMESTAMP
                WHERE id = ${id}`

    database.query(sql, (err, result) => {
        if (err){ return res.status(400).json({status: 'error', message: err}); }
        console.log(result);
        return res.status(201).json('updated')
    })
})

router.get('/view', jsonParser, (req, res, next) => {

    var sql = 'SELECT * FROM INFO'

    database.query(sql, (error, data) => {
        if (error) {
            res.status(400).json({'status':'error','error':error});
            return
        }
        // console.log(data)
        res.status(200).json({data});
    })
})

router.post('/search', jsonParser, (req, res, next) => {
    var id = req.body.values.id
    var sql = `SELECT * FROM INFO WHERE id = ${id}`

    database.query(sql, (error, data) => {
        if (error) {
            res.status(400).json({'status':'error','error':error});
            return
        }
        // console.log(data)
        res.status(200).json({data});
    })
})

module.exports = router;

