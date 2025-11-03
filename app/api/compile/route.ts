import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomBytes } from 'crypto';

export async function POST(request: NextRequest) {
  let inputFile: string | null = null;

  try {
    const body = await request.json();
    const { tslContent, flags = {} } = body;

    if (!tslContent || typeof tslContent !== 'string') {
      return NextResponse.json({ error: 'TSL content is required' }, { status: 400 });
    }

    // Create temporary file for input
    const tempId = randomBytes(16).toString('hex');
    const tmpDir = '/tmp';
    inputFile = join(tmpDir, `tsl-input-${tempId}.tsl`);

    // Write TSL content to temporary file
    await writeFile(inputFile, tslContent, 'utf-8');

    // Build compiler command with flags
    const compilerPath = join(process.cwd(), 'bin', 'tslcompiler');
    const args: string[] = ['-c', '-s', inputFile];

    // Execute TSLCompiler (will respond 'y' to the interactive prompt)
    const result = await executeCompiler(compilerPath, args);

    let testCases = '';
    let testCount = 0;

    // Remove the interactive prompt from stdout if present
    let cleanedOutput = result.stdout.replace(
      /Write test frames to the standard output \(y\/n\)\?\s*/g,
      ''
    );

    // Parse output: first line is count, rest are test cases
    const lines = cleanedOutput.split('\n');
    if (lines.length > 0) {
      // First line contains the count
      const countMatch = lines[0].match(/(\d+)/);
      if (countMatch) {
        testCount = parseInt(countMatch[1], 10);
      }
      // Find where test cases actually start
      const testCaseStart = lines.findIndex((line) => line.includes('Test Case'));
      if (testCaseStart >= 0) {
        testCases = lines.slice(testCaseStart).join('\n').trim();
      }
    }

    if (result.exitCode !== 0) {
      return NextResponse.json(
        {
          error: result.stderr || 'Compilation failed',
          exitCode: result.exitCode,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      testCases,
      testCount: flags.count ? testCount : undefined,
      stdout: result.stdout,
      stderr: result.stderr,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  } finally {
    // Clean up temporary input file
    if (inputFile) {
      try {
        await unlink(inputFile);
      } catch {
        // Silently fail - file may have already been deleted
      }
    }
  }
}

interface CompilerResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

function executeCompiler(compilerPath: string, args: string[]): Promise<CompilerResult> {
  return new Promise((resolve) => {
    const child = spawn(compilerPath, args);
    let stdout = '';
    let stderr = '';

    child.stdout?.on('data', (data) => {
      const output = data.toString();
      stdout += output;

      // Respond 'y' to the interactive prompt
      if (output.includes('Write test frames to the standard output (y/n)?')) {
        child.stdin?.write('y\n');
      }
    });

    child.stderr?.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      resolve({
        stdout,
        stderr,
        exitCode: code || 0,
      });
    });

    child.on('error', (error) => {
      resolve({
        stdout,
        stderr: error.message,
        exitCode: 1,
      });
    });
  });
}
