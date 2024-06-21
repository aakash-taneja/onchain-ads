import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { abi } from "./abi.js";
import { abidegen } from "./abidegen.js";
import { parseEther } from "viem";
// import { neynar } from 'frog/hubs'

export const app = new Frog({
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

app.use("/*", serveStatic({ root: "./public" }));

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(to right, #432889, #17101F)",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response" ? `Done` : "Welcome to nft ads!"}
        </div>
      </div>
    ),
    intents: [
      <Button.Transaction target="/approve">Approve</Button.Transaction>,
      <Button.Transaction target="/mint">Collect</Button.Transaction>,
      <Button.Transaction target="/addNFT">Add NFT</Button.Transaction>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.transaction("/approve", (c) => {
  const address = c.address;
  // Contract transaction response.
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi: abidegen,
    chainId: "eip155:84532",
    functionName: "approve",
    args: ["0x3389fE7B62D5b121E27aDdb52316e1BaAcD7da75", parseEther("1000")],
    to: "0xb51A718519104a7Cd69A16b79003035053B67EA8",
    // value: amountInWei,
  });

  return tx;
});
app.transaction("/addNFT", (c) => {
  const address = c.address;
  // Contract transaction response.
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "addNFT",
    args: [`${Date.now()}`, "100000000000000000", "1000"],
    to: "0x3389fE7B62D5b121E27aDdb52316e1BaAcD7da75",
    // value: amountInWei,
  });

  return tx;
});
app.transaction("/mint", (c) => {
  const address = c.address;
  // Contract transaction response.
  const amountInWei = parseEther("0.000777"); // Converts 0.000777 Ether to wei using viem's utility function
  // console.log(`amount: ${amountInWei}`);
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "mintNFT",
    args: [
      2, //nftId
      "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", // affiliate (address)
      10, // amount
    ],
    to: "0x3389fE7B62D5b121E27aDdb52316e1BaAcD7da75",
    // value: amountInWei,
  });

  return tx;
});

const port = 3000;
console.log(`Server is running on port ${port}`);

devtools(app, { serveStatic });

serve({
  fetch: app.fetch,
  port,
});
