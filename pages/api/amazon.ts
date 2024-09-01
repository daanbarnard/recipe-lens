import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import crypto from 'crypto';

const AMAZON_ACCESS_KEY = process.env.AMAZON_ACCESS_KEY;
const AMAZON_SECRET_KEY = process.env.AMAZON_SECRET_KEY;
const AMAZON_PARTNER_TAG = process.env.AMAZON_PARTNER_TAG;
const AMAZON_HOST = 'webservices.amazon.com';
const AMAZON_REGION = 'us-east-1';
const AMAZON_URI = '/paapi5/searchitems';

// Base64 encoded placeholder image
const placeholderImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFyGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA5LTAxVDA4OjUxOjE1KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA5LTAxVDA4OjUxOjE1KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wOS0wMVQwODo1MToxNSswMjowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowZWNiYjc4Ny01OGEzLTI1NDAtYjI2Ny1kNzVjZTQzZmYyMzQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5NDZhZWYzNC01NjUzLTExNGQtOGFl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';

// Fallback product data
const fallbackProducts = [
  {
    ASIN: 'B07WSYPS5H',
    DetailPageURL: 'https://www.amazon.com/dp/B07WSYPS5H',
    Images: { Primary: { Medium: { URL: placeholderImage } } },
    ItemInfo: { Title: { DisplayValue: 'Kitchen Knife Set' } },
    Offers: { Listings: [{ Price: { DisplayAmount: '$39.99' } }] }
  },
  {
    ASIN: 'B08BZCRX5L',
    DetailPageURL: 'https://www.amazon.com/dp/B08BZCRX5L',
    Images: { Primary: { Medium: { URL: placeholderImage } } },
    ItemInfo: { Title: { DisplayValue: 'Cooking Pot Set' } },
    Offers: { Listings: [{ Price: { DisplayAmount: '$59.99' } }] }
  },
  {
    ASIN: 'B07WNK3HHB',
    DetailPageURL: 'https://www.amazon.com/dp/B07WNK3HHB',
    Images: { Primary: { Medium: { URL: placeholderImage } } },
    ItemInfo: { Title: { DisplayValue: 'Mixing Bowl Set' } },
    Offers: { Listings: [{ Price: { DisplayAmount: '$24.99' } }] }
  }
];

interface AmazonProduct {
  ASIN: string;
  DetailPageURL: string;
  Images: {
    Primary: {
      Large: { URL: string };
      Medium: { URL: string };
    };
  };
  ItemInfo: {
    Title: { DisplayValue: string };
  };
  Offers: {
    Listings: Array<{
      Price: { DisplayAmount: string };
    }>;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Received request:', req.method, req.url);

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = req.method === 'GET' ? req.query.query : req.body.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  if (!AMAZON_ACCESS_KEY || !AMAZON_SECRET_KEY || !AMAZON_PARTNER_TAG) {
    console.error('Missing required Amazon API credentials');
    return res.status(500).json({ error: 'Server configuration error', fallbackData: fallbackProducts });
  }

  try {
    const timestamp = new Date().toISOString().replace(/\.\d{3}/, '');
    const date = timestamp.slice(0, 8);
    const payload = {
      'Marketplace': 'www.amazon.com',
      'PartnerType': 'Associates',
      'PartnerTag': AMAZON_PARTNER_TAG,
      'Keywords': `${query} kitchen`,
      'SearchIndex': 'All',
      'ItemCount': 3,
      'Resources': ['Images.Primary.Large', 'ItemInfo.Title', 'Offers.Listings.Price']
    };

    const payloadString = JSON.stringify(payload);

    const canonicalHeaders = [
      `content-encoding:amz-1.0`,
      `content-type:application/json; charset=UTF-8`,
      `host:${AMAZON_HOST}`,
      `x-amz-date:${timestamp}`,
      `x-amz-target:com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems`
    ].join('\n');

    const signedHeaders = 'content-encoding;content-type;host;x-amz-date;x-amz-target';

    const canonicalRequest = [
      'POST',
      AMAZON_URI,
      '',
      canonicalHeaders,
      '',
      signedHeaders,
      crypto.createHash('sha256').update(payloadString).digest('hex')
    ].join('\n');

    const credentialScope = `${date}/${AMAZON_REGION}/ProductAdvertisingAPI/aws4_request`;
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      timestamp,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n');

    const signingKey = getSignatureKey(AMAZON_SECRET_KEY, date, AMAZON_REGION, 'ProductAdvertisingAPI');
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

    const authorizationHeader = [
      `AWS4-HMAC-SHA256 Credential=${AMAZON_ACCESS_KEY}/${credentialScope}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`
    ].join(', ');

    console.log('Request URL:', `https://${AMAZON_HOST}${AMAZON_URI}`);
    console.log('Authorization Header:', authorizationHeader);
    console.log('Payload:', payloadString);

    const response = await axios.post(`https://${AMAZON_HOST}${AMAZON_URI}`, payloadString, {
      headers: {
        'Authorization': authorizationHeader,
        'Content-Encoding': 'amz-1.0',
        'Content-Type': 'application/json; charset=UTF-8',
        'Host': AMAZON_HOST,
        'X-Amz-Date': timestamp,
        'X-Amz-Target': 'com.amazon.paapi5.v1.ProductAdvertisingAPIv1.SearchItems'
      }
    });

    console.log('Amazon API Response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.SearchResult && response.data.SearchResult.Items) {
      const items = response.data.SearchResult.Items.map((item: AmazonProduct) => ({
        ...item,
        Images: {
          ...item.Images,
          Primary: {
            ...item.Images.Primary,
            Medium: {
              ...item.Images.Primary.Medium,
              URL: item.Images.Primary.Large.URL || placeholderImage
            }
          }
        }
      }));
      res.status(200).json(items);
    } else {
      console.error('Unexpected response structure:', response.data);
      res.status(500).json({ error: 'Unexpected response structure from Amazon API', fallbackData: fallbackProducts });
    }
  } catch (error) {
    console.error('Error fetching Amazon products:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', error.response?.data);
      console.error('Axios error status:', error.response?.status);
      console.error('Axios error headers:', error.response?.headers);
    }
    res.status(500).json({ 
      error: 'Failed to fetch Amazon products', 
      details: error instanceof Error ? error.message : 'Unknown error',
      fallbackData: fallbackProducts 
    });
  }
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  const kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  const kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  const kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}