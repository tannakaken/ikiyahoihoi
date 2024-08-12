import fs from "fs";

const map: {[key: string]: string} = {
    "あの人": "anohito"
};

const main = () => {
    const files = fs.readdirSync("./novels");
    files.forEach((file) => {
        const title = file.substring(0, file.length - 4);
        const target = map[title];
        const content = fs.readFileSync(`./novels/${file}`, {encoding: "utf-8"});
        // eslint-disable-next-line no-irregular-whitespace
        const body = content.split("\n").map((line) => `　${line}`).join("\n");
        const data = {title, body};
        const result = `export const ${target} = ${JSON.stringify(data, null, 2)};`;
        fs.writeFileSync(`./src/assets/${target}.ts`, result);
    })
};

main();
