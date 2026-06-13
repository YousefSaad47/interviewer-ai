import type { AbstractController, AbstractService } from "./contracts";

export type Controller = Pick<
  AbstractController<AbstractService>,
  "path" | "router"
>;
