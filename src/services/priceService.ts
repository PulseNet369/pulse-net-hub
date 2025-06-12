
interface GraphQLBlock {
  number: number;
}

interface GraphQLToken {
  derivedPLS: string;
  derivedUSD: string;
}

interface GraphQLResponse {
  data?: {
    _meta?: {
      block?: GraphQLBlock;
    };
    token?: GraphQLToken;
  };
  errors?: Array<{ message: string }>;
}

interface TokenPrice {
  derivedPLS: number;
  derivedUSD: number;
  block: number;
}

interface PriceData {
  current: TokenPrice;
  previous: TokenPrice;
  plsChange24h: number;
  usdChange24h: number;
}

const gqlEndpoints = {
  v2: "https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsexv2",
  v1: "https://graph.pulsechain.com/subgraphs/name/pulsechain/pulsex"
};

const BLOCKS_24H = 8640; // Approximately 24 hours in 10s blocks

async function executeGraphQLQuery(query: string, endpoint: string): Promise<GraphQLResponse> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function getCurrentBlock(): Promise<number> {
  const query = `
    query MyQuery {
      _meta {
        block {
          number
        }
      }
    }
  `;

  // Try v2 first, then v1 if v2 fails
  for (const [version, endpoint] of Object.entries(gqlEndpoints)) {
    try {
      console.log(`Fetching current block from ${version}...`);
      const response = await executeGraphQLQuery(query, endpoint);
      
      if (response.data?._meta?.block?.number) {
        console.log(`Current block from ${version}:`, response.data._meta.block.number);
        return response.data._meta.block.number;
      }
    } catch (error) {
      console.error(`Error fetching current block from ${version}:`, error);
      if (version === 'v1') {
        throw new Error('Failed to fetch current block from both endpoints');
      }
    }
  }

  throw new Error('No valid block data received from any endpoint');
}

async function getTokenPriceAtBlock(tokenAddress: string, blockNumber: number): Promise<TokenPrice | null> {
  const query = `
    query MyQuery {
      _meta {
        block {
          number
        }
      }
      token(
        id: "${tokenAddress.toLowerCase()}"
        block: {number: ${blockNumber}}
      ) {
        derivedPLS
        derivedUSD
      }
    }
  `;

  // Try v2 first, then v1 if v2 fails
  for (const [version, endpoint] of Object.entries(gqlEndpoints)) {
    try {
      console.log(`Fetching token price from ${version} at block ${blockNumber} for ${tokenAddress}...`);
      const response = await executeGraphQLQuery(query, endpoint);
      
      console.log(`GraphQL response from ${version}:`, JSON.stringify(response, null, 2));
      
      if (response.errors) {
        console.error(`GraphQL errors from ${version}:`, response.errors);
      }
      
      if (response.data?.token) {
        const token = response.data.token;
        console.log(`Found token data from ${version}:`, token);
        return {
          derivedPLS: parseFloat(token.derivedPLS || '0'),
          derivedUSD: parseFloat(token.derivedUSD || '0'),
          block: blockNumber
        };
      } else {
        console.warn(`No token data found in ${version} response for ${tokenAddress}`);
      }
    } catch (error) {
      console.error(`Error fetching token price from ${version}:`, error);
      if (version === 'v1') {
        console.warn(`No price data found for token ${tokenAddress} at block ${blockNumber} in any endpoint`);
        return null;
      }
    }
  }

  return null;
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

function formatPrice(price: number): string {
  if (price === 0) return '0.00000000';
  
  // For very small numbers, use scientific notation
  if (price < 0.00000001) {
    return price.toExponential(2);
  }
  
  // Cap at 8 decimal places
  return price.toFixed(8);
}

function formatPercentageChange(change: number): string {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
}

export async function fetchTokenPrice(tokenAddress: string): Promise<PriceData | null> {
  try {
    console.log(`Fetching price data for token: ${tokenAddress}`);
    
    // Get current block
    const currentBlock = await getCurrentBlock();
    const previousBlock = currentBlock - BLOCKS_24H;
    
    console.log(`Current block: ${currentBlock}, Previous block (24h ago): ${previousBlock}`);
    
    // Fetch current and previous prices
    const [currentPrice, previousPrice] = await Promise.all([
      getTokenPriceAtBlock(tokenAddress, currentBlock),
      getTokenPriceAtBlock(tokenAddress, previousBlock)
    ]);
    
    console.log(`Price results for ${tokenAddress}:`, { currentPrice, previousPrice });
    
    if (!currentPrice) {
      console.warn(`No current price data found for token ${tokenAddress}`);
      return null;
    }
    
    // Use current price as fallback if previous price is not available
    const prevPrice = previousPrice || currentPrice;
    
    const plsChange24h = calculatePercentageChange(currentPrice.derivedPLS, prevPrice.derivedPLS);
    const usdChange24h = calculatePercentageChange(currentPrice.derivedUSD, prevPrice.derivedUSD);
    
    return {
      current: currentPrice,
      previous: prevPrice,
      plsChange24h,
      usdChange24h
    };
  } catch (error) {
    console.error('Error fetching token price:', error);
    return null;
  }
}

export { formatPrice, formatPercentageChange };
