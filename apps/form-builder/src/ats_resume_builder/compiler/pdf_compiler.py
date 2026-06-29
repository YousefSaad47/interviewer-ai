import asyncio
import shutil
import subprocess
from typing import cast

from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import CompilationError, PDFCompilationTimeoutError


class PDFCompiler:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def compile(self, latex: str, *, request_id: str) -> bytes:
        request_dir = self._settings.temporary_directory / request_id
        tex_path = request_dir / "resume.tex"
        pdf_path = request_dir / "resume.pdf"
        request_dir.mkdir(parents=True, exist_ok=True)

        try:
            tex_path.write_text(latex, encoding="utf-8")
            try:
                process = cast(
                    subprocess.CompletedProcess[bytes],
                    await asyncio.to_thread(
                        subprocess.run,
                        [
                            self._settings.compiler_path,
                            "-interaction=nonstopmode",
                            "-halt-on-error",
                            "resume.tex",
                        ],
                        cwd=request_dir,
                        capture_output=True,
                        check=False,
                        timeout=self._settings.compiler_timeout_seconds,
                    ),
                )
            except subprocess.TimeoutExpired as exc:
                msg = "PDF compilation timed out"
                raise PDFCompilationTimeoutError(
                    msg, details={"request_id": request_id}
                ) from exc
            except FileNotFoundError as exc:
                msg = "PDF compiler executable was not found"
                raise CompilationError(
                    msg,
                    details={
                        "compiler_path": self._settings.compiler_path,
                        "hint": "Install XeLaTeX or set ATS_COMPILER_PATH to the executable path.",
                    },
                ) from exc

            if process.returncode != 0 or not pdf_path.exists():
                output = (process.stdout or b"") + (process.stderr or b"")
                log = output.decode("utf-8", errors="replace")[-4000:]
                msg = "PDF compilation failed"
                raise CompilationError(msg, details={"compiler_log": log})
            return pdf_path.read_bytes()
        finally:
            shutil.rmtree(request_dir, ignore_errors=True)
