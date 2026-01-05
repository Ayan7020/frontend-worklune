import Jwt from "jsonwebtoken";

export const createToken = (userId: string) => {
  const token = Jwt.sign(
    { userId },
    "bd282eabaf2311b6167d11b5d962c9078b07917803218ee215dd711ea04a5cc2"
  );

  return token;
}