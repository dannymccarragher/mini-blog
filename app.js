// importing express
const express = require('express');

//instantiating express
const app = express();

const mariadb = require('mariadb');

const PORT = 3000;

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Gohabsgo1',
    database: 'blog'
});

async function connect() {
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database: ' + err)
    }
}


app.use(express.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine' , 'ejs');


app.get('/', (req,res) => {
    res.render('home');
});

app.post('/submit', async (req,res) =>{
    const newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content
    }

    let isValid = true;
    let errors = [];

    if (newPost.author.trim() === ""){
        isValid = false;
        errors.push("Author is required")
    }

    if (data.title.trim() === ""){
        isValid = false;
        errors.push("Title is required")
    }

    if (data.content.trim() === ""){
        isValid = false;
        errors.push("Content is required")
    }

    if (!isValid){
        res.render('home', {newPost: newPost, errors : errors});
        return;
    }
    const conn = await connect();
    conn.query(`
        INSERT INTO posts (author, title, content)
        VALUES ('${newPost.author}', '${newPost.title}', '${newPost.content}');
    `);

    res.render('confirmation', { posts : newPost});
});

app.get('/entries', (req, res)=> {
    res.render('entries', {posts : posts})
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});