import connectToDatabase from "./utils/db";

const main = async () => {
  await connectToDatabase();
  // const user = new UserModel({
  //   walletAddress: "test",
  //   nftProjects: [],
  //   smartContractProjects: [],
  // });
  // Smart Contract Projects
  // const smartContractSettings: { [index: string]: any } = {
  //   GATSBY: {
  //     tokenAddress: "0x5D0EbC4Ec5ac18d30512fb6287886245061B3Dbd",
  //     contractTriggerThreshold: {
  //       transferSupplyThreshold: new Decimal("0.1").toString(),
  //       ethAlertThreshold: new Decimal("1.0").toString(),
  //       priceImpactThreshold: new Decimal("5.0").toString(),
  //     },
  //   },
  //   MONKEYS: {
  //     tokenAddress: "0x20cdecbf5d56870b4068a255580a58d068446c92",
  //     contractTriggerThreshold: {
  //       transferSupplyThreshold: new Decimal("0.1").toString(),
  //       ethAlertThreshold: new Decimal("1.0").toString(),
  //       priceImpactThreshold: new Decimal("5.0").toString(),
  //     },
  //   },
  //   FLOKI: {
  //     tokenAddress: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
  //     contractTriggerThreshold: {
  //       transferSupplyThreshold: new Decimal("0.1").toString(),
  //       ethAlertThreshold: new Decimal("10.0").toString(),
  //       priceImpactThreshold: new Decimal("3.0").toString(),
  //     },
  //   },
  //   HOBBES: {
  //     tokenAddress: "0xb475332d25d34b59176f5c1d94cb9bc9b5e3954a",
  //     contractTriggerThreshold: {
  //       transferSupplyThreshold: new Decimal("0.1").toString(),
  //       ethAlertThreshold: new Decimal("25.0").toString(),
  //       priceImpactThreshold: new Decimal("3.0").toString(),
  //     },
  //   },
  //   PEPE: {
  //     tokenAddress: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
  //     contractTriggerThreshold: {
  //       transferSupplyThreshold: new Decimal("0.1").toString(),
  //       ethAlertThreshold: new Decimal("10.0").toString(),
  //       priceImpactThreshold: new Decimal("3.0").toString(),
  //     },
  //   },
  // };

  // const nftProjectSettings: { [index: string]: any } = {
  //   CryptoPunks: {
  //     tokenAddress: "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb",
  //     contractTriggerThreshold: {
  //       "24h": {
  //         volumeChange: new Decimal(0.1).toString(),
  //         floorPriceChange: new Decimal(0.1).toString(),
  //         listingsChange: new Decimal(0.1).toString(),
  //       },
  //       "1h": {
  //         volumeChange: new Decimal(0.1).toString(),
  //         floorPriceChange: new Decimal(0.1).toString(),
  //         listingsChange: new Decimal(0.1).toString(),
  //       },
  //       "30d": {
  //         volumeChange: new Decimal(0.1).toString(),
  //         floorPriceChange: new Decimal(0.1).toString(),
  //         listingsChange: new Decimal(0.1).toString(),
  //       },
  //     },
  //   },
  // };

  // for (const contractName in smartContractSettings) {
  //   const contractData = smartContractSettings[contractName];

  //   const smartContractProject = new SmartContractProjectModel({
  //     address: contractData.tokenAddress,
  //     contractTriggerThresholds: new Map([
  //       [
  //         contractName,
  //         {
  //           transferSupplyThreshold:
  //             contractData.contractTriggerThreshold.transferSupplyThreshold,
  //           ethAlertThreshold:
  //             contractData.contractTriggerThreshold.ethAlertThreshold,
  //           priceImpactThreshold:
  //             contractData.contractTriggerThreshold.priceImpactThreshold,
  //         },
  //       ],
  //     ]),
  //   });

  //   user.smartContractProjects.push(smartContractProject);
  // }

  // for (const contractName in nftProjectSettings) {
  //   const contractData = nftProjectSettings[contractName];

  //   const nftProject = new NFTProjectModel({
  //     address: contractData.tokenAddress,
  //     contractTriggerThresholds: new Map([
  //       [
  //         contractName,
  //         {
  //           volumeChange:
  //             contractData.contractTriggerThreshold["24h"].volumeChange,
  //           floorPriceChange:
  //             contractData.contractTriggerThreshold["24h"].floorPriceChange,
  //           listingsChange:
  //             contractData.contractTriggerThreshold["24h"].listingsChange,
  //         },
  //       ],
  //     ]),
  //   });

  //   user.nftProjects.push(nftProject);
  // }

  // await user.save();

  console.log("User created successfully");
};

main().catch((error) => {
  console.error("An error occurred:", error);
});
