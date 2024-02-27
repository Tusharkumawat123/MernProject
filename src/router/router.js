const express = require('express');
const cookieParser = require('cookie-parser');
const router = new express.Router();
const FormModel = require('../model/model');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');



// Routing Index page
router.get('/', (req,res) =>{
    res.render("index");
});

//Secret Page
router.get('/secret', auth, (req,res) =>{
    res.render("secret",{
        auth:req.user.firstname
    });
});

// Logout Page
router.get('/logout', auth, async(req, res)=>{
    try{

        // For single user logout
        // req.user.tokens = req.user.tokens.filter((currentEl) =>{
        //     return currentEl.token !== req.authToken;
        // });

        // For all user logout
        req.user.tokens = [];

        res.clearCookie('jwt_login');
        await req.user.save();
        res.render('login');
        
    }catch(err){
        res.status(500).send(err);
    }
})

// Register Get Request page
router.get('/register', (req,res) =>{
    res.render("register");
});

// Register Post req Page
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
            console.log(token);

            // Set Cookies
            res.cookie('jwt_register', token);

            // Get Cookies
            const registerToken = req.cookies.jwt_register;
            console.log(`register_token : ${registerToken}`);
           
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

// Login Page
router.get('/login', (req,res) =>{
    res.render("login");
});

// Login Post req Page
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

       //Set Cookies
       res.cookie('jwt_login', token);

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