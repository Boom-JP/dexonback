var express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()

const database = require('../configs/database');
const { default: next } = require("next");

router.post('/add', jsonParser, (req, res) => {
    console.log(req.body);
    var line_number = req.body.line_number
    var cml_number = req.body.cml_number
    var tp_number = req.body.tp_number
    var tp_description = req.body.tp_description
    var note = req.body.note
    var sql =   ` 
                  INSERT INTO TEST_POINT (  line_number,
                                            cml_number, 
                                            tp_number, 
                                            tp_description, 
                                            note 
                                        ) 
                  VALUES ('${line_number}', '${cml_number}', '${tp_number}', '${tp_description}', '${note}')
                `

    database.query(sql, (err,results, fields) => {
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
    var id = req.params.key;
    var sql = 'DELETE FROM TEST_POINT WHERE id= ?'
    database.query(sql, id, (err, result) => {
        if (err){ return res.json({status: 'error', message: err});}
        return res.status(200).json('removed')
        // res.redirect('/index');
    })
})

router.patch('/update', jsonParser, function (req, res){
    var id = req.body.id
    var cml_number = req.body.cml_number
    var line_number = req.body.line_number
    var tp_number = req.body.tp_number
    var tp_description = req.body.tp_description
    var note = req.body.note
    var sql = ` UPDATE TEST_POINT
                SET line_number = '${line_number}',
                    cml_number = '${cml_number}',
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

router.post('/search/:line_number/:cml_number', jsonParser, (req, res, next) => {
    const line_number = req.params.line_number;
    const cml_number = req.params.cml_number;
    
    // console.log(line_number);
    // console.log(cml_number);
    var sqlSearch = `SELECT * FROM TEST_POINT WHERE line_number = '${line_number}' AND cml_number = '${cml_number}' ORDER BY tp_number ASC`
    database.query(sqlSearch, (error, data) => {
        if (error) {
            return res.status(400).json({'status':'error','error':error});
        }
        console.log(data)
        res.status(200).json({data});
    })
})

router.post('/search', jsonParser, (req, res, next) => {
    var id = req.body.id
    var sql = `SELECT * FROM TEST_POINT WHERE id = ${id}`

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