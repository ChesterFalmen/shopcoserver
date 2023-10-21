const nodemailer = require("nodemailer");
const config = require("../config")


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'serhiibondarenko33@gmail.com',
        pass: config.GMAIL_CONNECTION_STRING
    }

});



const sendMailServiceMassage = (recipient, order) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        to: recipient,
        subject: "Your order has been accepted ShopCo",
        text: `Your order has been processed. You can view the details in your personal account. Order# ${order}`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log(info);
            console.log('Email sent: ' + info.response);
        }
    });

}

const sendMailServiceMassageSupport = (recipient, idMessage) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        to: recipient,
        subject: "support service ShopCo",
        text: `Your appeal is registered under the number# ${idMessage}.
         Wait for our operator to contact you soon`
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log(info);
            console.log('Email sent: ' + info.response);
        }
    });

}

const sendMailServiceLink = (recipient, link) => {
    console.log("recipient",recipient);
    console.log("link",link);
    const mailOptions = {

        from: 'serhiibondarenko33@gmail.com',
        to: recipient,
        subject: "Activite profile ShopCo" ,
        html: ` <div>
                    <h1>Для активації натисніть</h1>
                    <a href="${link}">${link}</a>
                </div>`
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log("sendMail error",error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}


module.exports = {
    sendMailServiceMassage,
    sendMailServiceLink,
    sendMailServiceMassageSupport
}

