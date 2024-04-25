import { connect } from "@/dbconfig/dbconfig";
import { sendEmail } from "@/helper/mailer";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password, username } = reqBody;
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const user = await User.findOne({ email: email });
    
    if (user) {
      return NextResponse.json(
        {
          error: "User Already Exists",
        },
        {
          status: 400,
        }
      );
    }

    const newUser = new User({
      email,
      username,
      password: hashpassword,
    });
    const savedUser = await newUser.save();

    ///send Email
    await sendEmail({
      email: savedUser.email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });

    return NextResponse.json({
      success: true,
      message: "User Registration Successfully ",
      savedUser,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
