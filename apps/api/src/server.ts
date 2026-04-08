import "@/app";
import "@/jobs/cron/posts-algorithm.job";
import { server } from "@/ws/socket";

server.listen(process.env.API_PORT!, () => {
  console.log(`Backend running at http://localhost:${process.env.API_PORT!}`);
});
