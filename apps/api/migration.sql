-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "level" INTEGER NOT NULL DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "currentTitle" TEXT NOT NULL DEFAULT 'Newbie Shopper',
    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "rarityTier" TEXT NOT NULL DEFAULT 'COMMON',
    "categoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductStats" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quality" INTEGER NOT NULL DEFAULT 50,
    "rarity" INTEGER NOT NULL DEFAULT 50,
    "comfort" INTEGER NOT NULL DEFAULT 50,
    "style" INTEGER NOT NULL DEFAULT 50,
    "value" INTEGER NOT NULL DEFAULT 50,
    CONSTRAINT "ProductStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SKU" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SKU_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAsset" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    CONSTRAINT "ProductAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "skuId" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "skuId" TEXT,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile" ("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product" ("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ProductStats_productId_key" ON "ProductStats" ("productId");

-- Security: Enable Row Level Security (RLS) on all tables

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Profile" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "ProductStats" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "SKU" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "ProductAsset" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Category" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "CartItem" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "Order" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "OrderItem" ENABLE ROW LEVEL SECURITY;

-- Public Read Policies
CREATE POLICY "Public Read Product" ON "Product" FOR
SELECT USING (true);

CREATE POLICY "Public Read Category" ON "Category" FOR
SELECT USING (true);

CREATE POLICY "Public Read Stats" ON "ProductStats" FOR
SELECT USING (true);

CREATE POLICY "Public Read SKU" ON "SKU" FOR SELECT USING (true);

CREATE POLICY "Public Read Asset" ON "ProductAsset" FOR
SELECT USING (true);

-- User-Specific Policies
CREATE POLICY "User Access Own Data" ON "User" FOR ALL USING (auth.uid()::text = id);

CREATE POLICY "User Access Own Profile" ON "Profile" FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "User Access Own Cart" ON "CartItem" FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "User Access Own Orders" ON "Order" FOR ALL USING (auth.uid()::text = "userId");

CREATE POLICY "User Access Own OrderItems" ON "OrderItem" FOR ALL USING (
  EXISTS (SELECT 1 FROM "Order" WHERE "Order"."id" = "OrderItem"."orderId" AND "Order"."userId" = auth.uid()::text)
);

-- AddForeignKey
ALTER TABLE "Profile"
ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product"
ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductStats"
ADD CONSTRAINT "ProductStats_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SKU"
ADD CONSTRAINT "SKU_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAsset"
ADD CONSTRAINT "ProductAsset_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem"
ADD CONSTRAINT "CartItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE;