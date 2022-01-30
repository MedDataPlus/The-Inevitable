const express = require('express');
const SHA256 = require('crypto-js/sha256');
const firebase = require('firebase');
const router = express.Router();
const path = require('path');
const { append } = require('vary');
checkuser()
async function checkuser() {
    var Auth = await firebase.auth();
}






//blockchain
class Block {
    constructor(timestamp, data, prevhash = '') {
        this.index = 0;
        this.timestamp = timestamp;
        this.data = data;
        this.prevhash = prevhash;
        this.hash = this.CalculateHash();
        this.noce = 0;
    }
    CalculateHash() {
        return SHA256(this.index + this.prevhash + this.timestamp + this.noce + JSON.stringify(this.data)).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.noce++;
            this.hash = this.CalculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [];
        this.difficulty = 4;
    }

    createBlock() {
        this.chain = [new Block(0, Date.now(), "Genisis", "0")];
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.prevhash = this.getLatestBlock().hash;
        newBlock.index = this.chain.length;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);


    }
    isChainvalid() {
        for (let i = 1; i < this.chain.length; i++) {
            const CurrentBlock = this.chain[i];
            const PrevioushHash = this.chain[i - 1];

            if (CurrentBlock.hash != CurrentBlock.CalculateHash()) {
                return false;
            }
            if (CurrentBlock.prevhash != PrevioushHash.hash) {
                return false;
            }
        }
        return true;
    }
    ittrate() {
        for (let i = 1; i < this.chain.length; i++) {
            console.log("Block" + i + " " + JSON.stringify(this.chain[i].data
            ))
        }
    }
}
// obj1.ittrate();

var chain = null;
const dbRef = firebase.database().ref();
var obj1 = null;

var starCountRef = firebase.database().ref('user');
starCountRef.on('value', (snapshot) => {
    dbRef.child("user").child("bc").get().then((snapshot) => {
        if (snapshot.exists()) {
            //console.log(snapshot.val());
            chain = snapshot.val();
            obj1 = new Blockchain();
            obj1.chain = chain
        } else {
            console.log("No data available");
            obj1 = new Blockchain();
            obj1.createBlock();
            firebase.database().ref('user').set({
                bc: obj1.chain
            });
        }
    }).catch((error) => {
        console.error(error);
    });
});
router.get('/patientreport',(req,res)=>{
    var table_data=[]
        //console.log(req.body);
        const dbRef = firebase.database().ref();
        var psuedodata=[];
        dbRef.child("user/Patients").child("vfiXblsHG6WopiVYxHi2qnLd0Mu2").get().then((snapshot) => {
            var hashno = snapshot.val().report;
            for(let i=0;i<hashno;i++)
            {
                psuedodata.push(snapshot.val()["hash" + i.toString()]);
            }
     
            for(let i in psuedodata){
                for(let j in obj1.chain){
                    if(obj1.chain[j].hash==psuedodata[i]){
                        console.log(obj1.chain[j])
                        var smallarray={}
                        smallarray.index=i
                        smallarray.name=obj1.chain[j].data.fullName
                        smallarray.timestamp=obj1.chain[j].timestamp
                        smallarray.type=obj1.chain[j].data.reportType
                        table_data.push(smallarray)
                    }
                }
            }   
            console.log(table_data[0])
            res.render('patientreport',{data:table_data})             
        }).catch((error) => {
            console.error(error);
        });
        // res.render('patientreport',{data:table_data})
   
})
router.post('/getotp',(req,res)=>{
    //console.log(req.body);
    const dbRef = firebase.database().ref();
    var clientuser;
    var mostViewedPosts = dbRef.child("user/Patients").orderByChild('email').equalTo(req.body.email);
    mostViewedPosts.get().then((snapshot) => {
        if (snapshot.exists()) {
            for (let x in snapshot.val()) {
                clientuser = x
            }
            // console.log("client user:  " + clientuser)
            var psuedodata=[];
            dbRef.child("user/Patients").child(clientuser).get().then((snapshot) => {
                var hashno = snapshot.val().report;
                for(let i=0;i<hashno;i++)
                {
                    psuedodata.push(snapshot.val()["hash" + i.toString()]);
                }
                var table_data=[]     
                for(let i in psuedodata){
                    for(let j in obj1.chain){
                        if(obj1.chain[j].hash==psuedodata[i]){
                            console.log(obj1.chain[j])
                            var smallarray={}
                            smallarray.index=i
                            smallarray.name=obj1.chain[j].data.fullName
                            smallarray.timestamp=obj1.chain[j].timestamp
                            smallarray.type=obj1.chain[j].data.reportType
                            table_data.push(smallarray)
                        }
                    }
                }   
                //console.log(table_data[0])
                res.render('addreport',{data:table_data})             
            }).catch((error) => {
                console.error(error);
            });


        } else {
            res.status(401).end('Patients not yet registered');
        }
    }).catch((error) => {
        console.error(error);
    });
})


router.get('/patientreport',(req,res)=>{
    var table_data=[]
        //console.log(req.body);
        const dbRef = firebase.database().ref();
        var psuedodata=[];
        dbRef.child("user/Patients").child("vfiXblsHG6WopiVYxHi2qnLd0Mu2").get().then((snapshot) => {
            var hashno = snapshot.val().report;
            for(let i=0;i<hashno;i++)
            {
                psuedodata.push(snapshot.val()["hash" + i.toString()]);
            }
     
            for(let i in psuedodata){
                for(let j in obj1.chain){
                    if(obj1.chain[j].hash==psuedodata[i]){
                        console.log(obj1.chain[j])
                        var smallarray={}
                        smallarray.index=i
                        smallarray.name=obj1.chain[j].data.fullName
                        smallarray.timestamp=obj1.chain[j].timestamp
                        smallarray.type=obj1.chain[j].data.reportType
                        table_data.push(smallarray)
                    }
                }
            }   
            console.log(table_data[0])
            res.render('patientreport',{data:table_data})             
        }).catch((error) => {
            console.error(error);
        });
        // res.render('patientreport',{data:table_data})
   
})

router.get('/appendreport', (req, res) => {
    console.log("Adding block");

    obj1.addBlock(new Block(Date.now(), res.body))
    firebase.database().ref("user/bc").set(
        obj1.chain
    );
});

router.post('/postreport', (req, res) => {
    //console.log(req.body);
    const dbRef = firebase.database().ref();
    var clientuser;
    var mostViewedPosts = dbRef.child("user/Patients").orderByChild('email').equalTo(req.body.email);
    mostViewedPosts.get().then((snapshot) => {
        if (snapshot.exists()) {
            for (let x in snapshot.val()) {
                clientuser = x
            }
            console.log("client user:  " + clientuser)
            console.log("Adding block");
            // console.log(req.body)
            var adder={};
            for (let x in req.body) {
                if (req.body[x] != "") {
                    adder[x]=req.body[x]
                    //console.log("val : " + adder[x])
                }
            }
            obj1.addBlock(new Block(Date.now(), adder))
            firebase.database().ref("user/bc").set(
                obj1.chain
            ).then(()=>{
                res.status(401).end('Data Added sucessfully')
            }).catch((error)=>{
                console.error(error);
            });
            var psuedodata;
            dbRef.child("user/Patients").child(clientuser).get().then((snapshot) => {
                psuedodata = snapshot.val();
                var hashno = psuedodata.report;
                psuedodata.report = hashno + 1;
                psuedodata["hash" + hashno.toString()] = obj1.getLatestBlock().hash;
                firebase.database().ref("user/Patients/" + clientuser).set(
                    psuedodata
                );
            }).catch((error) => {
                console.error(error);
            });


        } else {
            res.status(401).end('Patients not yet registered');
        }
    }).catch((error) => {
        console.error(error);
    });
})
console.log()
module.exports = router;
