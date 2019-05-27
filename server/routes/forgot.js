const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const db = require('./dbActions');
const nodemailer = require('nodemailer');
const bcrypt = require("bcrypt");
const saltRounds = 10;
let mailpass = process.env.MAILPASS;



const emailInfo = {
    user: "admin@freemilelog.com",
    pass: mailpass
}

let genCrypto = () => {
    return new Promise(res => {
        crypto.randomBytes(20, async (err, buff) => {
            let string = await buff.toString('hex')
            res(string);
        })
    })
}

let sendTokenEmail = (email, token) => {
    let smtpTransport = nodemailer.createTransport({
        host: "smtp.dreamhost.com",
        port: 587,
        secure: false,
        auth: {
            user: emailInfo.user,
            pass: emailInfo.pass
        }
    })
    let mailOptions = {
        from: '"Admin-FreeMileLog" <admin@freemilelog.com>',
        to: email,
        subject: "Free Mile Log Password Reset",
        html: `<a href='https://freemilelog.com/passwordreset.html?${token}'>CLICK TO RESET PASSWORD</a>`
    };
    smtpTransport.sendMail(mailOptions)
}



router.post('/', async (req, res) => {
   genCrypto()
   .then(myCrypt => {
       db.dbActions.checkIfRegistered(req.body.email)
       .then(user => {
           
           if(user.length === 0) res.send('User Doesnt Exist');
           else {
                let time = Date.now() + 3600000;
                db.dbActions.updateToken(req.body.email, myCrypt, time);
                sendTokenEmail(req.body.email, myCrypt)
                res.status(200).send("You will receive an email shortly...")
           } 
       })
   })
   

})

router.post('/reset', (req, res) => {
    let password = req.body.pass;
    let token = req.body.token;
    db.dbActions.getTokenExpiry(token)
    .then(rows => {
        let expireDate = rows[0].resetPasswordExpires;
        let now = Date.now();
        if(now > expireDate) res.status(500).send("Token Expired");
        else {
            bcrypt.hash(password, saltRounds, async (err, encStr) => {
                if (err) throw err;
                let hashedPass = encStr;
                let registerResponse = await db.dbActions.updatePassword(
                    hashedPass,
                    token
                );
                res.status(200).send(registerResponse);
                if(registerResponse.serverStatus === 34 || registerResponse.serverStatus === 32){
                    
                } else {
                    res.status(500);
                }
                
            });
        } 
    })


    
    
    
 

})


module.exports = router;