import "@/app";
import "@/jobs/cron/posts-algorithm.job";
import { server } from "@/ws/socket";

const PORT = Number(process.env.API_PORT) || 4000;

server.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
