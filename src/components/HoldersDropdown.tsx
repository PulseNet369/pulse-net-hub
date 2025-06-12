
import { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddressDisplay } from "@/components/AddressDisplay";
import { fetchHolders, formatHolderBalance, calculateSupplyOwned } from "../services/holderService";

interface Holder {
  address: string;
  value: string;
}

interface HoldersDropdownProps {
  totalSupply: string;
  holderCount: number;
}

export function HoldersDropdown({ totalSupply, holderCount }: HoldersDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [holders, setHolders] = useState<Holder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageInput, setPageInput] = useState("1");

  const loadHolders = async (page: number) => {
    setIsLoading(true);
    try {
      const { holders: fetchedHolders, hasMore: more } = await fetchHolders(page, 10);
      setHolders(fetchedHolders);
      setHasMore(more);
      setCurrentPage(page);
      setPageInput(page.toString());
    } catch (error) {
      console.error('Error loading holders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && holders.length === 0) {
      loadHolders(1);
    }
  }, [isOpen]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      loadHolders(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    loadHolders(currentPage + 1);
  };

  const handlePageJump = () => {
    const pageNum = parseInt(pageInput, 10);
    if (pageNum > 0) {
      loadHolders(pageNum);
    }
  };

  const handlePageInputChange = (value: string) => {
    setPageInput(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePageJump();
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-auto p-1 hover:bg-muted/50"
        >
          <span className="text-xs">{holderCount.toLocaleString()}</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-4 bg-card border-pink-500/20" align="start">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gradient-pulse">Token Holders</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage <= 1 || isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={pageInput}
                  onChange={(e) => handlePageInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-16 h-8 text-center text-xs"
                  min="1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePageJump}
                  disabled={isLoading}
                  className="h-8 text-xs px-2"
                >
                  Go
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={isLoading}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-muted/50 h-12 rounded"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {holders.map((holder, index) => (
                <div key={holder.address} className="bg-muted/30 p-3 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">#{(currentPage - 1) * 10 + index + 1}</span>
                    <span className="text-xs text-purple-400">
                      {calculateSupplyOwned(holder.value, totalSupply)}% owned
                    </span>
                  </div>
                  <AddressDisplay 
                    address={holder.address} 
                    showLabel={false}
                    className="text-sm"
                  />
                  <div className="text-sm font-semibold text-foreground">
                    {formatHolderBalance(holder.value)} PLSN
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-xs text-muted-foreground text-center">
            Page {currentPage} • Total Holders: {holderCount.toLocaleString()}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
