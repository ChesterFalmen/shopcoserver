const nodemailer = require("nodemailer");
const config = require("../config");
const enb = config.GMAIL_CONNECTION_STRING;
const passGmail = enb.match(/.{1,4}/g).join(' ');
const mass = passGmail;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'serhiibondarenko33@gmail.com',
        // user: 'shopcoshopping@gmail.com',
        pass: mass
    },
    secure: false,
    pool: true,
    maxConnections: 5,
    maxMessages: 100
});

const sendMail = async (mailOptions) => {
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info.response;
    } catch (error) {
        console.log("sendMail error", error);
        throw error;
    }
};

const sendAddNewsletter = async (email) =>{
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        // from: 'shopcoshopping@gmail.com',
        to: email,
        subject: "Thank you for subscribing to the store ShopCo",
        text:"Now you will receive notifications about new products and special offers."
    };
    return await sendMail(mailOptions);
}

const sendMailServiceMassage = async (recipient, order) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        // from: 'shopcoshopping@gmail.com',
        to: recipient,
        subject: "Your order has been accepted ShopCo",
        text: `Your order has been processed. You can view the details in your personal account. Order# ${order}`
    };
    return await sendMail(mailOptions);
};

const sendMailServiceMassageSupport = async (recipient, idMessage) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        // from: 'shopcoshopping@gmail.com',
        to: recipient,
        subject: "support service ShopCo",
        text: `Your appeal is registered under the number# ${idMessage}. Wait for our operator to contact you soon`
    };
    return await sendMail(mailOptions);
};

const sendMailServiceLink = async (recipient, link) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        // from: 'shopcoshopping@gmail.com',
        to: recipient,
        subject: "Activate profile ShopCo",
        html: `<div>
                <h1>Для активації натисніть</h1>
                <a href="${link}">${link}</a>
            </div>`
    };
    return await sendMail(mailOptions);
};

const sendMailResetPassword = async (recipient, link, password) => {
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        // from: 'shopcoshopping@gmail.com',
        to: recipient,
        subject: "Support ShopCo",
        html: `<div>
                <h1>Your new one-time password :${password}</h1>
                <h3>To activate, follow the link. Be sure to change the password in your personal account.</h3>
                <a href="${link}">${link}</a>
            </div>`
    };
    return await sendMail(mailOptions);
};


const sendErr = async (email) =>{
    const mailOptions = {
        from: 'serhiibondarenko33@gmail.com',
        // from: 'shopcoshopping@gmail.com',
        to: email,
        subject: "Thank you for subscribing to the store ShopCo",
        text:"Now you will receive notifications about new products and special offers."
    };
    return await sendMail(mailOptions);
}


module.exports = {
    sendMailServiceMassage,
    sendMailServiceLink,
    sendMailServiceMassageSupport,
    sendMailResetPassword,
    sendAddNewsletter,
    sendErr
};