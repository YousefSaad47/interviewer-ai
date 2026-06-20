import { ControllersFactory } from "@/common";
import { Controllers } from "@/common/enums";

for (const controller of Object.values(Controllers).filter(
  (v): v is Controllers => typeof v === "number",
)) {
  ControllersFactory.create(controller);
}
