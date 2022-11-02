import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";
const db = new PrismaClient();

async function seed() {
  const user = await db.user.create({
    data: {
      username: "mikael",
      // this is a hashed version of "twixrox"
      passwordHash:
        "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  });

  await Promise.all(
    getPosts().map((post) => {
      const data = { posterId: user.id, ...post };
      return db.post.create({ data });
    })
  );
}

seed();

function getPosts() {
  return [...Array(10).keys()].map(() => ({
    name: faker.lorem.words(),
    content: faker.lorem.paragraph(),
  }));
}
