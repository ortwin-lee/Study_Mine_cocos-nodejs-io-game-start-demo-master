import { ApiMsgEnum } from "./Common";
import { Connection, MyServer } from "./Core";
import { symlinkCommon } from "./Utils";
import { WebSocketServer } from "ws";

symlinkCommon();

const server = new MyServer({
    port: 9876,
});

server.setApi(ApiMsgEnum.ApiPlayerJoin, (connection: Connection, data: any) => {
    return data + " This is server!";
});

server
    .start()
    .then(() => {
        console.log("服务启动!");
    })
    .catch(e => {
        console.log(e);
    });

// const wss = new WebSocketServer({ port: 9876 });

// let inputs = [];

// wss.on("connection", socket => {
//     socket.on("message", buffer => {
//         const str = buffer.toString();
//         try {
//             const msg = JSON.parse(str);
//             const { name, data } = msg;
//             const { frameId, input } = data;
//             inputs.push(input);
//         } catch (error) {
//             console.log(error);
//         }
//     });

//     setInterval(() => {
//         const temp = inputs;
//         inputs = [];
//         const msg = {
//             name: ApiMsgEnum.MsgServerSync,
//             data: {
//                 inputs: temp,
//             },
//         };

//         socket.send(JSON.stringify(msg));
//     }, 100);

//     // const obj = {
//     //     name: "haha",
//     //     data: "haha123",
//     // };
//     // socket.send(JSON.stringify(obj));
// });

// wss.on("listening", () => {
//     console.log("服务启动!");
// });
