const nodemailer = require("nodemailer");
const config = require("../config")


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'serhiibondarenko33@gmail.com',
        pass: config.GMAIL_CONNECTION_STRING
    }

});



const sendMailServiceMassage = (recipient, topic, bodyMassage) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        to: recipient,
        subject: topic,
        text: bodyMassage
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

const sendMailServiceLink = (recipient, link) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        to: recipient,
        subject: "Activite profile" ,
        html: ` <div>
                    <h1>Для активації натисніть</h1>
                    <a href="${link}">${link}</a>
                </div>`
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}


module.exports = {
    sendMailServiceMassage,
    sendMailServiceLink
}