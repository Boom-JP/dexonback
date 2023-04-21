var express = require('express')
var cors = require('cors')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var router = express.Router()

const database = require('../configs/database');
const { default: next } = require("next");
const { ST } = require('next/dist/shared/lib/utils')

function AOD_cal(pipe_size) {
    switch (pipe_size) {
        case 0.125:
            return 10.300;
        case 0.250:
            return 13.700;
        case 0.357:
            return 17.100;
        case 0.500:
            return 21.300;
        case 0.750:
            return 26.700;
        case 1.000:
            return 33.400;
        case 1.250:
            return 42.200;
        case 1.500:
            return 48.300;
        case 2.000:
            return 60.300;
        case 2.500:
            return 73.000;
        case 3.000:
            return 88.900;
        case 3.500:
            return 101.600;
        case 4.000:
            return 114.300;
        case 5.000:
            return 141.300;
        case 6.000:
            return 168.300;
        case 8.000:
            return 219.100;
        case 10.000:
            return 273.000;
        case 12.000:
            return 323.800;
        case 14.000:
            return 355.600;
        case 16.000:
            return 406.400;
        case 18.000:
            return 457.000;
        default:
            return 0;
    }
}

function structural_thickness_cal(pipe_size) {
    if (pipe_size<=2) {
        return 1.80;
    } else if(pipe_size==3) {
        return 2.00;
    } else if(pipe_size==4) {
        return 2.30;
    } else if(pipe_size>=5 && pipe_size<=18) {
        return 2.80;
    } else if(pipe_size>=20){
        return 3.10;
    }
    else {
        return undefined;
    }
}

function design_thickness_cal(design_pressure, AOD,stress, joint_efficiency) {
    return (design_pressure*AOD)/((2*stress*joint_efficiency)+(2*design_pressure*0.4));
}

function required_thickness_cal(design_thickness, structural_thickness) {
    if (design_thickness>structural_thickness) {
        return design_thickness;
    } else {
        return structural_thickness
    }
}

function popOutside(arr) {
    return arr.pop();
}

router.post('/add', jsonParser, (req, res) => {
    var line_number_id = req.body.line_number_id
    console.log(req.body);
    var cml_number = req.body.cml_number
    var cml_description = req.body.cml_description
    new Promise((resolve, reject) => {
        database.query(`SELECT * FROM INFO WHERE id = '${line_number_id}'`, 
            (err, result) => {
                if (err) {
                    return reject({status: 'error', message: err});
                }
                resolve(result);
            }
        )
    })
    .then((result) => {
        var pipe = result;
        var pipe_size = pipe[0].pipe_size
        var design_pressure = pipe[0].design_pressure
        var stress = pipe[0].stress
        var joint_efficiency = pipe[0].joint_efficiency

        // console.log(pipe_size);
        var AOD = AOD_cal(pipe_size)
        // console.log(AOD);
        var ST = structural_thickness_cal(pipe_size)
        // console.log(ST);
        var DT = parseFloat(design_thickness_cal(design_pressure, AOD,stress, joint_efficiency).toFixed(3));
        // console.log(DT);
        var RT = required_thickness_cal(DT,ST);
        // console.log(RT);
        new Promise((resolve, reject) => {
            var sql = ` 
                        INSERT INTO CML (
                                            line_number_id,
                                            cml_number,
                                            cml_description,
                                            actual_outside_diameter,
                                            design_thickness,
                                            structural_thickness,
                                            required_thickness
                                        ) 
                        VALUES (
                                    ${line_number_id},
                                    ${cml_number},
                                    '${cml_description}',
                                    ${AOD},
                                    ${DT},
                                    ${ST},
                                    ${RT}
                                )
                    `
            database.query(sql, (err, result) => {
                                    if (err) {return reject({status: 'error', message: err});}
                                    resolve(result);
                                }
            )
        }).then((result) => {
            return res.status(201).json({status: "ok"})
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
    })
    .catch((err) => {
        return res.status(400).json(err);
    });
})

router.delete('/remove/:key', jsonParser, function (req, res){
    const id = req.params.key;
    var sql = 'DELETE FROM CML WHERE id= ?'
    database.query(sql, id, (err, result) => {
        if (err){ return res.json({status: 'error', message: err});}
        return res.status(200).json('removed')
    })
})

router.patch('/update', jsonParser, function (req, res){
    console.log(req.body);
    var id = req.body.id
    var line_number_id = req.body.line_number_id
    var cml_number = req.body.cml_number
    var cml_description = req.body.cml_description
    new Promise((resolve, reject) => {
        database.query(`SELECT * FROM INFO WHERE id = ${line_number_id}`, 
            (err, result) => {
                if (err) {
                    return reject({status: 'error', message: err});
                }
                resolve(result);
            }
        )
    })
    .then((result) => {
        var pipe = result;
        var pipe_size = pipe[0].pipe_size
        var design_pressure = pipe[0].design_pressure
        var stress = pipe[0].stress
        var joint_efficiency = pipe[0].joint_efficiency

        // console.log(pipe_size);
        var AOD = AOD_cal(pipe_size)
        // console.log(AOD);
        var ST = structural_thickness_cal(pipe_size)
        // console.log(ST);
        var DT = parseFloat(design_thickness_cal(design_pressure, AOD,stress, joint_efficiency).toFixed(3));
        // console.log(DT);
        var RT = required_thickness_cal(DT,ST);
        // console.log(RT);
        new Promise((resolve, reject) => {
            var sql = ` UPDATE CML
                        SET line_number_id = ${line_number_id},
                            cml_number = ${cml_number},
                            cml_description = '${cml_description}',
                            actual_outside_diameter = ${AOD},
                            design_thickness = ${DT},
                            structural_thickness = ${ST},
                            required_thickness = ${RT},
                            updated_date = CURRENT_TIMESTAMP
                        WHERE id = ${id}
                `
            database.query(sql, (err, result) => {
                                    if (err) {return reject({status: 'error', message: err});}
                                    resolve(result);
                                }
            )
        }).then((result) => {
            return res.status(201).json({status: "ok"})
        })
        .catch((err) => {
            return res.status(400).json(err);
        });
    })
    .catch((err) => {
        return res.status(400).json(err);
    });
})


router.get('/view', jsonParser, (req, res, next) => {

    var sql = 'SELECT * FROM CML ORDER BY cml_number DESC'

    database.query(sql, (error, data) => {
        if (error) {
            res.status(400).json({'status':'error','error':error});
            return
        }
        console.log(data)
        res.status(200).json({data});
    })
})

router.post('/search/:line_number', jsonParser, (req, res, next) => {
    const line_number = req.params.line_number;
    var sqlSearch = `SELECT id FROM INFO WHERE line_number = '${line_number}'`
    database.query(sqlSearch, (error, data) => {
        if (error) {
            res.status(400).json({'status':'error','error':error});
            return
        }
        let id = data[0].id
        var sql = `SELECT * FROM CML WHERE line_number_id = ${id}`
        database.query(sql, (error, data) => {
            if (error) {
                return res.status(400).json({'status':'error','error':error});
            }
            console.log(data)
            res.status(200).json({data});
        })
        })
})

router.post('/search', jsonParser, (req, res, next) => {
    var id = req.body.values.id
    var sql = `SELECT * FROM CML WHERE id = ${id}`

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