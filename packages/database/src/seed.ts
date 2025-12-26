import { prisma } from "./client";
import { faker } from "@faker-js/faker";

async function main() {
  await prisma.user.createMany({
    data: [...Array(10)].map((_, i) => ({
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(), // Hash this if I am going to use those user for authentication
      role: i % 2 === 0 ? "ORGANIZATION" : "USER",
      onboardingFinished: true,
    })),
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
