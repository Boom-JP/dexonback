var express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()

const database = require('../configs/database');
const { default: next } = require("next");

router.post('/add', jsonParser, (req, res) => {
    var cml_number_id = req.body.values.cml_number_id
    var tp_number = req.body.values.tp_number
    var tp_description = req.body.values.tp_description
    var note = req.body.values.note
    var values = [cml_number_id, 
                  tp_number, 
                  tp_description, 
                  note
                ];
    var sql =   ` 
                  INSERT INTO TEST_POINT (  cml_number_id, 
                                            tp_number, 
                                            tp_description, 
                                            note 
                                        ) 
                  VALUES (?, ?, ?, ?)
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
    var sql = 'DELETE FROM TEST_POINT WHERE id= ?'
    database.query(sql, id, (err, result) => {
        if (err){ return res.json({status: 'error', message: err});}
        return res.status(200).json('removed')
        // res.redirect('/index');
    })
})

router.patch('/update', jsonParser, function (req, res){
    var id = req.body.values.id
    var cml_number_id = req.body.values.cml_number_id
    var tp_number = req.body.values.tp_number
    var tp_description = req.body.values.tp_description
    var note = req.body.values.note
    var sql = ` UPDATE TEST_POINT
                SET cml_number_id = '${cml_number_id}',
                    tp_number = '${tp_number}',
                    tp_description = '${tp_description}',
                    note = '${note}',
                    updated_date = CURRENT_TIMESTAMP
                WHERE id = ${id}`

    database.query(sql, (err, result) => {
        if (err){ return res.status(400).json({status: 'error', message: err}); }
        console.log(result);
        return res.status(201).json('updated')
    })
})

router.get('/view', jsonParser, (req, res, next) => {

    var sql = 'SELECT * FROM TEST_POINT'

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