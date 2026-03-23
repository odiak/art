import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("snow", "./routes/snow.tsx"),
  route("untitled1", "./routes/untitled1.tsx"),
] satisfies RouteConfig;
