import subprocess
from pathlib import Path
from typing import cast

import pytest

from ats_resume_builder.compiler.pdf_compiler import PDFCompiler
from ats_resume_builder.config.settings import Settings
from ats_resume_builder.exceptions import CompilationError, PDFCompilationTimeoutError


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


@pytest.mark.asyncio
async def test_compiler_timeout_cleans_request_directory(
    monkeypatch: pytest.MonkeyPatch, tmp_path: Path
) -> None:
    def raise_timeout(
        *args: object, **kwargs: object
    ) -> subprocess.CompletedProcess[bytes]:
        raise subprocess.TimeoutExpired(cmd="xelatex", timeout=1)

    monkeypatch.setattr(subprocess, "run", raise_timeout)
    compiler = PDFCompiler(
        Settings(temporary_directory=tmp_path, compiler_timeout_seconds=1)
    )

    with pytest.raises(PDFCompilationTimeoutError):
        await compiler.compile("bad", request_id="request-timeout")

    assert not (tmp_path / "request-timeout").exists()


@pytest.mark.asyncio
async def test_compiler_success_reads_pdf_and_cleans_directory(
    monkeypatch: pytest.MonkeyPatch,
    tmp_path: Path,
) -> None:
    def fake_run(*args: object, **kwargs: object) -> subprocess.CompletedProcess[bytes]:
        cwd = Path(cast(str, kwargs["cwd"]))
        (cwd / "resume.pdf").write_bytes(b"%PDF-1.7 fake")
        return subprocess.CompletedProcess(
            args=[], returncode=0, stdout=b"", stderr=b""
        )

    monkeypatch.setattr(subprocess, "run", fake_run)
    compiler = PDFCompiler(Settings(temporary_directory=tmp_path))

    pdf = await compiler.compile("latex", request_id="request-success")

    assert pdf == b"%PDF-1.7 fake"
    assert not (tmp_path / "request-success").exists()
