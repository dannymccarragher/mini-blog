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
        console.log('Error connecting to the database: ' + err);
    }
}

app.use(express.urlencoded({ extended: false }));

app.use(express.static('public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { errors: {} });
});

app.post('/submit', async (req, res) => {
    const newPost = {
        author: req.body.author,
        title: req.body.title,
        content: req.body.content
    }

    let isValid = true;
    //use object instead of array for direct field association
    let errors = { author: null, title: null, content: null };

    if (newPost.author.trim() === "") {
        newPost.author = null;
    }

    if (newPost.title.trim() === "") {
        isValid = false;
        errors.title = "Title is required.";
    } else if (newPost.title.trim().length <= 5) {
        isValid = false;
        errors.title = "Title must contain more than 5 characters."; 
    }

    if (newPost.content.trim() === "") {
        isValid = false;
        errors.content = "Content is required.";
    }

    if (!isValid) {
        res.render('home', { newPost: newPost, errors: errors });
        return;
    }

    const conn = await connect();
    await conn.query(`
        INSERT INTO blog_posts (author, title, content)
        VALUES ('${newPost.author}', '${newPost.title}', '${newPost.content}');
    `);

    res.render('confirmation', { posts: newPost });
});

app.get('/entries', async (req, res) => {
    const conn = await connect();
    const posts = await conn.query('SELECT * FROM blog_posts');
    res.render('entries', { posts });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
