// Config
import { server } from "@/config/socket";

server.listen(process.env.EXPRESS_PORT, () => {
  console.log(
    `Backend running at http://localhost:${process.env.EXPRESS_PORT}`
  );
});
