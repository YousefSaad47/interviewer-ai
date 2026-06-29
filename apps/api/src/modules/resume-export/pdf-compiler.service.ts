import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { InternalException } from "@/common/exceptions";
import { logger } from "@/lib/logger";

export class PdfCompilerService {
  private readonly _command: string;
  private readonly _timeoutMs: number;

  constructor(command: string, timeoutMs: number) {
    this._command = command;
    this._timeoutMs = timeoutMs;
  }

  async compile(latex: string): Promise<Buffer> {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "resume-export-"));
    const texPath = path.join(tmpDir, "resume.tex");
    const pdfPath = path.join(tmpDir, "resume.pdf");

    try {
      await fs.writeFile(texPath, latex, "utf-8");

      await this._runCompiler(tmpDir);

      let pdfBuffer: Buffer;
      try {
        pdfBuffer = Buffer.from(await fs.readFile(pdfPath));
      } catch {
        throw new InternalException("The resume PDF could not be generated.", {
          code: "PDF_COMPILATION_FAILED",
        });
      }

      if (
        pdfBuffer.length < 5 ||
        pdfBuffer.subarray(0, 5).toString() !== "%PDF-"
      ) {
        throw new InternalException("The resume PDF could not be generated.", {
          code: "INVALID_PDF_OUTPUT",
        });
      }

      return pdfBuffer;
    } finally {
      await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const result = await this._spawnProcess(
        [this._command, "--version"],
        os.tmpdir(),
        5000,
      );
      return result.exitCode === 0;
    } catch {
      return false;
    }
  }

  private _runCompiler(workDir: string): Promise<void> {
    const args = [
      "-interaction=nonstopmode",
      "-halt-on-error",
      "-no-shell-escape",
      `-output-directory=${workDir}`,
      path.join(workDir, "resume.tex"),
    ];

    return new Promise((resolve, reject) => {
      const proc = spawn(this._command, args, {
        cwd: workDir,
        shell: false,
        stdio: ["ignore", "pipe", "pipe"],
        timeout: this._timeoutMs,
      });

      let stdout = "";
      let stderr = "";

      proc.stdout?.on("data", (chunk: Buffer) => {
        if (stdout.length < 8000) stdout += chunk.toString();
      });
      proc.stderr?.on("data", (chunk: Buffer) => {
        if (stderr.length < 8000) stderr += chunk.toString();
      });

      let settled = false;
      let timedOut = false;

      const fail = (error: InternalException) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(error);
      };

      const timer = setTimeout(() => {
        timedOut = true;
        proc.kill("SIGKILL");
        fail(
          new InternalException("The resume PDF could not be generated.", {
            code: "PDF_COMPILATION_TIMEOUT",
          }),
        );
      }, this._timeoutMs);

      proc.on("error", (err) => {
        if ((err as NodeJS.ErrnoException).code === "ENOENT") {
          fail(
            new InternalException(
              "LaTeX compiler is not available. Please install xelatex or configure LATEX_COMMAND.",
              { code: "LATEX_COMPILER_UNAVAILABLE" },
            ),
          );
        } else {
          fail(
            new InternalException("The resume PDF could not be generated.", {
              code: "PDF_COMPILATION_FAILED",
            }),
          );
        }
      });

      proc.on("close", (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);

        if (code !== 0) {
          logger.warn(
            {
              exitCode: code,
              timedOut,
              stdoutTail: stdout.slice(-1000),
              stderrTail: stderr.slice(-1000),
            },
            "LaTeX compilation failed",
          );
          reject(
            new InternalException("The resume PDF could not be generated.", {
              code: "PDF_COMPILATION_FAILED",
            }),
          );
        } else {
          resolve();
        }
      });
    });
  }

  private _spawnProcess(
    args: string[],
    cwd: string,
    timeout: number,
  ): Promise<{ exitCode: number }> {
    return new Promise((resolve, reject) => {
      const command = args[0];
      if (!command) {
        reject(new Error("Missing command"));
        return;
      }

      const proc = spawn(command, args.slice(1), {
        cwd,
        shell: false,
        stdio: "ignore",
        timeout,
      });
      proc.on("error", reject);
      proc.on("close", (code) => resolve({ exitCode: code ?? 1 }));
    });
  }
}
