import Flower from '../abi/Flower.json'

class FlowerNFT {
  static url = {
    apiKey: "AJW2QPZGHZBBEURNJVXX3C6S68JQ8FZ8SC",
    bscscanApiserver: "https://api-testnet.bscscan.com",
  };
  static maximumgrant = {
    // 最大授权金额
    max: 1e6,
  };
  static contract = {
    flower: "0x464f26F81e6B8F70548B2F8dc8f83Cac6157943e",

  };
  static abi = {
    Flower: Flower.abi,
  };
}

export default FlowerNFT;
