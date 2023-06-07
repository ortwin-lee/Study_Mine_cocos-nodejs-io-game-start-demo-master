import fs from "fs-extra";
import path from "path";

//symlink同步
export const symlinkCommon = async () => {
    const src = path.resolve(__dirname, "../Common");
    const dst = path.resolve(__dirname, "../../../client/assets/Scripts/Common");

    if (
        (await fs
            .lstat(dst)
            .then(v => v.isSymbolicLink())
            .catch(() => false)) &&
        (await fs.readlink(dst)) === src
    ) {
        console.log("同步成功！");
    } else {
        fs.symlink(src, dst)
            .then(() => {
                console.log("同步成功！");
            })
            .catch(e => {
                console.log("同步失败！", e);
            });
    }
};

export const buffer2ArrayBuffer = (buffer: Buffer): ArrayBuffer => {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const dataView = new DataView(arrayBuffer);
    for (let index = 0; index < buffer.length; index++) {
        dataView.setUint8(index, buffer[index]);
    }

    return dataView.buffer;
};
