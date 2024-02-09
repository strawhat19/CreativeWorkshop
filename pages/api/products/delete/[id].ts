import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const productId = req.query.id;

  try {
    const storeName = process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME || process.env.SHOPIFY_STORE_NAME;
    const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_API_VERSION || process.env.SHOPIFY_API_VERSION;
    const accessToken = process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN || process.env.SHOPIFY_ACCESS_TOKEN;
    const shopifyURL = `https://${storeName}.myshopify.com/admin/api/${apiVersion}/products/${productId}.json`;

    const shopifyResponse = await fetch(shopifyURL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      }
    });

    if (!shopifyResponse.ok) {
      console.log(`Error deleting product: ${shopifyResponse.statusText}`);
      return res.status(shopifyResponse.status).json({error: `Error deleting product: ${shopifyResponse.statusText}`});
    }

    const data = await shopifyResponse.json();
    res.status(200).json(data);
  } catch (error) {
    console.log(`Error Deleting Product:`, error);
    res.status(500).send(`Error Deleting Product`);
  }
}