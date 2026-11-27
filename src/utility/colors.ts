import chalk from "chalk";

export function linksOrInfoC(message: string, doReturn: boolean = false) {
  if (doReturn) {
    return chalk.cyan.bold(message);
  }
  console.log(chalk.cyan.bold(message));
}
export function sucessC(message: string, doReturn: boolean = false) {
  if (doReturn) {
    return chalk.green.bold("✔ " + message);
  }
  console.log(chalk.green.bold("✔ " + message));
}
export function errorC(message: string, doReturn: boolean = false) {
  if (doReturn) {
    return chalk.red.bold("✖ " + message);
  }
  console.error(chalk.red.bold("✖ " + message));
}

export function warningC(message: string, doReturn: boolean = false) {
  if (doReturn) {
    return chalk.yellow.bold("⚠ " + message);
  }
  console.log(chalk.yellow.bold("⚠ " + message));
}
export function greyC(message: string, doReturn: boolean = false) {
  if (doReturn) {
    return chalk.grey(message);
  }
  console.log(chalk.green(message));
}
