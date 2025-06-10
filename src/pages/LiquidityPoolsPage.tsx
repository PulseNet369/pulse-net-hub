
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock liquidity pool data
const mockPools = [
  {
    id: 1,
    pair: "ECO/PLS",
    address: "0x1234...5678",
    tvl: "$1,234,567",
    volume24h: "$45,678",
    volume7d: "$312,456",
    fees24h: "$1,234",
    apr: "24.5%",
    lpTokens: "1,234,567"
  },
  {
    id: 2,
    pair: "GPULSE/USDC",
    address: "0x2345...6789",
    tvl: "$890,123",
    volume24h: "$23,456",
    volume7d: "$156,789",
    fees24h: "$789",
    apr: "18.2%",
    lpTokens: "890,123"
  },
  {
    id: 3,
    pair: "RMAX/HEX",
    address: "0x3456...7890",
    tvl: "$567,890",
    volume24h: "$12,345",
    volume7d: "$89,234",
    fees24h: "$456",
    apr: "31.7%",
    lpTokens: "567,890"
  },
  {
    id: 4,
    pair: "ECO/USDC",
    address: "0x4567...8901",
    tvl: "$345,678",
    volume24h: "$8,901",
    volume7d: "$62,345",
    fees24h: "$234",
    apr: "15.8%",
    lpTokens: "345,678"
  }
];

const LiquidityPoolsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPools, setFilteredPools] = useState(mockPools);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filtered = mockPools.filter(pool =>
      pool.pair.toLowerCase().includes(value.toLowerCase()) ||
      pool.address.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPools(filtered);
  };

  const totalTVL = mockPools.reduce((sum, pool) => {
    return sum + parseFloat(pool.tvl.replace(/[$,]/g, ''));
  }, 0);

  const total24hVolume = mockPools.reduce((sum, pool) => {
    return sum + parseFloat(pool.volume24h.replace(/[$,]/g, ''));
  }, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Liquidity Pools</h1>
        <p className="text-muted-foreground mb-6">
          Track liquidity pools and their performance across the ecosystem
        </p>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total TVL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalTVL.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${total24hVolume.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Pools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPools.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg APR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22.6%</div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input
            placeholder="Search pools by pair or address..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          <Button>Add Pool</Button>
        </div>
      </div>

      {/* Pools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pool Overview</CardTitle>
          <CardDescription>
            All liquidity pools in the ecosystem with key metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pool</TableHead>
                  <TableHead>TVL</TableHead>
                  <TableHead>24h Volume</TableHead>
                  <TableHead>7d Volume</TableHead>
                  <TableHead>24h Fees</TableHead>
                  <TableHead>APR</TableHead>
                  <TableHead>LP Tokens</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPools.map((pool) => (
                  <TableRow key={pool.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{pool.pair}</div>
                        <div className="text-sm text-muted-foreground font-mono">
                          {pool.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{pool.tvl}</TableCell>
                    <TableCell>{pool.volume24h}</TableCell>
                    <TableCell>{pool.volume7d}</TableCell>
                    <TableCell>{pool.fees24h}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{pool.apr}</Badge>
                    </TableCell>
                    <TableCell>{pool.lpTokens}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {filteredPools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No pools found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default LiquidityPoolsPage;
