const Forgotpassword = require('../models/password');
const User = require('../models/userDetails');
const Sib = require('sib-api-v3-sdk');
const {v4:uuidv4} = require('uuid');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey =process.env.SENDINBLUE_API_KEY;
const bcrypt = require('bcrypt');
const uuid = uuidv4();
const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.forgotPassword = async(req,res,next) => {
    try {
        const email = req.body.email;
        console.log(req.body);
        const user = await User.findOne({where:{email: email }});
        if(!user) {
            return res.status(404).json({message:'Could Not Find User'});
        }
        // if(user[0].email==email){
            
        // }
        await user.createForgotpassword({ id: uuid , userId: user.id, active: true });
            
        // const client = Sib.ApiClient.instance;
        // const apiKey = client.authentications['api-key'];
        // apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

        const sender = {
            email: process.env.EMAIL,
        }

        const receivers = [
            {
                email: email
            }
        ]

        const transactionalEmailApi = new Sib.TransactionalEmailsApi();

        await transactionalEmailApi
        .sendTransacEmail({
            subject: 'Please reset your password via this link',
                sender,
                to: receivers,
                htmlContent: `
                    <a href="http:3000/localhost/password/resetpassword/${uuid}">Reset password</a>
                `
        })
        res.status(200).json({message:'Reset Password link has been sent to your E-mail'});
    }
    catch (error) {
        console.log(error);
        res.status(500).json({message: error, sucess: false});
    }
}

exports.resetPassword = async(req,res,next) => {
    try {
        const id = req.params.id;
        Forgotpassword.findOne({ where : { id }}).then(async (forgotpasswordrequest) => {
            if(forgotpasswordrequest){
                if(forgotpasswordrequest.active === true) {
                    await forgotpasswordrequest.update({ active: false});
                    res.status(200).send(`<html>
                                            <script>
                                                function formsubmitted(e){
                                                    e.preventDefault();
                                                    console.log('called')
                                                }
                                            </script>
                                            <form action="http:3000/localhost/password/updatepassword/${id}" method="get">
                                                <label for="newpassword">Enter New password</label>
                                                <input name="newpassword" type="password" required></input>
                                                <button>reset password</button>
                                            </form>
                                        </html>`
                                        )
                    res.end();
                }
                else {
                    throw new Error('Request has expired');
                }
            }
            else {
                throw new Error('Request Not Found');
            }
        })
    }
    catch(error) {
        console.log(error);
    }
}

exports.updatePassword = (req,res,next) => {
    try {
        const { newpassword } = req.query;
        const  resetpasswordid  = req.params.id;
        Forgotpassword.findOne({ where : { id: resetpasswordid }}).then(resetpasswordrequest => {

            User.findOne({where: { id : resetpasswordrequest.userId}}).then(user => {
                // console.log('userDetails', user)
                if(user) {
                    //encrypt the password

                    const saltRounds = 10;
                    bcrypt.genSalt(saltRounds, function(err, salt) {
                        if(err){
                            console.log(err);
                            throw new Error(err);
                        }
                        bcrypt.hash(newpassword, salt, function(err, hash) {
                            // Store hash in your password DB.
                            if(err){
                                console.log(err);
                                throw new Error(err);
                            }
                            user.update({ password: hash }).then(() => {
                                res.status(201).json({message: 'Successfuly updated the new password'})
                            })
                        });
                    });
                } else{
                    return res.status(404).json({ error: 'No user Exists', success: false})
                }
            })
        })
    }
    catch(error){
        return res.status(403).json({ error, success: false } )
    }
}
