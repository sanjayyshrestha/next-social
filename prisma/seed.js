// import { prisma } from "../lib/prisma.js";

// async function main() {
//   const users = [
//     {
//       clerkId: "clerk_001",
//       email: "alice@example.com",
//       username: "alice123",
//       name: "Alice Johnson",
//       bio: "Loves building web apps.",
//       image: "https://i.pravatar.cc/150?img=1",
//       location: "New York",
//       website: "https://alice.dev",
//     },
//     {
//       clerkId: "clerk_002",
//       email: "bob@example.com",
//       username: "bob_the_builder",
//       name: "Bob Smith",
//       bio: "Frontend enthusiast.",
//       image: "https://i.pravatar.cc/150?img=2",
//       location: "Los Angeles",
//       website: "https://bob.dev",
//     },
//     {
//       clerkId: "clerk_003",
//       email: "carol@example.com",
//       username: "carol_codes",
//       name: "Carol Davis",
//       bio: "Fullstack developer.",
//       image: "https://i.pravatar.cc/150?img=3",
//       location: "London",
//       website: "https://carol.dev",
//     },
//     {
//       clerkId: "clerk_004",
//       email: "dave@example.com",
//       username: "dave_dev",
//       name: "Dave Wilson",
//       bio: "Backend and API geek.",
//       image: "https://i.pravatar.cc/150?img=4",
//       location: "Berlin",
//       website: "https://dave.dev",
//     },
//     {
//       clerkId: "clerk_005",
//       email: "eve@example.com",
//       username: "eve_codes",
//       name: "Eve Thompson",
//       bio: "Passionate about open source.",
//       image: "https://i.pravatar.cc/150?img=5",
//       location: "Tokyo",
//       website: "https://eve.dev",
//     },
//   ];

//   for (const user of users) {
//     await prisma.user.upsert({
//       where: { clerkId: user.clerkId },
//       update: {},
//       create: user,
//     });
//   }

//   console.log("✅ 5 users seeded successfully!");
// }

// main()
//   .catch((e) => console.error(e))
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
