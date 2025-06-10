
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const InfoPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ecosystem Information</h1>

        {/* About Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About the PulseChain Tax Token Ecosystem</CardTitle>
            <CardDescription>
              Understanding our decentralized ecosystem of tax tokens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The PulseChain Tax Token Ecosystem is a comprehensive platform designed to track, 
              analyze, and manage tax tokens built on the PulseChain network. Our ecosystem 
              provides transparency and insights into token performance, holder distributions, 
              and reward mechanisms.
            </p>
            <p className="text-muted-foreground">
              Tax tokens implement automatic redistribution mechanisms that reward holders 
              through various means including reflection, buybacks, and external token rewards. 
              This creates a sustainable ecosystem that benefits long-term participants.
            </p>
          </CardContent>
        </Card>

        {/* Key Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Token Analytics</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive tracking of token metrics including price, volume, 
                  holder count, and tax distribution analytics.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Address Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Complete address indexing system for tracking holders, contracts, 
                  liquidity pools, and ecosystem participants.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Liquidity Monitoring</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Real-time liquidity pool tracking with APR calculations, 
                  volume analytics, and fee distribution data.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Reward Tracking</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor reward token distributions, claim histories, 
                  and yield calculations across the ecosystem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Categories */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Token Categories</CardTitle>
            <CardDescription>
              Different types of tokens in our ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge>Reflection Tokens</Badge>
              <span className="text-sm text-muted-foreground">
                Automatically redistribute a percentage of transactions to holders
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Reward Tokens</Badge>
              <span className="text-sm text-muted-foreground">
                Distribute external tokens (PLS, HEX, USDC) as rewards
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Buyback Tokens</Badge>
              <span className="text-sm text-muted-foreground">
                Use tax revenue for automatic token buybacks and burns
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="destructive">Hybrid Tokens</Badge>
              <span className="text-sm text-muted-foreground">
                Combine multiple tax mechanisms for enhanced utility
              </span>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Tax Tokens Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">1. Transaction Tax</h3>
              <p className="text-sm text-muted-foreground">
                Each transaction (buy/sell) incurs a tax percentage (typically 3-10%) 
                that is automatically collected by the smart contract.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">2. Tax Distribution</h3>
              <p className="text-sm text-muted-foreground">
                The collected tax is distributed according to the token's mechanism: 
                reflection to holders, reward token purchases, or buyback and burn.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">3. Automatic Rewards</h3>
              <p className="text-sm text-muted-foreground">
                Holders automatically receive rewards without any action required. 
                Rewards accumulate in real-time and can be claimed when desired.
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">4. Ecosystem Growth</h3>
              <p className="text-sm text-muted-foreground">
                As trading volume increases, more rewards are generated, creating 
                a positive feedback loop that benefits the entire ecosystem.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Important Links */}
        <Card>
          <CardHeader>
            <CardTitle>Important Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">PulseChain Network</h3>
                <p className="text-sm text-muted-foreground">
                  Official PulseChain documentation and resources
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Smart Contract Audits</h3>
                <p className="text-sm text-muted-foreground">
                  Security audit reports for ecosystem tokens
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Community Discord</h3>
                <p className="text-sm text-muted-foreground">
                  Join our community for support and updates
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Developer Documentation</h3>
                <p className="text-sm text-muted-foreground">
                  Technical documentation for developers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InfoPage;
