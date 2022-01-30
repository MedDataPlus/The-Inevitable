const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const firebase = require('firebase');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//setting Public directory

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
// SET OUR VIEWS AND VIEW ENGINE

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', require('./routes/getreq'));
app.use('/', require('./routes/blockchain'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    
    res.render('index')
})

// let yourDate = new Date()
// console.log(yourDate.toISOString().split('T')[0]);

app.get('/login',(req,res)=>{    
    res.render('login')
})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get('/addreport',(req,res)=>{
    data1=''
    res.render('addreport',{data:data1})
}) 

app.get('/Doctordetail',(req,res)=>{
    res.render('Doctdetail')
})

app.get('/reset',(req,res)=>{
    res.render('reset')
})
app.get('/Addpatient',(req,res)=>{
    res.render('Addpatient')
})


app.get('/pdfreport',(req,res)=>{
    res.render('pdfreport')
})


//logout using firebase
app.get('/logout',(req,res)=>{
    firebase.auth().signOut().then(()=>{
        res.redirect('/login')
    }).catch((error)=>{
        res.send(error.message)
    })
});

const port = process.env.PORT || 4001
app.listen(port, () => console.log("Server is Running...",port));