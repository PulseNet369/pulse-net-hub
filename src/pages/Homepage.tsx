
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
          PulseChain Tax Token Ecosystem
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Discover, track, and manage tax tokens on the PulseChain network. 
          Your comprehensive platform for ecosystem analytics and insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/tokens">Explore Tokens</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/index">Search Addresses</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Token Discovery</CardTitle>
              <CardDescription>
                Explore all tax tokens in the PulseChain ecosystem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Browse comprehensive token listings with detailed analytics, 
                reward mechanisms, and performance metrics.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/tokens">View Tokens</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Index</CardTitle>
              <CardDescription>
                Search and filter ecosystem addresses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Find holders, contracts, liquidity pairs, and all related addresses 
                with advanced filtering and categorization.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/index">Search Index</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Liquidity Pools</CardTitle>
              <CardDescription>
                Track liquidity pool performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Monitor liquidity pools, trading volumes, and yield opportunities 
                across the ecosystem.
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link to="/liquidity-pools">View Pools</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Ecosystem Stats</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground">Active Tokens</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Total Holders</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">$2.1M</div>
              <div className="text-sm text-muted-foreground">Total Liquidity</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">156</div>
              <div className="text-sm text-muted-foreground">Liquidity Pairs</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
