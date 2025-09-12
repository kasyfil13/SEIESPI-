const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'nauranisa1204@gmail.com', //email
        pass: 'voah lbfz tbuj aasa' //pass -> kalau mau coba pake gamil harus verif 2 langkah dlu yaa
    }
});

const sendEmail = async ({ to, subject, text, html }) => {
    try {
        const info = await transporter.sendMail({
            from: 'nauranisa1204@gmail.com',
            to,
            subject,
            text,   
            html    
        });
        console.log('Email terkirim ke', to, 'Response:', info.response);
        return info; 
    } catch (err) {
        console.error('Gagal kirim email:', err);
        throw err;
    }
};


module.exports = sendEmail;
