import { getSitemapHealthPayload } from '../lib/sitemap.js';

export default function handler(req, res) {
  res.status(200).json(getSitemapHealthPayload());
}
