const fs = require("fs");

// This file is only here to make interacting with the Dapp easier,
// feel free to ignore it if you don't need it.
const address = {
    one: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    two: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    splitter: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
};


task("sendSplitter", "send money to the splitter")
  .addParam("sendAmount", "amount of token to send to the splitter")
  .setAction(async ({ sendAmount }) => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    if ((await ethers.provider.getCode(address.splitter)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    // Get Splitter
    const splitter = await ethers.getContractAt("PaymentSplitter", address.splitter);
    console.log('sendAmount', sendAmount)

    // Send some money to the contract
    const [sender] = await ethers.getSigners();
    await sender.sendTransaction({
        to: splitter.address,
        value: parseInt(sendAmount) || 10,
    });
  });


task("release", "release for an address")
  .addParam("addressKey", "which add to release")
  .setAction(async ({ addressKey }) => {
    const releaseAddress = address[addressKey]
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    if ((await ethers.provider.getCode(address.splitter)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    // Get Splitter
    const splitter = await ethers.getContractAt("PaymentSplitter", address.splitter);

    await splitter.release(releaseAddress)

    const totalReleased = await splitter.totalReleased();
    console.log('TotalReleased', totalReleased.toNumber());

    const released = await splitter.released(releaseAddress);
    console.log('released to this address', released.toNumber())
  });

task("inspectSplitter", "Inspection for Splitter")
  .setAction(async () => {
    if (network.name === "hardhat") {
      console.warn(
        "You are running the faucet task with Hardhat network, which" +
          "gets automatically created and destroyed every time. Use the Hardhat" +
          " option '--network localhost'"
      );
    }

    if ((await ethers.provider.getCode(address.splitter)) === "0x") {
      console.error("You need to deploy your contract first");
      return;
    }

    // Get Splitter
    const splitter = await ethers.getContractAt("PaymentSplitter", address.splitter);
    const balance = await ethers.provider.getBalance(address.splitter);
    console.log('contract balance', balance.toNumber());

    // Some Inspection
    const totalShares = await splitter.totalShares();
    let totalReleased = await splitter.totalReleased();
    console.log('totalShares', totalShares.toNumber());
    console.log('totalReleased', totalReleased.toNumber());
  });

module.exports = {}
