const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const mailer = require('../../modules/mailer')
const authConfig = require('../../config/auth.json')

const User = require('../../app/models/User');

const router = express.Router();

function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret, {expiresIn:86400})
}

router.post('/register', async (req,res)=>{
    const { email } = req.body;
    try{
        if( await User.findOne({ email }))
            return res.status(400).send({error: 'User already exists'});

        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({user,
            token: generateToken({ id: user._id })
            });

    }catch(err){

        return res.status(400).send('Registration Failed');

    }

});

router.post('/authenticate', async (req,res)=>{
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password')

    if(!user)
        return res.status(400).send({error: "User not found"});
    
    if(!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: "Invalid Password"});

    user.password = undefined;

    res.send({ user,
        token: generateToken({ id: user._id })
    });
});

router.post('/forgot-password', async (req, res)=>{
    const { email } = req.body

    try{
        const user = await User.findOne({ email }).select('+password')
        if(!user)
            return res.status(400).send({error: 'User not found'})

        const token = crypto.randomBytes(20).toString('hex')
        const expire = new Date()
        expire.setHours(expire.getHours()+1)

        await User.findByIdAndUpdate(user._id,{
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: expire
            }
        })
        
        mailer.sendMail({
            to: email,
            from: 'Jean Jr <ed11d38f059068>',
            subject: 'Email de recuperação de senha',
            text: 'Token de autenticação: '+token
        }), (err) => {
            if(err) return res.status(400).send({erro:err})
        }

        return res.send()

    }catch(err){
        console.log(err)
        res.status(400).send({error: 'Erron on forgot password, try again'})
    }
});

router.post('/reset-password', async (req,res)=>{
    try {const { email, password, token } = req.body;

    const user = await User.findOne({ email })
        .select('+ passwordResetToken passwordResetExpires')

    if(!user)
        return res.status(400).send({error: 'User not found'});
    
    if(token !== user.passwordResetToken)
        return res.status(400).send({error: 'Invalid Token'});

    var now = new Date()

    if(now > user.passwordResetExpires)
        return res.status(400).send({error: 'Expired Token'});
    
    user.password = password

    await user.save()

    res.send()
    } catch(err){
        return res.status(400).send({error: 'Cannot reset password, try again'});
    }
})

module.exports = app => app.use('/auth', router);