import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export function formatDate(dateString: string): string {
  const date = new Date(dateString.replace(" ", "T")); 

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}


export async function createToken(payload: JwtPayload) {
  const token = await new SignJWT(payload)
  .setProtectedHeader({ alg: "HS256" })
  .setExpirationTime('7d')
  .sign(secret)
  return token
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as JwtPayload;  
  } catch {
    return null;
  }
}
