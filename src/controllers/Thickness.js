var express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()

const database = require('../configs/database');
const { default: next } = require("next");

router.post('/add', jsonParser, (req, res) => {
    var line_number = req.body.line_number
    var cml_number = req.body.cml_number
    var tp_number = req.body.tp_number
    console.log(req.body.tp_number);
    var inspection_date = req.body.inspection_date
    var actual_thickness = req.body.actual_thickness
    var sql =   ` 
                  INSERT INTO THICKNESS (   line_number,
                                            cml_number,
                                            tp_number,
                                            inspection_date,
                                            actual_thickness
                                        ) 
                  VALUES ('${line_number}', '${cml_number}', '${tp_number}', '${inspection_date}', '${actual_thickness}')
                `

    database.query(sql, (err,results, fields) => {
            if (err){
                return res.json({status: 'error', message: err})
            }
            console.log(results);
            console.log(fields);
            return res.status(201).json({status: "ok"})
        }
    )
})

router.delete('/remove/:key', jsonParser, function (req, res){
    var id = req.params.key;
    var sql = 'DELETE FROM THICKNESS WHERE id= ?'
    database.query(sql, id, (err, result) => {
        if (err){ return res.json({status: 'error', message: err});}
        return res.status(200).json('removed')
        // res.redirect('/index');
    })
})

router.patch('/update', jsonParser, function (req, res){
    var id = req.body.id
    var tp_number = req.body.tp_number
    var cml_number = req.body.cml_number
    var line_number = req.body.line_number
    var inspection_date = req.body.inspection_date
    var actual_thickness = req.body.actual_thickness
    var sql = ` UPDATE THICKNESS
                SET tp_number = '${tp_number}',
                    cml_number = '${cml_number},
                    line_number = '${line_number},
                    inspection_date = '${inspection_date}',
                    actual_thickness = '${actual_thickness}',
                    updated_date = CURRENT_TIMESTAMP
                WHERE id = ${id}`

    database.query(sql, (err, result) => {
        if (err){ return res.status(400).json({status: 'error', message: err}); }
        console.log(result);
        return res.status(201).json('updated')
    })
})

router.get('/view', jsonParser, (req, res, next) => {

    var sql = 'SELECT * FROM THICKNESS'

    database.query(sql, (error, data) => {
        if (error) {
            res.status(400).json({'status':'error','error':error});
            return
        }
        console.log(data)
        res.status(200).json({data});
    })
})

router.post('/search/:line_number/:cml_number/:tp_number', jsonParser, (req, res, next) => {
    const line_number = req.params.line_number;
    const cml_number = req.params.cml_number;
    const tp_number = req.params.tp_number;
    var sqlSearch = `   SELECT
                            id,
                            line_number,
                            cml_number,
                            tp_number,
                            DATE_FORMAT(inspection_date, '%Y-%m-%d') AS inspection_date,
                            actual_thickness
                        FROM THICKNESS 
                        WHERE line_number = '${line_number}' 
                        AND cml_number = '${cml_number}' 
                        AND tp_number = '${tp_number}'
                    `
    database.query(sqlSearch, (error, data) => {
        if (error) {
            return res.status(400).json({'status':'error','error':error});
        }
        console.log(data)
        res.status(200).json({data});
    })
})

router.post('/search', jsonParser, (req, res, next) => {
    var id = req.body.values.id
    var sql = `SELECT * FROM THICKNESS WHERE id = ${id}`

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