import type { RequestHandler } from "express";

import { AbstractController } from "@/common/contracts";
import { HttpStatus } from "@/common/enums";
import {
  authMiddleware,
  getAuthenticatedUserId,
  validationMiddleware,
} from "@/middlewares";
import { registerPath } from "@/services/openapi/registry";

import {
  type InterviewFinalizeInput,
  type InterviewStartInput,
  interviewFinalizeParamsSchema,
  interviewFinalizeSchema,
  interviewLinkChatSchema,
  interviewStartSchema,
} from "./interview.schema";
import { InterviewService } from "./interview.service";

export class InterviewController extends AbstractController<InterviewService> {
  public override path = "interview";

  protected _registerRoutes() {
    this._registerOpenAPI();

    this._router.use(authMiddleware);

    this._router.post(
      "/start",
      validationMiddleware({ body: interviewStartSchema }),
      this._start,
    );

    this._router.post(
      "/:id/finalize",
      validationMiddleware({
        params: interviewFinalizeParamsSchema,
        body: interviewFinalizeSchema,
      }),
      this._finalize,
    );

    this._router.post(
      "/:id/link-chat",
      validationMiddleware({
        params: interviewFinalizeParamsSchema,
        body: interviewLinkChatSchema,
      }),
      this._linkChat,
    );
    this._router.get(
      "/:id/progress",
      validationMiddleware({ params: interviewFinalizeParamsSchema }),
      this._getProgress,
    );
  }

  private _registerOpenAPI() {
    registerPath({
      tags: ["Interview"],
      method: "post",
      path: "/api/interview/start",
      summary: "Start a new AI interview session",
      bodySchema: interviewStartSchema,
      statusCode: HttpStatus.CREATED,
      responseDescription: "Interview created with Hume access token",
    });

    registerPath({
      tags: ["Interview"],
      method: "post",
      path: "/api/interview/{id}/finalize",
      summary: "Finalize an interview session with Hume chat data",
      paramsSchema: interviewFinalizeParamsSchema,
      bodySchema: interviewFinalizeSchema,
      statusCode: HttpStatus.OK,
      responseDescription: "Interview finalized with feedback",
    });
  }

  private _start: RequestHandler<unknown, unknown, InterviewStartInput> =
    async (req, res) => {
      const result = await this._service.start(
        getAuthenticatedUserId(req),
        req.body,
      );
      res.created(result);
    };

  private _finalize: RequestHandler<
    { id: string },
    unknown,
    InterviewFinalizeInput
  > = async (req, res) => {
    const result = await this._service.finalize(
      req.params.id,
      getAuthenticatedUserId(req),
      req.body,
    );
    res.ok(result);
  };

  private _linkChat: RequestHandler<
    { id: string },
    unknown,
    InterviewFinalizeInput
  > = async (req, res) => {
    const { chatId, chatGroupId } = req.body;
    await this._service.linkChat(
      req.params.id,
      getAuthenticatedUserId(req),
      chatId,
      chatGroupId,
    );
    res.ok({ success: true });
  };

  private _getProgress: RequestHandler<{ id: string }> = async (req, res) => {
    const interview = await this._service.getProgress(
      req.params.id,
      getAuthenticatedUserId(req),
    );
    res.ok(interview);
  };
}
