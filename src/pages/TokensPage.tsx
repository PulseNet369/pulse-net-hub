
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchTokenData } from "../utils/blockchain";
import { TokenData } from "../types/token";

// List of token contract addresses in the ecosystem
const TOKEN_ADDRESSES = [
  "0xf651e3978f1f6ec38a6da6014caa6aa07fbae453", // PulseNet (PLSN)
  // Add more token addresses here as they are added to the ecosystem
];

const TokensPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<TokenData[]>([]);

  // Fetch token data using React Query
  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens', TOKEN_ADDRESSES],
    queryFn: async () => {
      console.log('Fetching data for all tokens...');
      const tokenPromises = TOKEN_ADDRESSES.map(async (address, index) => {
        try {
          const tokenData = await fetchTokenData(address);
          return {
            id: `token-${index}`,
            ...tokenData,
            // Mock additional data that would come from other sources
            price: index === 0 ? "$0.00012" : "$0.0023",
            change24h: index === 0 ? "+5.2%" : "-1.3%",
            tvl: index === 0 ? "$2.1M" : "$450K",
            holders: index === 0 ? 1247 : 89,
            rewardToken: "PLS"
          } as TokenData;
        } catch (error) {
          console.error(`Error fetching data for token ${address}:`, error);
          // Return fallback data if fetch fails
          return {
            id: `token-${index}`,
            name: index === 0 ? "PulseNet" : "Unknown Token",
            symbol: index === 0 ? "PLSN" : "UNKNOWN",
            address,
            totalSupply: "0",
            decimals: 18,
            distributorAddress: "0x0000000000000000000000000000000000000000",
            liquidityTax: 0,
            reflectionTax: 0,
            devTax: 0,
            marketingTax: 0,
            totalTax: 0,
            sellMultiplier: 100,
            price: "$0.00",
            change24h: "0%",
            tvl: "$0",
            holders: 0,
            rewardToken: "PLS"
          } as TokenData;
        }
      });

      return Promise.all(tokenPromises);
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  });

  useEffect(() => {
    if (tokensData) {
      const filtered = tokensData.filter(token =>
        token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTokens(filtered);
    }
  }, [tokensData, searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Ecosystem Tokens</h1>
          <p className="text-muted-foreground mb-6">Loading token data from PulseChain...</p>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Ecosystem Tokens</h1>
          <p className="text-red-500 mb-6">Error loading token data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Ecosystem Tokens</h1>
        <p className="text-muted-foreground mb-6">
          Discover and analyze all tax tokens in the PulseNet ecosystem
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
                  <CardTitle className="flex items-center gap-2 flex-wrap">
                    {token.name} ({token.symbol})
                    <Badge variant="secondary">Total Tax: {token.totalTax}%</Badge>
                  </CardTitle>
                  <CardDescription className="font-mono text-xs break-all">
                    {token.address}
                  </CardDescription>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <div className="text-2xl font-bold">{token.price}</div>
                  <div className={`text-sm ${token.change24h?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {token.change24h}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Total Supply</div>
                  <div className="font-medium">{parseFloat(token.totalSupply).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Decimals</div>
                  <div className="font-medium">{token.decimals}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Liquidity Tax</div>
                  <div className="font-medium">{token.liquidityTax}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Reflection Tax</div>
                  <div className="font-medium">{token.reflectionTax}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Dev Tax</div>
                  <div className="font-medium">{token.devTax}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Marketing Tax</div>
                  <div className="font-medium">{token.marketingTax}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Sell Multiplier</div>
                  <div className="font-medium">{token.sellMultiplier}x</div>
                </div>
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
                <div className="md:col-span-2">
                  <div className="text-sm text-muted-foreground">Distributor Address</div>
                  <div className="font-medium font-mono text-xs break-all">{token.distributorAddress}</div>
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
