from pathlib import Path

import pytest

from ats_resume_builder.compiler.pdf_compiler import PDFCompiler
from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import CompilationError


@pytest.mark.asyncio
async def test_compiler_cleans_request_directory_on_failure(tmp_path: Path) -> None:
    settings = Settings(
        compiler_path="definitely-not-xelatex",
        temporary_directory=tmp_path,
        compiler_timeout_seconds=1,
    )
    compiler = PDFCompiler(settings)

    with pytest.raises(CompilationError):
        await compiler.compile("bad", request_id="request-1")

    assert not (tmp_path / "request-1").exists()
