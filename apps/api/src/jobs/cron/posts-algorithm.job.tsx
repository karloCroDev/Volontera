import cron from "node-cron";

cron.schedule("* */1 * * *", async () => {
  // Here you can call the functions that implement your posts algorithm logic
  console.log("Running posts algorithm job every hour");
  // Example: await updatePostsAlgorithm()
});

// Iz dokumentacije node-crona što znači koji izraz
//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *
