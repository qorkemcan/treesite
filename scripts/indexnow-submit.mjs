import fs from "node:fs/promises";
import process from "node:process";

const HOST = "www.protreetrim.com";
const BASE_URL = `https://${HOST}`;
const KEY_FILENAME = "e0cbad96a375459d91d28d6e37b31f76.txt";

const keyFileUrl = new URL(`../public/${KEY_FILENAME}`, import.meta.url);
const key = (await fs.readFile(keyFileUrl, "utf8")).trim();
const keyLocation = `${BASE_URL}/${KEY_FILENAME}`;

const inputUrls = process.argv.slice(2);

if (inputUrls.length === 0) {
  console.error(
    "Usage: node scripts/indexnow-submit.mjs /blog/example/ /another-page/"
  );
  process.exit(1);
}

const urls = [
  ...new Set(
    inputUrls.map((input) => {
      if (/^https?:\/\//i.test(input)) {
        return input;
      }

      const path = input.startsWith("/") ? input : `/${input}`;
      return `${BASE_URL}${path}`;
    })
  ),
];

for (const value of urls) {
  const parsed = new URL(value);

  if (parsed.protocol !== "https:" || parsed.hostname !== HOST) {
    console.error(`Rejected external or invalid URL: ${value}`);
    process.exit(1);
  }
}

const payload = {
  host: HOST,
  key,
  keyLocation,
  urlList: urls,
};

const response = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

console.log(`IndexNow HTTP ${response.status} ${response.statusText}`);

if (![200, 202].includes(response.status)) {
  const responseBody = await response.text();
  console.error(responseBody || "IndexNow submission failed.");
  process.exit(1);
}

console.log(`Submitted ${urls.length} URL(s):`);

for (const url of urls) {
  console.log(`- ${url}`);
}
