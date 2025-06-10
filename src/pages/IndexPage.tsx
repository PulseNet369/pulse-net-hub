
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock address data
const mockAddresses = [
  {
    id: 1,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    category: "Token Holder",
    tags: ["Large Holder", "Early Adopter"],
    name: "Whale #1",
    balance: "156,234 ECO",
    percentage: "12.5%",
    lastActive: "2024-01-15"
  },
  {
    id: 2,
    address: "0x2345678901bcdef12345678901bcdef123456789",
    category: "Liquidity Pool",
    tags: ["ECO/PLS Pool", "High Volume"],
    name: "ECO-PLS LP",
    balance: "$1.2M TVL",
    percentage: "N/A",
    lastActive: "2024-01-15"
  },
  {
    id: 3,
    address: "0x3456789012cdef123456789012cdef1234567890",
    category: "Smart Contract",
    tags: ["Reward Distributor", "Ecosystem"],
    name: "Reward Contract",
    balance: "45,678 PLS",
    percentage: "N/A",
    lastActive: "2024-01-14"
  },
  {
    id: 4,
    address: "0x4567890123def1234567890123def12345678901",
    category: "Dev Wallet",
    tags: ["Team", "Developer"],
    name: "Dev Wallet #1",
    balance: "23,456 ECO",
    percentage: "1.9%",
    lastActive: "2024-01-13"
  }
];

const categories = ["All", "Token Holder", "Liquidity Pool", "Smart Contract", "Dev Wallet", "Marketing Wallet", "OA Address"];

const IndexPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredAddresses, setFilteredAddresses] = useState(mockAddresses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address: "",
    category: "",
    name: "",
    tags: "",
    notes: ""
  });

  const handleSearch = () => {
    let filtered = mockAddresses;

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

  const handleAddAddress = () => {
    // In a real app, this would make an API call to save the address
    console.log("Adding address:", newAddress);
    setIsAddDialogOpen(false);
    setNewAddress({ address: "", category: "", name: "", tags: "", notes: "" });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Ecosystem Address Index</h1>
        <p className="text-muted-foreground mb-6">
          Search and filter all addresses related to the ecosystem including holders, contracts, and liquidity pools
        </p>
        
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <Input
            placeholder="Search by address, name, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-48">
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
          <Button onClick={handleSearch}>Search</Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Address</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="0x..."
                    value={newAddress.address}
                    onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newAddress.category} onValueChange={(value) => setNewAddress({...newAddress, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="name">Name (optional)</Label>
                  <Input
                    id="name"
                    placeholder="Friendly name"
                    value={newAddress.name}
                    onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="tag1, tag2, tag3"
                    value={newAddress.tags}
                    onChange={(e) => setNewAddress({...newAddress, tags: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes..."
                    value={newAddress.notes}
                    onChange={(e) => setNewAddress({...newAddress, notes: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddAddress} className="w-full">
                  Add Address
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredAddresses.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    {item.name}
                    <Badge variant="outline" className="ml-2">
                      {item.category}
                    </Badge>
                  </CardTitle>
                  <div className="font-mono text-sm text-muted-foreground mb-2">
                    {item.address}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right mt-4 sm:mt-0">
                  <div className="font-semibold">{item.balance}</div>
                  {item.percentage !== "N/A" && (
                    <div className="text-sm text-muted-foreground">{item.percentage}</div>
                  )}
                  <div className="text-xs text-muted-foreground mt-1">
                    Last active: {item.lastActive}
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
        </div>
      )}
    </div>
  );
};

export default IndexPage;
