import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  const hashToken = await bcrypt.hash(userId, 10);
  try {
    if (emailType == "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType == "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    // const transporter = nodemailer.createTransport({
    //   host: "smtp.ethereal.email",
    //   port: 587,
    //   secure: false, // Use `true` for port 465, `false` for all other ports
    //   auth: {
    //     user: "maddison53@ethereal.email",
    //     pass: "jn7jnAPss4f63QBp6D",
    //   },
    // });
    var transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "12e43784e55de4",
        pass: "7d0cc6679f6db8",
      },
    });
    let hashedToken = "";
    const emailOptions = {
      from: "ravisankar@campx.in", // sender address
      to: email, // list of receivers
      subject:
        emailType === "VERIFY" ? "Verify your Email" : "Reset Your Password", // Subject line
      //   text: "Hello world?", // plain text body
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }
      or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${hashedToken}
      </p>`, // html body
    };
    const mailResponse = await transport.sendMail(emailOptions);
  } catch (error) {}
};
