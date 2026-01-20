import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const gatewayTarget = env.VITE_GATEWAY_PROXY_TARGET || "http://localhost:8080";

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/auth": gatewayTarget,
        "/bus": gatewayTarget,
        "/driver": gatewayTarget,
        "/gps": gatewayTarget,
        "/ticketing": gatewayTarget,
        "/actuator": gatewayTarget,
      },
    },
  };
});
