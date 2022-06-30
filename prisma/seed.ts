import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await db.user.create({
    data: {
      email: "rien.coertjens@gmail.com",
      name: "Rien Coertjens",
      password: "secret",
    },
  });
}

seed();
