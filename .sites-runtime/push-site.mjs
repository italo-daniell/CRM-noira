import { spawnSync } from "node:child_process";

let input = "";
if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
  process.stdout.write("Ready for credential JSON on hidden stdin.\n");
  input = await new Promise((resolve) => {
    let buffer = "";
    process.stdin.on("data", (chunk) => {
      const text = chunk.toString("utf8");
      const newline = text.search(/[\r\n]/);
      if (newline >= 0) {
        buffer += text.slice(0, newline);
        process.stdin.setRawMode(false);
        resolve(buffer);
      } else {
        buffer += text;
      }
    });
  });
} else {
  for await (const chunk of process.stdin) input += chunk;
}
const credential = JSON.parse(input);

const run = (args, options = {}) => {
  const result = spawnSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options,
  });
  if (result.status !== 0) {
    process.stderr.write(result.stderr || "Git command failed.\n");
    process.exit(result.status || 1);
  }
  return result.stdout.trim();
};

run(["add", "--",
  "app/globals.css",
  "app/dashboard/dashboard.css",
  "app/dashboard/conversations/conversations.css",
  "app/dashboard/contacts/contacts.css",
  "app/dashboard/calendar/calendar.css",
  "app/dashboard/reports/reports.css",
  "app/dashboard/ai/ai.css",
  "app/dashboard/profile/profile.css",
  "app/dashboard/admin/admin.css",
]);
const staged = spawnSync("git", ["diff", "--cached", "--quiet"], { cwd: process.cwd() });
if (staged.status === 1) run(["commit", "-m", "Create NOIRA premium black theme"]);

const sha = run(["rev-parse", "HEAD"]);
const env = {
  ...process.env,
  GIT_CONFIG_COUNT: "1",
  GIT_CONFIG_KEY_0: "http.extraHeader",
  GIT_CONFIG_VALUE_0: `Authorization: Bearer ${credential.token}`,
};
run(["push", credential.remote_url, `${sha}:refs/heads/${credential.branch}`], { env });
process.stdout.write(JSON.stringify({ commit_sha: sha }));
