import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "./core";
import { NextRequest } from "next/server";

const handler = createRouteHandler({ router: ourFileRouter });

export async function GET(req: NextRequest) {
  return handler(req as Request);
}

export async function POST(req: NextRequest) {
  return handler(req as Request);
}
