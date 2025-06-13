
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddressDisplay } from "@/components/AddressDisplay";
import { addressList, AddressEntry } from "@/data/addressList";

const categories = ["All", "Token Holder", "Liquidity Pool", "Smart Contract", "Dev Wallet", "Marketing Wallet", "OA Address"];

const IndexPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredAddresses, setFilteredAddresses] = useState<AddressEntry[]>(addressList);

  // Update filtered addresses when search term or category changes
  useEffect(() => {
    handleSearch();
  }, [searchTerm, selectedCategory]);

  const handleSearch = () => {
    let filtered = addressList;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    setFilteredAddresses(filtered);
  };

  return (
    <div className="min-w-0 w-full overflow-x-hidden">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Ecosystem Address Index</h1>
          <p className="text-muted-foreground mb-6">
            Search and filter all addresses related to the ecosystem including holders, contracts, and liquidity pools
          </p>
          
          <div className="flex flex-col gap-4 mb-6">
            <div className="w-full">
              <Input
                placeholder="Search by address, name, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch} className="w-full sm:w-auto">Search</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredAddresses.map((item) => (
            <Card key={item.id} className="min-w-0">
              <CardHeader>
                <div className="flex flex-col gap-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-2 flex flex-wrap items-center gap-2">
                      <span className="break-words">{item.name}</span>
                      <Badge variant="outline">
                        {item.category}
                      </Badge>
                    </CardTitle>
                    <div className="mb-3">
                      <AddressDisplay 
                        address={item.address} 
                        label=""
                        showLabel={false}
                      />
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {filteredAddresses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No addresses found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Total addresses: {addressList.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
