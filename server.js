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

app.get('/api/candidate', (req, res) => {
    const sql = `SELECT * FROM candidates`;
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
    const sql = `SELECT * FROM candidates WHERE id = ?`;
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
    
})

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