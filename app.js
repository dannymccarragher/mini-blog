// importing express
const express = require('express');

//instantiating express
const app = express();

const PORT = 3000;

app.use(express.urlencoded({extended: false}));

app.use(express.static('public'));

app.set('view engine' , 'ejs');

const posts = [];

app.get('/', (req,res) => {
    res.render('home');
});

app.post('/submit', (req,res) =>{
    const newPost =  { 
        author :req.body.author,
        title : req.body.title,
        content : req.body.content
    };
    posts.push(newPost);
    res.render('confirmation', { posts : newPost});
});

app.get('/entries', (req, res)=> {
    res.render('entries', {posts : posts})
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});