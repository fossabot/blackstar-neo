
### Logging Behavior
- **WhatsApp Bot**: Runs in a child process managed by `spawn` from `index.js`. It uses standard `console.log`/`console.error` (which is patched by `lib/Components/ErrorHandler.js`) and also utilizes `pino` for internal Bailey's logging.
- **Telegram Bot**: Runs in the parent process alongside `index.js`. It previously attempted to use `global.consolefy`, which caused logging issues as it was never properly defined. This has been fixed to use standard `console.log` and `console.error`.
- Parent process streams both its own logs (Telegram) and forwards standard output/error from the WhatsApp child process.
