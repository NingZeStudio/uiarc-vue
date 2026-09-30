import https from "node:https";

const options = {
  hostname: "api.github.com",
  path: "/repos/kuratlielia/arc-library/contents/registry/components",
  headers: {
    "User-Agent": "uiarc-vue-builder",
  },
};

https.get(options, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    try {
      const items = JSON.parse(data);
      const dirs = items
        .filter((i) => i.type === "dir")
        .map((i) => i.name);
      console.log(`TOTAL_COMPONENTS: ${dirs.length}`);
      console.log(JSON.stringify(dirs));
    } catch (e) {
      console.error(e);
    }
  });
}).on("error", (e) => {
  console.error(e);
});
