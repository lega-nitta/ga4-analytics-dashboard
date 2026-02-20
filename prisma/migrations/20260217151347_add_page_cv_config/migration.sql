-- CreateTable
CREATE TABLE "page_cv_configs" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "pagePath" TEXT NOT NULL,
    "cvEventName" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "page_cv_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "page_cv_configs_productId_idx" ON "page_cv_configs"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "page_cv_configs_productId_pagePath_key" ON "page_cv_configs"("productId", "pagePath");

-- AddForeignKey
ALTER TABLE "page_cv_configs" ADD CONSTRAINT "page_cv_configs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
