/**
 * Smart Contract Deployment Script
 * Deploys GymMembership contract to Ethereum network
 */

const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting GymMembership contract deployment...\n");

  try {
    // Get deployer account
    const [deployer] = await ethers.getSigners();
    console.log(`📍 Deploying contract from account: ${deployer.address}`);
    console.log(`💰 Account balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH\n`);

    // Get contract factory
    const GymMembership = await ethers.getContractFactory("GymMembership");
    console.log("📦 Contract factory loaded");

    // Deploy contract
    console.log("⏳ Deploying contract...");
    const gym = await GymMembership.deploy();
    await gym.deployed();

    console.log(`\n✅ Contract deployed successfully!`);
    console.log(`📝 Contract Address: ${gym.address}`);
    console.log(`🔗 Network: ${hre.network.name}`);
    console.log(`📊 Deployer: ${deployer.address}\n`);

    // Get deployment receipt
    const receipt = await gym.deployTransaction.wait();
    console.log(`⛽ Gas Used: ${receipt.gasUsed.toString()}`);
    console.log(`📦 Block Number: ${receipt.blockNumber}\n`);

    // Save deployment info
    const deploymentInfo = {
      contractAddress: gym.address,
      deployer: deployer.address,
      network: hre.network.name,
      deploymentBlock: receipt.blockNumber,
      deploymentHash: receipt.transactionHash,
      timestamp: new Date().toISOString(),
    };

    console.log("💾 Deployment Info:");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Verify contract on Etherscan (optional)
    if (hre.network.name === "sepolia") {
      console.log("\n⏳ Waiting for block confirmations before verification...");
      await gym.deployTransaction.wait(5);
      
      console.log("🔍 Verifying contract on Etherscan...");
      try {
        await hre.run("verify:verify", {
          address: gym.address,
          constructorArguments: [],
        });
        console.log("✅ Contract verified on Etherscan!");
      } catch (error) {
        console.log("⚠️  Verification failed (contract might already be verified)");
      }
    }

    console.log("\n🎉 Deployment complete!");
    console.log("📌 Save this address in your .env files:");
    console.log(`CONTRACT_ADDRESS=${gym.address}\n`);

  } catch (error) {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exitCode = 1;
  }
}

main();
