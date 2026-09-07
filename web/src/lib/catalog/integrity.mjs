/** @param {string} value */
const normalized = (value) => value.normalize("NFKC").trim().replace(/\s+/gu, " ").toLocaleLowerCase("ru");

/**
 * Validate references across the document catalog; embedded product attributes
 * intentionally remain with their owning product, not separate lookup tables.
 * @param {{ products: import('./schema').Product[], brands: import('./schema').Brand[], gases: import('./schema').Gas[] }} catalog
 * @returns {string[]}
 */
export function catalogIssues({ products, brands, gases }) {
  const issues = [];
  /** @param {string[]} values @param {string} label */
  function unique(values, label) {
    const seen = new Set();
    for (const value of values) {
      const key = normalized(value);
      if (seen.has(key)) issues.push(`${label}: duplicate ${value}`);
      seen.add(key);
    }
  }
  unique(brands.map((item) => item.id), "brands.id");
  unique(brands.map((item) => item.name), "brands.name");
  unique(gases.map((item) => item.id), "gases.id");
  unique(gases.map((item) => item.formula), "gases.formula");
  unique(products.map((item) => item.id), "products.id");
  unique(products.map((item) => item.slug), "products.slug");
  unique(products.map((item) => `${normalized(item.brandId)}:${normalized(item.model)}`), "products.brand/model");
  unique(products.map((item) => item.seo.title), "products.seo.title");
  unique(products.map((item) => item.seo.description), "products.seo.description");
  const brandIds = new Set(brands.map((item) => item.id));
  const gasIds = new Set(gases.map((item) => item.id));
  for (const product of products) {
    const prefix = product.slug;
    if (!brandIds.has(product.brandId)) issues.push(`${prefix}: unknown brand ${product.brandId}`);
    unique(product.gases, `${prefix}.gases`);
    unique(product.modifications.map((item) => item.id), `${prefix}.modifications`);
    unique(product.media.map((item) => item.url), `${prefix}.media`);
    unique(product.documents.map((item) => item.url), `${prefix}.documents`);
    for (const id of product.gases) {
      if (!gasIds.has(id)) issues.push(`${prefix}: unknown gas ${id}`);
    }
    for (const range of product.ranges) {
      if (!product.gases.includes(range.gasId)) issues.push(`${prefix}: range gas ${range.gasId} not in product gases`);
    }
    for (const modification of product.modifications) {
      unique(modification.gases, `${prefix}.${modification.id}.gases`);
      for (const id of modification.gases) {
        if (!product.gases.includes(id)) issues.push(`${prefix}: modification gas ${id} not in product gases`);
      }
    }
    for (const source of product.sources) {
      if (!source.url && !source.document) issues.push(`${prefix}: source lacks URL or document`);
    }
    for (const item of [...product.media, ...product.documents]) {
      if (!assetPath(item.url) && !externalAsset(item.url)) issues.push(`${prefix}: unsafe asset URL ${item.url}`);
    }
  }
  return issues;
}

/** Return a safe public-relative path, or null for external/invalid URLs.
 * @param {string} url
 * @returns {string | null}
 */
export function assetPath(url) {
  if (!url.startsWith("/") || url.startsWith("//")) return null;
  try {
    const value = decodeURIComponent(url.split(/[?#]/u)[0]);
    if (/[\\\u0000-\u001f:]/u.test(value) || value.startsWith("//") || value.split("/").some((part) => part === ".." || part === ".")) return null;
    return value.slice(1) || null;
  } catch {
    return null;
  }
}

/** @param {string} value */
function externalAsset(value) {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !!url.hostname && !url.username && !url.password;
  } catch {
    return false;
  }
}
