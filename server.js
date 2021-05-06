const express = require('express');
const db = require('./db/connection.js');
const apiRoutes = require('./routes/apiRoutes/index.js');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api', apiRoutes);


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