const express = require('express');
const router = new express.Router();
const FormModel = require('../model/model');
const bcrypt = require('bcryptjs');

// Routing
router.get('/', (req,res) =>{
    res.render("index");
});

router.get('/register', (req,res) =>{
    res.render("register");
});

router.post('/register', async(req,res) =>{
    try{
        const password = req.body.password;
        const confirm_password = req.body.confirmpassword;
        if(password === confirm_password){
            const registerForm = new FormModel({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                gender:req.body.gender,
                password:password,
                confirmpassword:confirm_password
            })
            //AuthToken Function
            const token = await registerForm.genrateAuthToken(); 

            //Collection data save
            const formDataSubmit = await registerForm.save();

            res.status(201).render("login");
        }
        else{
            res.send('Password are not matching');
        } 
    }
    catch(error){
        res.status(400).send(error);
    }
});

router.get('/login', (req,res) =>{
    res.render("login");
});

router.post('/login', async(req,res) =>{
    try{
        const enterEmail = req.body.email;
        const enterPassword = req.body.password;
        const userData = await FormModel.findOne({email:enterEmail});
        const user_email = await userData.email;
        const user_pass = await userData.password;
        const user_name = await userData.firstname;

        const encodedPasword = async(enterPassword) =>{
            try{
                const isMatch = await bcrypt.compare(enterPassword, user_pass);   
                return isMatch;
            }
            catch(error){
                res.status(404).end('Password not encoded');
            }
        }
       const final_match = await encodedPasword(enterPassword);
       console.log(final_match);
      
       //AuthToken Function
       const token = await userData.genrateAuthToken(); 
       console.log(`login_token : ${token}`);
         if(final_match){
            res.render('index',{
                 user_name:user_name,
             });
         }
         else{
             res.send(`Login details invaild`);
         }        
    }
    catch(errors){
        res.status(400).send(`Login details invaild`);
    }
});

module.exports = router;