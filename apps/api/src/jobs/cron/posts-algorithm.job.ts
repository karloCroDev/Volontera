// External packages
import { prisma } from "@repo/database";
import cron from "node-cron";

export const postAlgorithmJob = cron.schedule("*/10 * * * *", async () => {
  console.log("Running posts algorithm job every hour");
});

// Iz dokumentacije node-crona što znači koji izraz (*)

//  # ┌────────────── second (optional)
//  # │ ┌──────────── minute
//  # │ │ ┌────────── hour
//  # │ │ │ ┌──────── day of month
//  # │ │ │ │ ┌────── month
//  # │ │ │ │ │ ┌──── day of week
//  # │ │ │ │ │ │
//  # │ │ │ │ │ │
//  # * * * * * *
