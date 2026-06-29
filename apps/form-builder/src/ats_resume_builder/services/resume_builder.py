import logging
import time

from ats_resume_builder.compiler.pdf_compiler import PDFCompiler
from ats_resume_builder.graph.workflow import ResumeOptimizationWorkflow
from ats_resume_builder.renderer.latex_renderer import LatexResumeRenderer
from ats_resume_builder.schemas.resume import ResumeBuildRequest


class ResumeBuilderService:
    def __init__(
        self,
        workflow: ResumeOptimizationWorkflow,
        renderer: LatexResumeRenderer,
        compiler: PDFCompiler,
    ) -> None:
        self._workflow = workflow
        self._renderer = renderer
        self._compiler = compiler
        self._logger = logging.getLogger(__name__)

    async def build_pdf(self, request: ResumeBuildRequest, *, request_id: str) -> bytes:
        started = time.perf_counter()
        optimized_resume, retry_count = await self._workflow.optimize(
            request.resume,
            request_id=request_id,
        )
        latex = self._renderer.render(optimized_resume)
        compile_started = time.perf_counter()
        pdf = await self._compiler.compile(latex, request_id=request_id)
        self._logger.info(
            "resume_pdf_generated",
            extra={
                "request_id": request_id,
                "resume_id": request.resume_id,
                "retry_count": retry_count,
                "duration_ms": round((time.perf_counter() - started) * 1000, 2),
                "compilation_duration_ms": round((time.perf_counter() - compile_started) * 1000, 2),
            },
        )
        return pdf
