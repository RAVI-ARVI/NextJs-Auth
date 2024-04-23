import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { email, password } = reqBody;

    const user = await User.findOne({ email: email });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return NextResponse.json(
        {
          error: "Unable to login with this credentials",
        },
        {
          status: 403,
        }
      );
    }

    const tokenPayload = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const jwtToken = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      sucess: true,
      message: "User logged in successfully",
    });
    response.cookies.set("token", jwtToken, {
      httpOnly: true,
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
