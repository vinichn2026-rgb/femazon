import fs from 'fs';

interface ProductItem {
  id: number;
  name: string;
  slug: string;
  category: string | null;
  subcategory: string | null;
  dressType: string | null;
  image: string | null;
  description: string | null;
}

const data: ProductItem[] = JSON.parse(fs.readFileSync('scratch-catalog.json', 'utf8'));

console.log(`Total Products: ${data.length}`);

const tsvLines = [
  ['ID', 'Name', 'Category', 'Subcategory', 'DressType', 'Image'].join('\t'),
  ...data.map(it => [
    it.id,
    it.name,
    it.category || '',
    it.subcategory || '',
    it.dressType || '',
    it.image || ''
  ].join('\t'))
];

fs.writeFileSync('scratch-table.tsv', tsvLines.join('\n'));
console.log('Wrote scratch-table.tsv with', tsvLines.length, 'lines');
