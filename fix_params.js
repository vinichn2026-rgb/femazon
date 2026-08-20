
const fs = require('fs');
const path = require('path');

const files = [
    'src/app/api/cart/[itemId]/route.ts',
    'src/app/api/orders/[id]/cancel/route.ts',
    'src/app/api/products/[id]/route.ts',
    'src/app/api/seller/orders/[id]/route.ts',
    'src/app/api/seller/products/[id]/route.ts',
    'src/app/api/services/[slug]/route.ts',
    'src/app/api/wardrobe/[id]/route.ts',
    'src/app/api/wishlist/[itemId]/route.ts'
];

files.forEach(f => {
    let p = path.join(process.cwd(), f);
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, 'utf8');

    // Make param type a Promise
    content = content.replace(/\{ params \}: \{ params: \{ ([a-zA-Z0-9_]+): string;? \} \}/g, '{ params }: { params: Promise<{ ' + '' + ': string }> }');
    content = content.replace(/\{ params \}: \{ params: \{ ([a-zA-Z0-9_]+): string, ([a-zA-Z0-9_]+): string;? \} \}/g, '{ params }: { params: Promise<{ ' + '' + ': string, ' + '' + ': string }> }');

    // Also replace without outer { params }
    content = content.replace(/\{ params: \{ ([a-zA-Z0-9_]+): string \} \}/g, '{ params: Promise<{ ' + '' + ': string }> }');

    // Add await
    content = content.replace(/const \{ ([a-zA-Z0-9_]+) \} = params;/g, 'const { ' + '' + ' } = await params;');
    content = content.replace(/params\.([a-zA-Z0-9_]+)/g, '(await params).' + '');
    
    fs.writeFileSync(p, content);
});
console.log('Fixed API params');

