var express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()

const database = require('../configs/database');
const { default: next } = require("next");

router.post('/add', jsonParser, (req, res) => {
    var tp_number_id = req.body.values.tp_number_id
    var inspection_date = req.body.values.inspection_date
    var actual_thickness = req.body.values.actual_thickness
    var values = [tp_number_id,
                  inspection_date,
                  actual_thickness
                ];
    var sql =   ` 
                  INSERT INTO THICKNESS (   tp_number_id, 
                                            inspection_date, 
                                            actual_thickness
                                        ) 
                  VALUES (?, ?, ?)
                `

    database.query(sql, values, (err,results, fields) => {
            if (err){
                return res.json({status: 'error', message: err})
            }
            console.log(results);
            console.log(fields);
            return res.status(201).json({status: "ok"})
        }
    )
})

router.delete('/remove', jsonParser, function (req, res){
    var id = req.body.values.id
    var sql = 'DELETE FROM THICKNESS WHERE id= ?'
    database.query(sql, id, (err, result) => {
        if (err){ return res.json({status: 'error', message: err});}
        return res.status(200).json('removed')
        // res.redirect('/index');
    })
})

router.patch('/update', jsonParser, function (req, res){
    var id = req.body.values.id
    var tp_number_id = req.body.values.tp_number_id
    var inspection_date = req.body.values.inspection_date
    var actual_thickness = req.body.values.actual_thickness
    var sql = ` UPDATE THICKNESS
                SET tp_number_id = '${tp_number_id}',
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


module.exports = router;