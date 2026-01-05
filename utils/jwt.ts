import { SignJWT } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET!
);

export async function createToken(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
}
