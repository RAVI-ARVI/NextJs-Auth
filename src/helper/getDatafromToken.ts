import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export const getDataFromToken = async (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decodedData: any = jwt.verify(token, process.env.TOKEN_SECRET!);

    return decodedData.id;
  } catch (error: any) {
    new Error(error.message);
  }
};
