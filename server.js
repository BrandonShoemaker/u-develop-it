const express = require('express');
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'D00d13m4n2080@',
        database: 'election'
    },
    console.log('Connected to election database.')
);

app.get('/api/candidates', (req, res) => {
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

app.get('/api/candidate/:id', (req, res) => {
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

app.get('/api/parties', (req, res) => {
    const sql = `SELECT * FROM parties`;
    db.query(sql, (err, rows) => {
        if(err){
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    })
});

app.get('/api/party/:id', (req, res) => {
    const sql = `SELECT * FROM parties WHERE id = ?`;
    db.query(sql, req.params.id, (err, rows) => {
        if(err){
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    })
});

app.delete('/api/candidate/:id', (req, res) => {
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

app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
    db.query(sql, req.params.id, (err, result) => {
        if(err)
            res.status(400).json({error: err.message});
        else if(!result.affectedRows)
            res.json({
                message: 'Party Not Found. '
            });
        else
            res.json({
                message: 'Deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
    });
    
});

app.post('/api/candidate', ({body}, res) => {
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

app.put('/api/candidate/:id', (req, res) => {
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
// db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
//     if(err)
//         console.log(err);
//     else
//         console.log(result);
// });

// // const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
// //                 VALUES (?,?,?,?)`;
// // const params = [1, 'Ronald', 'Firbank', 1];

// db.query(sql, params, (err, result) => {
//     if(err)
//         console.log(err);
//     else 
//         console.log(result);
// });

app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Running on PORT ${PORT}`);
});