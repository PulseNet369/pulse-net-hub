
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Mock token data
const mockTokens = [
  {
    id: 1,
    name: "EcoToken",
    symbol: "ECO",
    address: "0x1234...5678",
    taxRate: "5%",
    rewardToken: "PulseNet",
    tvl: "$1.2M",
    holders: 324,
    price: "$0.0023",
    change24h: "+12.5%"
  },
  {
    id: 2,
    name: "GreenPulse",
    symbol: "GPULSE",
    address: "0x2345...6789",
    taxRate: "3%",
    rewardToken: "USDC",
    tvl: "$890K",
    holders: 156,
    price: "$0.0045",
    change24h: "-2.1%"
  },
  {
    id: 3,
    name: "RewardMax",
    symbol: "RMAX",
    address: "0x3456...7890",
    taxRate: "7%",
    rewardToken: "HEX",
    tvl: "$567K",
    holders: 89,
    price: "$0.0012",
    change24h: "+8.3%"
  }
];

const TokensPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState(mockTokens);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockTokens.filter(token =>
      token.name.toLowerCase().includes(value.toLowerCase()) ||
      token.symbol.toLowerCase().includes(value.toLowerCase()) ||
      token.address.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredTokens(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Ecosystem Tokens</h1>
        <p className="text-muted-foreground mb-6">
          Discover and analyze all tax tokens in the PulseChain ecosystem
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search tokens by name, symbol, or address..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          <Button>Add Token</Button>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTokens.map((token) => (
          <Card key={token.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {token.name} ({token.symbol})
                    <Badge variant="secondary">Tax: {token.taxRate}</Badge>
                  </CardTitle>
                  <CardDescription>{token.address}</CardDescription>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <div className="text-2xl font-bold">{token.price}</div>
                  <div className={`text-sm ${token.change24h.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {token.change24h}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Reward Token</div>
                  <div className="font-medium">{token.rewardToken}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">TVL</div>
                  <div className="font-medium">{token.tvl}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Holders</div>
                  <div className="font-medium">{token.holders}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Tax Rate</div>
                  <div className="font-medium">{token.taxRate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokensPage;
