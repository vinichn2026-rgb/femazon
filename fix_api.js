const fs = require("fs");
const path = require("path");

const files = [
    "src/app/api/products/[id]/route.ts",
    "src/app/api/seller/orders/[id]/route.ts",
    "src/app/api/seller/products/[id]/route.ts",
    "src/app/api/services/[slug]/route.ts",
    "src/app/api/wardrobe/[id]/route.ts",
    "src/app/api/wishlist/[itemId]/route.ts"
];

files.forEach(f => {
    let p = path.join(process.cwd(), f);
    if (!fs.existsSync(p)) return;
    let content = fs.readFileSync(p, "utf8");

    content = content.replace(/\{ params \}: \{ params: \{ ([a-zA-Z0-9_]+): string;? \} \}/g, "{ params }: { params: Promise<{ $$1: string }> }");
    content = content.replace(/const \{ ([a-zA-Z0-9_]+) \} = params;/g, "const { $$1 } = await params;");
    content = content.replace(/params\.([a-zA-Z0-9_]+)/g, "(await params).$$1");
    
    fs.writeFileSync(p, content);
});
console.log("Done fixed api files.");
