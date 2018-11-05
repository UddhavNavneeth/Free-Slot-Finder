const express = require('express');
const hbs = require('hbs');
const _ = require('lodash');

let {mongoose} = require('./db/mongoose');
let {Slotinfo} = require('./models/slotinfo');


let bodyParser = require('body-parser');

let app = express();
let port = 3000;

app.set('view engine', hbs);
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//rendering slot selection page
app.get('/', (req, res) => {
    res.render('main.hbs');
});


//saving the inputs from slot selection page
app.post('/saved', (req,res) => {

    name=req.body.name;
    group=req.body.group;
    slot1=req.body.slot1;
    slot2=req.body.slot2;
    slot3=req.body.slot3;
    slot4=req.body.slot4;
    slot5=req.body.slot5;
    slot6=req.body.slot6;

    //This is required as we want each slot to have a different number
    //for intersection purposes
    if (slot1 == 1) {
        slot1 = 1;
    }
    if (slot2 == 1) {
        slot2 = 2;
    }
    if (slot3 == 1) {
        slot3 = 3;
    }
    if (slot4 == 1) {
        slot4 = 4;
    }
    if (slot5 == 1) {
        slot5 = 5;
    }
    if (slot6 == 1) {
        slot6 = 6;
    }

    slotinfo = new Slotinfo({
        name: name,
        group: group,
        slot1: slot1,
        slot2: slot2,
        slot3: slot3,
        slot4: slot4,
        slot5: slot5,
        slot6: slot6
    });


    slotinfo.save().then((doc) => {
        res.status(200).render('2ndpage.hbs'); //rendering page from which we can choose
                                               //whether to add more data or check intersection
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/enterGroup', (req, res) => {
    res.render('enterGroup.hbs');    // this is the page where you enter which group's
                                     // free slots you wanna see
});

app.post('/freeSlot', (req, res) => {
    Slotinfo.find({
        group : req.body.group
    }).then((doc) => {
        
        let i;

        //This function is used to enter the object values
        //of each slot in an array
        //let us call these slot arrays
        function valueOfDocObj(obj) {
            let arr = new Array;
            if (obj.slot1 != undefined) {arr.push(obj.slot1);}
            if (obj.slot2 != undefined) {arr.push(obj.slot2);}
            if (obj.slot3 != undefined) {arr.push(obj.slot3);}
            if (obj.slot4 != undefined) {arr.push(obj.slot4);}
            if (obj.slot5 != undefined) {arr.push(obj.slot5);}
            if (obj.slot6 != undefined) {arr.push(obj.slot6);}
            return arr;
        };

        let copyOfDoc = new Array;

        //Pushing slot arrays of each document into a single nested array
        //This nested array copyOfDoc has slot array of each document
        for (i=0; i<doc.length; i++) {
            let docValue = valueOfDocObj(doc[i]);
            copyOfDoc.push(docValue);
        }    

        //Finding the intersection of the arrays in copyOfDoc
        intersection = copyOfDoc[0];
        for (i=1; i<copyOfDoc.length; i++) {
            intersection = _.intersection(intersection, copyOfDoc[i]);
        }
        

        res.status(200).send(intersection);

    }, (e) => {
        res.status(400).send(error);
    });
});


app.listen(3000);
console.log(`Server is up on port 3000`);
