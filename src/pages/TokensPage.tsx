import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddressDisplay } from "@/components/AddressDisplay";
import { HoldersDropdown } from "@/components/HoldersDropdown";
import { fetchTokenData } from "../utils/blockchain";
import { fetchTokenPrice, formatPrice, formatPercentageChange } from "../services/priceService";
import { fetchHolderCount } from "../services/holderService";
import { TokenData } from "../types/token";
import { TOKEN_LIST } from "../data/tokenList";

const PLSN_TOKEN_ADDRESS = "0xf651e3978f1f6ec38a6da6014caa6aa07fbae453";

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
          const [tokenData, priceData, holderCount] = await Promise.all([
            fetchTokenData(tokenConfig),
            fetchTokenPrice(tokenConfig.address),
            fetchHolderCount(tokenConfig.address)
          ]);
          
          const totalSupplyNum = parseFloat(tokenData.totalSupply || "0");
          
          // Use real price data if available, otherwise display N/A
          let priceUSD: string;
          let pricePLS: string;
          let change24hUSD: string;
          let change24hPLS: string;
          let marketCapUSD: string;
          let marketCapPLS: string;
          
          if (priceData && priceData.current.derivedUSD > 0) {
            const usdPrice = priceData.current.derivedUSD;
            const plsPrice = priceData.current.derivedPLS;
            const usdChange = priceData.usdChange24h;
            const plsChange = priceData.plsChange24h;
            
            priceUSD = `$${formatPrice(usdPrice)}`;
            pricePLS = `${formatPrice(plsPrice)}`;
            change24hUSD = formatPercentageChange(usdChange);
            change24hPLS = formatPercentageChange(plsChange);
            marketCapUSD = `$${(usdPrice * totalSupplyNum).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
            marketCapPLS = `${formatPrice(plsPrice * totalSupplyNum)} PLS`;
          } else {
            priceUSD = "N/A";
            pricePLS = "N/A";
            change24hUSD = "N/A";
            change24hPLS = "N/A";
            marketCapUSD = "N/A";
            marketCapPLS = "N/A";
          }
          
          return {
            id: `token-${index}`,
            ...tokenData,
            hasDistributor: tokenConfig.hasDistributor,
            priceUSD,
            pricePLS,
            change24hUSD,
            change24hPLS,
            marketCapUSD,
            marketCapPLS,
            holders: holderCount, // Use the API holder count
            rawPriceData: priceData,
          } as TokenData & { 
            priceUSD: string; 
            pricePLS: string; 
            change24hUSD: string; 
            change24hPLS: string; 
            marketCapUSD: string; 
            marketCapPLS: string;
            rawPriceData: any;
          };
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
            priceUSD: "N/A",
            pricePLS: "N/A",
            change24hUSD: "N/A",
            change24hPLS: "N/A",
            marketCapUSD: "N/A",
            marketCapPLS: "N/A",
            holders: 0,
          } as TokenData & { 
            priceUSD: string; 
            pricePLS: string; 
            change24hUSD: string; 
            change24hPLS: string; 
            marketCapUSD: string; 
            marketCapPLS: string;
          };
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
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-pink-500/20 card-gradient">
                <CardHeader className="pb-3">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {[...Array(6)].map((_, j) => (
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

        <div className="grid gap-4">
          {filteredTokens.map((token) => (
            <Card key={token.id} className="border-pink-500/20 card-gradient hover:shadow-lg hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-gradient-hex text-lg md:text-xl">
                        {token.name} ({token.symbol})
                      </span>
                      {token.hasDistributor && token.totalTax !== undefined && (
                        <Badge variant="secondary" className="bg-pink-500/20 text-pink-300 border-pink-500/30 shrink-0 text-xs">
                          Total Tax: {token.totalTax}%
                        </Badge>
                      )}
                      {!token.hasDistributor && (
                        <Badge variant="outline" className="border-purple-400/50 text-purple-300 shrink-0 text-xs">
                          Standard Token
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mb-2">
                      <AddressDisplay 
                        address={token.address} 
                        showLabel={false}
                        className="w-full"
                      />
                    </CardDescription>
                  </div>
                  <div className="text-right lg:min-w-[200px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 justify-end">
                        <div className="text-lg md:text-xl font-bold text-gradient-pulse">
                          {token.priceUSD}
                        </div>
                        {token.change24hUSD !== "N/A" && (
                          <div className={`text-sm font-semibold ${token.change24hUSD?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change24hUSD}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <div className="text-sm font-bold text-purple-300">
                          {token.pricePLS} {token.pricePLS !== "N/A" && "PLS"}
                        </div>
                        {token.change24hPLS !== "N/A" && (
                          <div className={`text-xs font-semibold ${token.change24hPLS?.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {token.change24hPLS}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
                  <div className="bg-muted/50 p-2 rounded-lg">
                    <div className="text-xs text-muted-foreground">Total Supply</div>
                    <div className="font-semibold text-foreground text-sm">{parseFloat(token.totalSupply).toLocaleString()}</div>
                  </div>
                  {token.burnedSupply && (
                    <div className="bg-muted/50 p-2 rounded-lg">
                      <div className="text-xs text-muted-foreground">Burned Supply</div>
                      <div className="font-semibold text-red-400 text-sm">{parseFloat(token.burnedSupply).toLocaleString()}</div>
                    </div>
                  )}
                  <div className="bg-muted/50 p-2 rounded-lg">
                    <div className="text-xs text-muted-foreground">Market Cap (USD)</div>
                    <div className="font-semibold text-foreground text-sm">{token.marketCapUSD}</div>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-lg">
                    <div className="text-xs text-muted-foreground">Market Cap (PLS)</div>
                    <div className="font-semibold text-purple-300 text-sm">{token.marketCapPLS}</div>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-lg">
                    <div className="text-xs text-muted-foreground">Holders</div>
                    <div className="font-semibold text-foreground text-sm flex items-center gap-1">
                      <HoldersDropdown 
                        totalSupply={token.totalSupply} 
                        holderCount={token.holders || 0}
                        tokenAddress={token.address}
                      />
                    </div>
                  </div>
                  {token.rewardToken && (
                    <div className="bg-muted/50 p-2 rounded-lg">
                      <div className="text-xs text-muted-foreground">Reward Token</div>
                      <div className="font-semibold text-purple-400 text-sm">{token.rewardToken}</div>
                    </div>
                  )}
                  {token.wrappedToken && (
                    <div className="bg-muted/50 p-2 rounded-lg">
                      <div className="text-xs text-muted-foreground">Wrapped Token</div>
                      <div className="font-semibold text-indigo-400 text-sm">{token.wrappedToken}</div>
                    </div>
                  )}
                </div>
                
                {token.hasDistributor && (
                  <div className="border-t border-border pt-3">
                    <h4 className="text-base font-semibold text-gradient-pulse mb-3">Tax Information</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Liquidity Tax</div>
                        <div className="font-semibold text-blue-400 text-sm">{token.liquidityTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Reflection Tax</div>
                        <div className="font-semibold text-purple-400 text-sm">{token.reflectionTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Dev Tax</div>
                        <div className="font-semibold text-green-400 text-sm">{token.devTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Marketing Tax</div>
                        <div className="font-semibold text-orange-400 text-sm">{token.marketingTax}%</div>
                      </div>
                      <div className="bg-muted/50 p-2 rounded-lg">
                        <div className="text-xs text-muted-foreground">Sell Multiplier</div>
                        <div className="font-semibold text-pink-400 text-sm">{token.sellMultiplier}x</div>
                      </div>
                    </div>
                    {token.distributorAddress && (
                      <div className="mt-3">
                        <AddressDisplay 
                          address={token.distributorAddress} 
                          label="Distributor Address"
                          className="w-full"
                        />
                      </div>
                    )}
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
