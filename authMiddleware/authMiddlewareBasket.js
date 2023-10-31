const jwt = require('jsonwebtoken');
const {secret} = require("../userConfig")
const { client } = require("../db");
const {ObjectId} = require("mongodb");

const usersDB = client.db('shopco').collection('users');

const authMiddlewareBasket =async (req, res, next) =>{
    const token = req.headers.authorization;
    const {userName, email, apartmentInfo, city, companyName, phoneNumber, streetAddress } = req.body.personalInfo;

    if (token) {
        try {
            const decodeData = jwt.verify(token, secret);
            const userId = new ObjectId(decodeData.id);
            const user = await usersDB.findOne({ _id: userId });
            if (user) {
                await usersDB.updateOne(
                                { _id: userId },
                                {
                                    $set: {
                                        email:email,
                                        userName:userName,
                                        companyName: companyName,
                                        apartmentInfo: apartmentInfo,
                                        streetAddress: streetAddress,
                                        city: city,
                                        phoneNumber: phoneNumber,
                                    }
                                }
                            );
                req.user = decodeData.id;
                next();
            }
        } catch (error) {
            res.send({
                status: 407,
                "user auth": false
            });
        }
    }

    if(!token){
        try {
            const user = await usersDB.findOne({ email: email });
            if(user){
                const id =new ObjectId(user._id.toString())
                await usersDB.updateOne(
                    { _id: id },
                    {
                        $set: {
                            email:email,
                            userName:userName,
                            companyName: companyName,
                            apartmentInfo: apartmentInfo,
                            streetAddress: streetAddress,
                            city: city,
                            phoneNumber: phoneNumber,
                        }
                    }
                );

                req.user = user._id.toString();
                next();
            }else {
                const candidat = {
                    userName:userName,
                    email:email,
                    apartmentInfo:apartmentInfo,
                    city:city,
                    companyName:companyName,
                    phoneNumber:phoneNumber,
                    streetAddress:streetAddress
                }
                const {insertedId} = await usersDB.insertOne(candidat);
                req.user = insertedId.toString();
                next();
            }

        } catch (error) {
            res.send({
                status: 407,
                "user auth": false
            });
        }
    }


}
module.exports = authMiddlewareBasket