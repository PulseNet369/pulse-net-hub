
export interface AddressEntry {
  id: number;
  name: string;
  address: string;
  tags: string[];
  category: string;
}

// Address list - add new addresses here in the format:
// name: [name], address: [address], tags: [tag1, tag2, tag3]
export const addressList: AddressEntry[] = [
  {
    id: 1,
    name: "Origin Address",
    address: "0xae87E12cA4C3022193bbB0Cb478f06758412DABa",
    tags: ["OA", "wallet"],
    category: "OA Address"
  },
  {
    id: 2,
    name: "PLSN-PLS LP",
    address: "0xead0d2751d20c83d6ee36f6004f2aa17637809cf",
    tags: ["LP", "liquidity", "PulseX LP", "PLSN", "PLS"],
    category: "Liquidity Pool"
  }
];

// Helper function to categorize addresses based on tags
export const categorizeAddress = (tags: string[]): string => {
  if (tags.includes("OA")) return "OA Address";
  if (tags.includes("LP") || tags.includes("liquidity")) return "Liquidity Pool";
  if (tags.includes("Team") || tags.includes("Developer")) return "Dev Wallet";
  if (tags.includes("Marketing")) return "Marketing Wallet";
  if (tags.includes("Contract") || tags.includes("Reward Distributor")) return "Smart Contract";
  return "Token Holder";
};
