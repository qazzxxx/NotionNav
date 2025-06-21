import { NotionAPI } from "notion-client";

// you can optionally pass an authToken to access private notion resources
const api = new NotionAPI();

export default async function handler(req, res) {
  // fetch a page's content, including all async blocks, collection queries, and signed urls
  const page = await api.getPage("219692535678800fbefffd8ae6924454");

  console.log(page);

  res.status(200).json({ page });
}
