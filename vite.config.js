import { defineConfig } from "vite";
import {init} from "./src/lib/compiler";
import {readFileSync} from "node:fs";

async function baublePlugin() {

    const compile = await init();

    return {
        name: 'bauble',
        load(id) {

            if(!/\.bauble$/.test(id)) {
                return;
            }

            const code = readFileSync(id, "utf-8");
            const transformedCode = `export default ${JSON.stringify(compile(code))};`

            return {
                code: transformedCode,
                map: null
            }
        },
        handleHotUpdate({ file, server }) {
            if(file.endsWith(".bauble")) {
                server.moduleGraph.invalidateModule(server.moduleGraph.getModuleById(file));
                server.ws.send({
                    type: "full-reload",
                    path: "*"
                })
            }
        }
    }

}

export default defineConfig({
    plugins: [baublePlugin()],
});
