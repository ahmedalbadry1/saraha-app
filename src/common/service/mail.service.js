import nodemailer from "nodemailer";
import conf from "../../config/config.service.js"

const transporter= nodemailer.createTransport({
    service:"gmail",
    host:"smtp.gmail.com",
    port:587,
    auth:{
        user:"a.h.m.m.albadry@gmail.com",
        pass:conf.GMAIL_PASS
    }
})

export const sendEmail=async({to,subject,html})=>{
    
    await transporter.sendMail({
   
    from:'"saraha app" <a.h.m.m.albadry@gmail.com>' ,
   
    to: to,
    subject:subject,
    html:html
})
}
