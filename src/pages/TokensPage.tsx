
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { fetchTokenData } from "../utils/blockchain";
import { TokenData } from "../types/token";
import { TOKEN_LIST } from "../data/tokenList";

const TokensPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTokens, setFilteredTokens] = useState<TokenData[]>([]);

  // Fetch token data using React Query
  const { data: tokensData, isLoading, error } = useQuery({
    queryKey: ['tokens', TOKEN_LIST],
    queryFn: async () => {
      console.log('Fetching data for all tokens...');
      const tokenPromises = TOKEN_LIST.map(async (tokenConfig, index) => {
        try {
          const tokenData = await fetchTokenData(tokenConfig);
          
          // Mock price data (in real app, this would come from price API)
          const mockPrice = index === 0 ? 0.00012 : 0.0023;
          const totalSupplyNum = parseFloat(tokenData.totalSupply || "0");
          const marketCap = mockPrice * totalSupplyNum;
          
          return {
            id: `token-${index}`,
            ...tokenData,
            hasDistributor: tokenConfig.hasDistributor,
            price: `$${mockPrice.toFixed(6)}`,
            change24h: index === 0 ? "+5.2%" : "-1.3%",
            marketCap: `$${marketCap.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
            holders: index === 0 ? 1247 : 89,
          } as TokenData;
        } catch (error) {
          console.error(`Error fetching data for token ${tokenConfig.address}:`, error);
          // Return fallback data if fetch fails
          return {
            id: `token-${index}`,
            name: tokenConfig.name,
            symbol: tokenConfig.symbol,
            address: tokenConfig.address,
            totalSupply: "0",
            decimals: 18,
            hasDistributor: tokenConfig.hasDistributor,
            rewardToken: tokenConfig.rewardToken?.symbol,
            wrappedToken: tokenConfig.wrappedToken?.symbol,
            price: "$0.00",
            change24h: "0%",
            marketCap: "$0",
            holders: 0,
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Ecosystem Tokens
          </h1>
          <p className="text-muted-foreground mb-6">Loading token data from PulseChain...</p>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse border-pink-200/20 bg-gradient-to-br from-background to-pink-50/10">
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
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Ecosystem Tokens
          </h1>
          <p className="text-red-500 mb-6">Error loading token data: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
          Ecosystem Tokens
        </h1>
        <p className="text-muted-foreground mb-6">
          Discover and analyze tax tokens in the PulseNet ecosystem powered by PulseChain
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search tokens by name, symbol, or address..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 border-pink-200 focus:border-pink-400"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredTokens.map((token) => (
          <Card key={token.id} className="border-pink-200/20 bg-gradient-to-br from-background to-pink-50/10 hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 flex-wrap">
                    <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                      {token.name} ({token.symbol})
                    </span>
                    {token.hasDistributor && token.totalTax !== undefined && (
                      <Badge variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
                        Total Tax: {token.totalTax}%
                      </Badge>
                    )}
                    {!token.hasDistributor && (
                      <Badge variant="outline" className="border-indigo-300 text-indigo-700">
                        Standard Token
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="font-mono text-xs break-all">
                    {token.address}
                  </CardDescription>
                </div>
                <div className="text-right mt-2 sm:mt-0">
                  <div className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
                    {token.price}
                  </div>
                  <div className={`text-sm font-semibold ${token.change24h?.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
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
                {token.burnedSupply && (
                  <div>
                    <div className="text-sm text-muted-foreground">Burned Supply</div>
                    <div className="font-medium text-red-600">{parseFloat(token.burnedSupply).toLocaleString()}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="font-medium">{token.marketCap}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Holders</div>
                  <div className="font-medium">{token.holders}</div>
                </div>
                
                {token.hasDistributor && (
                  <>
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
                    {token.rewardToken && (
                      <div>
                        <div className="text-sm text-muted-foreground">Reward Token</div>
                        <div className="font-medium text-purple-600">{token.rewardToken}</div>
                      </div>
                    )}
                    {token.distributorAddress && (
                      <div className="md:col-span-2">
                        <div className="text-sm text-muted-foreground">Distributor Address</div>
                        <div className="font-medium font-mono text-xs break-all">{token.distributorAddress}</div>
                      </div>
                    )}
                  </>
                )}
                
                {token.wrappedToken && (
                  <div>
                    <div className="text-sm text-muted-foreground">Wrapped Token</div>
                    <div className="font-medium text-indigo-600">{token.wrappedToken}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TokensPage;
