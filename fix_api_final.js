const fs = require("fs");
const path = require("path");

const files = [
    "src/app/api/bookings/[id]/cancel/route.ts",
    "src/app/api/bookings/[id]/route.ts",
    "src/app/api/cart/[itemId]/route.ts",
    "src/app/api/orders/[id]/cancel/route.ts",
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

    content = content.replaceAll("{ params }: { params: { id: string } }", "{ params }: { params: Promise<{ id: string }> }");
    content = content.replaceAll("{ params }: { params: { itemId: string } }", "{ params }: { params: Promise<{ itemId: string }> }");
    content = content.replaceAll("{ params }: { params: { slug: string } }", "{ params }: { params: Promise<{ slug: string }> }");
    
    content = content.replaceAll("params.id", "(await params).id");
    content = content.replaceAll("params.itemId", "(await params).itemId");
    content = content.replaceAll("params.slug", "(await params).slug");

    content = content.replaceAll("const { id } = params;", "const { id } = await params;");
    
    fs.writeFileSync(p, content);
});
console.log("Done replacement");
