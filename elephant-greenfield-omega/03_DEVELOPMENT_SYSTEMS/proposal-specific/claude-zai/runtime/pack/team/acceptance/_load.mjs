// Loads a product module from the directory named by PFM_PRODUCT (the arm's or entrant's product/ dir).
// Shared by the public acceptance suites, the sealed oracles and the evaluator's probes.
import { existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function loadProduct(rel) {
  const root = process.env.PFM_PRODUCT;
  if (!root) throw new Error('Set PFM_PRODUCT to the product directory, e.g. PFM_PRODUCT=arms/R0-A1/product node --test <suite>');
  const file = resolve(join(root, rel));
  if (!existsSync(file)) throw new Error(`product module not found: ${file} (contract path ${rel})`);
  return import(pathToFileURL(file).href);
}
