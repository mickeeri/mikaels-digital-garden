import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getPosts().map((post) => {
      return db.post.create({ data: post });
    })
  );
}

seed();

function getPosts() {
  return [...Array(10).keys()].map(() => ({
    name: faker.lorem.sentence(2),
    content: faker.lorem.paragraph(),
  }));
}
