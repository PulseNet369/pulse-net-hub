
import { useState } from "react";
import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AddressDisplayProps {
  address: string;
  label?: string;
  className?: string;
  showLabel?: boolean;
}

export function AddressDisplay({ address, label, className = "", showLabel = true }: AddressDisplayProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address copied!",
        description: "Address has been copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const openInScan = () => {
    window.open(`https://scan.pulsechain.com/address/${address}`, '_blank');
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      {showLabel && label && (
        <div className="text-sm text-muted-foreground">{label}</div>
      )}
      <div className="flex items-center space-x-2 flex-wrap">
        <button
          onClick={openInScan}
          className="font-mono text-xs md:text-sm text-primary hover:text-primary/80 transition-colors break-all cursor-pointer"
          title="View on PulseScan"
        >
          <span className="hidden sm:inline">{address}</span>
          <span className="sm:hidden">{truncateAddress(address)}</span>
        </button>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-6 w-6 p-0 hover:bg-accent"
            title="Copy address"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={openInScan}
            className="h-6 w-6 p-0 hover:bg-accent"
            title="View on PulseScan"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
