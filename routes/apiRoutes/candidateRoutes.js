const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id`;
    db.query(sql, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        })
    });
});

router.get('/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`;
    db.query(sql, req.params.id, (err, row) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

router.post('/candidate', (req, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if(errors){
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
                    VALUES (?,?,?,)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    db.query(sql, params, (err, result) => {
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Successful',
            data: body
        });
    });
});

router.put('/candidate/:id', (req, res) => {
    const errors = inputCheck(req.body, 'party_id');

    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE candidates SET party_id = ?
                WHERE id = ?`;
    const params = [req.body.party_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if(err)
            res.status(400).json({error: err.message});
        else if(!result.affectedRows)
            res.json({message: 'Candidate not found'});
        else 
            res.json({
                message: 'Success',
                data: req.body,
                changes: result.affectedRows
            });
    });
});

router.delete('/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    db.query(sql, req.params.id, (err, result) => {
        if(err)
            res.status(400).json({error: err.message});
        else if(!result.affectedRows)
            res.json({
                message: 'Candidate Not Found. '
            });
        else
            res.json({
                message: 'Deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
    });
});


module.exports = router;