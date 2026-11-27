
import { performance } from "node:perf_hooks";
import chalk from "chalk";


export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms.toFixed(2)} ms`;
  }

  if (ms < 60_000) {
    return `${(ms / 1000).toFixed(2)} seconds`;
  }

  if (ms < 3_600_000) {
    const minutes = Math.floor(ms / 60_000);
    const seconds = ((ms % 60_000) / 1000).toFixed(2);

    return `${minutes} min ${seconds} sec`;
  }

  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  const seconds = ((ms % 60_000) / 1000).toFixed(2);

  return `${hours} hr ${minutes} min ${seconds} sec`;
}


export async function measureTime<T>(
  operation: () => Promise<T>,
  enabled: boolean
): Promise<T> {
  if (!enabled) {
    return operation();
  }

  const start = performance.now();

  try {
    return await operation();
  } finally {
    const duration = performance.now() - start;

    console.log(
      chalk.gray("Completed in ") +
      chalk.cyan.bold(formatDuration(duration))
    );
  }
}
