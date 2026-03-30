/**
 * RapidAPI Service - Real product search from Shopee, Lazada, Google, TikTok
 */

const https = require('https');
const { URL } = require('url');

class RapidAPIService {
  /**
   * Make RapidAPI request
   */
  static async makeRequest(url, apiKey, apiHost) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      
      const options = {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost
        }
      };

      console.log(`📡 Making request to: ${url}`);

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            if (res.statusCode !== 200) {
              console.error(`❌ API returned status ${res.statusCode}:`, data);
              resolve(null);
              return;
            }
            const parsed = JSON.parse(data);
            console.log(`✅ API response received`);
            resolve(parsed);
          } catch (err) {
            console.error('❌ Failed to parse API response:', err.message);
            resolve(null);
          }
        });
      });

      req.on('error', (err) => {
        console.error('❌ API request failed:', err.message);
        resolve(null);
      });

      req.end();
    });
  }

  /**
   * Search Shopee via RapidAPI
   */
  static async searchShopee(query) {
    try {
      console.log('🛍️ Shopee RapidAPI search for:', query);
      
      const apiKey = process.env.RAPIDAPI_KEY;
      const apiHost = process.env.RAPIDAPI_SHOPEE_HOST;
      const endpoint = process.env.RAPIDAPI_SHOPEE_ENDPOINT;

      if (!apiKey || !apiHost || !endpoint) {
        console.log('⚠️ Shopee API not configured');
        return [];
      }

      const url = `${endpoint}?keyword=${encodeURIComponent(query)}&limit=3`;
      const response = await this.makeRequest(url, apiKey, apiHost);

      if (!response || !response.data || !response.data.items) {
        console.log('⚠️ No Shopee results');
        return [];
      }

      // Parse Shopee response
      const products = response.data.items.slice(0, 3).map((item, index) => ({
        id: `shopee-${item.itemid || index}`,
        name: item.name || item.title || 'Shopee Product',
        description: item.description || item.brand || 'Available on Shopee',
        price: item.price ? (item.price / 100000) : 0, // Shopee price is in cents
        rating: item.item_rating ? (item.item_rating.rating_star || 0) : 0,
        shop: item.shop_name || 'Shopee',
        url: `https://shopee.ph/product/${item.shopid}/${item.itemid}`,
        source: 'shopee',
        image_url: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      }));

      console.log(`✅ Found ${products.length} Shopee products`);
      return products;

    } catch (error) {
      console.error('Shopee API error:', error.message);
      return [];
    }
  }

  /**
   * Search Lazada via RapidAPI
   */
  static async searchLazada(query) {
    try {
      console.log('🛒 Lazada RapidAPI search for:', query);
      
      const apiKey = process.env.RAPIDAPI_KEY;
      const apiHost = process.env.RAPIDAPI_LAZADA_HOST;
      const endpoint = process.env.RAPIDAPI_LAZADA_ENDPOINT;

      console.log('API Key:', apiKey ? 'SET' : 'NOT SET');
      console.log('API Host:', apiHost);
      console.log('Endpoint:', endpoint);

      if (!apiKey || !apiHost || !endpoint) {
        console.log('⚠️ Lazada API not configured');
        return [];
      }

      // Use correct parameters: keywords (not keyword), site, page, sort
      const url = `${endpoint}?keywords=${encodeURIComponent(query)}&site=ph&page=1&sort=pop`;
      console.log('Full URL:', url);
      
      const response = await this.makeRequest(url, apiKey, apiHost);

      if (!response) {
        console.log('⚠️ No response from Lazada API');
        return [];
      }

      console.log('📦 Lazada API Response:', JSON.stringify(response, null, 2));

      // Check different possible response structures
      let items = [];
      if (response.data && Array.isArray(response.data)) {
        items = response.data;
      } else if (response.items && Array.isArray(response.items)) {
        items = response.items;
      } else if (response.result && Array.isArray(response.result)) {
        items = response.result;
      } else {
        console.log('⚠️ Unknown response structure');
        console.log('Response keys:', Object.keys(response));
        return [];
      }

      // Parse Lazada response - Show 5 products (still 1 API call!)
      const products = items.slice(0, 3).map((item, index) => {
        console.log(`Parsing item ${index}:`, JSON.stringify(item, null, 2));
        
        return {
          id: `lazada-${item.itemId || item.id || index}`,
          name: item.name || item.title || item.productName || 'Lazada Product',
          description: item.description || item.brand || item.categoryName || 'Available on Lazada',
          price: parseFloat(item.price || item.originalPrice || item.salePrice || 0),
          rating: parseFloat(item.rating || item.ratingScore || item.review || 0),
          shop: item.sellerName || item.seller || item.shopName || 'Lazada',
          url: item.productUrl || item.url || item.link || `https://www.lazada.com.ph/`,
          source: 'lazada',
          image_url: item.image || item.imageUrl || item.thumbnail || item.images?.[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=200&h=200&fit=crop',
        };
      });

      console.log(`✅ Found ${products.length} Lazada products`);
      products.forEach((p, i) => {
        console.log(`Product ${i + 1}: ${p.name} - ₱${p.price}`);
      });
      
      return products;

    } catch (error) {
      console.error('Lazada API error:', error.message);
      console.error('Error stack:', error.stack);
      return [];
    }
  }

  /**
   * Search TikTok Shop via RapidAPI
   */
  static async searchTikTok(query) {
    try {
      console.log('🎵 TikTok Shop RapidAPI search for:', query);
      
      const apiKey = process.env.RAPIDAPI_KEY;
      const apiHost = process.env.RAPIDAPI_TIKTOK_HOST;
      const endpoint = process.env.RAPIDAPI_TIKTOK_ENDPOINT;

      if (!apiKey || !apiHost || !endpoint) {
        console.log('⚠️ TikTok API not configured');
        return [];
      }

      const url = `${endpoint}?keyword=${encodeURIComponent(query)}&limit=3`;
      const response = await this.makeRequest(url, apiKey, apiHost);

      if (!response || !response.data) {
        console.log('⚠️ No TikTok results');
        return [];
      }

      // Parse TikTok response (structure may vary)
      const items = Array.isArray(response.data) ? response.data : response.data.products || [];
      const products = items.slice(0, 3).map((item, index) => ({
        id: `tiktok-${item.product_id || index}`,
        name: item.title || item.name || 'TikTok Shop Product',
        description: item.description || 'Available on TikTok Shop',
        price: parseFloat(item.price || item.sale_price || 0),
        rating: parseFloat(item.rating || 0),
        shop: item.shop_name || 'TikTok Shop',
        url: item.url || `https://www.tiktok.com/`,
        source: 'tiktok',
        image_url: item.image || item.cover || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=200&fit=crop',
      }));

      console.log(`✅ Found ${products.length} TikTok products`);
      return products;

    } catch (error) {
      console.error('TikTok API error:', error.message);
      return [];
    }
  }

  /**
   * Search all platforms
   */
  static async searchAll(query) {
    console.log(`🔍 Searching all platforms for: "${query}"`);
    
    const [shopeeResults, lazadaResults, tiktokResults] = await Promise.all([
      this.searchShopee(query),
      this.searchLazada(query),
      this.searchTikTok(query),
    ]);

    const allResults = [
      ...shopeeResults,
      ...lazadaResults,
      ...tiktokResults,
    ];

    console.log(`📊 Total online results: ${allResults.length}`);
    return allResults;
  }
}

module.exports = RapidAPIService;
