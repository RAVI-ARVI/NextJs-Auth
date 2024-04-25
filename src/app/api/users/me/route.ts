import { connect } from "@/dbconfig/dbconfig";
import { getDataFromToken } from "@/helper/getDatafromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
connect();

export async function POST(req: NextRequest) {
  //extract data from token
  const userId = await getDataFromToken(req);

  const user = await User.findById(userId).select("-password");

  // check theres is now user
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: "Unauthenticated User",
      },
      {
        status: 401,
      }
    );
  }

  return NextResponse.json({
    success: true,
    user,
  });
}
