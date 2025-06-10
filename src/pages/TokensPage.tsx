
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddressDisplay } from "@/components/AddressDisplay";
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-pulse">
              PulseNet Ecosystem
            </h1>
            <p className="text-muted-foreground mb-6">Loading token data from PulseChain...</p>
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-pink-500/20 card-gradient">
                <CardHeader>
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-pulse">
              PulseNet Ecosystem
            </h1>
            <p className="text-red-400 mb-6">Error loading token data: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-pulse">
            PulseNet Ecosystem
          </h1>
          <p className="text-muted-foreground mb-6">
            Discover and analyze tokens in the PulseNet ecosystem powered by PulseChain
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search tokens by name, symbol, or address..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 bg-card border-pink-500/20 focus:border-pink-400 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid gap-6">
          {filteredTokens.map((token) => (
            <Card key={token.id} className="border-pink-500/20 card-gradient hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-gradient-hex text-xl md:text-2xl">
                        {token.name} ({token.symbol})
                      </span>
                      {token.hasDistributor && token.totalTax !== undefined && (
                        <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30 shrink-0">
                          Total Tax: {token.totalTax}%
                        </Badge>
                      )}
                      {!token.hasDistributor && (
                        <Badge variant="outline" className="border-purple-400/50 text-purple-300 shrink-0">
                          Standard Token
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mb-3">
                      <AddressDisplay 
                        address={token.address} 
                        showLabel={false}
                        className="w-full"
                      />
                    </CardDescription>
                  </div>
                  <div className="text-right lg:min-w-[120px]">
                    <div className="text-xl md:text-2xl font-bold text-gradient-pulse">
                      {token.price}
                    </div>
                    <div className={`text-sm font-semibold ${token.change24h?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {token.change24h}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Supply</div>
                    <div className="font-semibold text-foreground">{parseFloat(token.totalSupply).toLocaleString()}</div>
                  </div>
                  {token.burnedSupply && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">Burned Supply</div>
                      <div className="font-semibold text-red-400">{parseFloat(token.burnedSupply).toLocaleString()}</div>
                    </div>
                  )}
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Market Cap</div>
                    <div className="font-semibold text-foreground">{token.marketCap}</div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <div className="text-sm text-muted-foreground">Holders</div>
                    <div className="font-semibold text-foreground">{token.holders}</div>
                  </div>
                </div>
                
                {token.hasDistributor && (
                  <div className="border-t border-border pt-4">
                    <h4 className="text-lg font-semibold text-gradient-pulse mb-4">Tax Information</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Liquidity Tax</div>
                        <div className="font-semibold text-blue-400">{token.liquidityTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Reflection Tax</div>
                        <div className="font-semibold text-purple-400">{token.reflectionTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Dev Tax</div>
                        <div className="font-semibold text-green-400">{token.devTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Marketing Tax</div>
                        <div className="font-semibold text-orange-400">{token.marketingTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="text-sm text-muted-foreground">Sell Multiplier</div>
                        <div className="font-semibold text-pink-400">{token.sellMultiplier}x</div>
                      </div>
                      {token.rewardToken && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Reward Token</div>
                          <div className="font-semibold text-purple-400">{token.rewardToken}</div>
                        </div>
                      )}
                    </div>
                    {token.distributorAddress && (
                      <div className="mt-4">
                        <AddressDisplay 
                          address={token.distributorAddress} 
                          label="Distributor Address"
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                )}
                
                {token.wrappedToken && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="bg-muted/50 p-3 rounded-lg inline-block">
                      <div className="text-sm text-muted-foreground">Wrapped Token</div>
                      <div className="font-semibold text-indigo-400">{token.wrappedToken}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokensPage;
