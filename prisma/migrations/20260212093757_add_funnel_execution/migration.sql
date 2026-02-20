-- CreateTable
CREATE TABLE "funnel_executions" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" VARCHAR(255),
    "funnelConfig" JSONB NOT NULL,
    "filterConfig" JSONB,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "resultData" JSONB NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'completed',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funnel_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "funnel_executions_productId_idx" ON "funnel_executions"("productId");

-- CreateIndex
CREATE INDEX "funnel_executions_createdAt_idx" ON "funnel_executions"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "funnel_executions" ADD CONSTRAINT "funnel_executions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
