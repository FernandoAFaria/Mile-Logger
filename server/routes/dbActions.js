const db = require("./db");
const express = require("express");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const router = express.Router();

const isLoggedIn =  (email, password) => {
    return new Promise(async res => {
        const user = await dbActions.checkIfRegistered(email);

        if (user.length === 0) {
            res(false);
        } else {
            let hash = user[0].password;
            bcrypt.compare(password, hash, (err, bool) => {
                if (err) throw err;
                if (bool) {
                    res(true);
                } else {
                    res(false);
                }
            });
        }
    });
};

router.use(function(req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

router.post("/login", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //check if user exists
    const user = await dbActions.checkIfRegistered(email);

    if (user.length > 0) {
        //check password
        let hash = user[0].password;
        bcrypt.compare(password, hash, async (err, bool) => {
            if (err) throw err;
            if (bool) {
                let data = await dbActions.getInitialDataFile(email);
                res.send(data[0].data);
            } else {
                res.status(403).send("Incorrect Password");
            }
        });
    } else if (user.length === 0) {
        res.status(403).send("User Doesn't Exist");
    }
});

router.post("/register", async (req, res) => {
    
    let email = req.body.email;
    let password = req.body.password;
    let alreadyRegistered = await dbActions.checkIfRegistered(email);
    if (alreadyRegistered.length > 0) {
        res.status(400).send("That email is already registered.");
    } else {
        
        bcrypt.hash(password, saltRounds, async (err, encStr) => {
            if (err) throw err;
            let hashedPass = encStr;
            let registerResponse = await dbActions.registerUser(
                email,
                hashedPass
            );
            
            res.status(200).send(registerResponse);
        });
    }
});

router.post("/update", async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let data = req.body.data;
    let stringData = JSON.stringify(data);
    let loggedIn = await isLoggedIn(email, password);
    
    if (loggedIn) {

        let updateResp = await dbActions.updateDataFile(email, stringData);

        res.status(200).send(updateResp);
    } else {
        res.status(403).send("Your not logged in.");
    }
});

//database actions

const dbActions = {
    queryPool: async function(query) {
        return new Promise((response, rej) => {
            db.pool.getConnection((err, connection) => {
                if (err) throw err;
                connection.query(query, (err, res) => {
                    if (err) rej(err);
                    let data = res;
                    connection.release();
                    response(data);
                });
            });
        });
    },

    checkIfRegistered: async function(email) {
        let sql =
            "select email, password from users where email=" +
            db.pool.escape(email);
        let myJson = await dbActions.queryPool(sql);
        return myJson;
    },
    updateToken: async function(email, token, date) {
        let sql =
            "UPDATE users SET resetPasswordToken= " + db.pool.escape(token) +
            ", resetPasswordExpires=" + db.pool.escape(date) +
            " WHERE email=" + db.pool.escape(email);
            let myJson = await dbActions.queryPool(sql);
            return myJson;
    },
    getTokenExpiry: async function(token) {
        let sql =
            "select resetPasswordExpires from users where resetPasswordToken=" + db.pool.escape(token);
            let myJson = await dbActions.queryPool(sql);
            return myJson;
    },
    updatePassword: async function(password, token) {
        let sql =
            "UPDATE users SET password= " + db.pool.escape(password) +
            
            " WHERE resetPasswordToken=" + db.pool.escape(token);
            let myJson = await dbActions.queryPool(sql);
            return myJson;
    },


    getInitialDataFile: async function(email) {
        let sql = "select data from users where email=" + db.pool.escape(email);
        let myJson = await dbActions.queryPool(sql);
        return myJson;
    },
    registerUser: async function(email, password) {
        let sql =
            "INSERT INTO users(email, password) VALUES(" +
            db.pool.escape(email) +
            "," +
            db.pool.escape(password) +
            ");";
        let myJson = await dbActions.queryPool(sql);
        return myJson;
    },
    updateDataFile: async function(email, data) {
        let sql =
            "UPDATE users SET data=" +
            db.pool.escape(data) +
            "WHERE email=" +
            db.pool.escape(email);
        let myJson = await dbActions.queryPool(sql);
        return myJson;
    }
};

module.exports = {
    router,
    dbActions
};
