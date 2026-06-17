import { AbstractService } from "@/common/contracts";
import { logger } from "@/lib/logger";

import type { Sample } from "./sample.schema";

export class SampleService extends AbstractService {
  async create(sample: Sample) {
    logger.info({ sample }, "Creating sample");
  }
}
