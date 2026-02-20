-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "ga4PropertyId" VARCHAR(50),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "reportType" VARCHAR(50) NOT NULL,
    "config" JSONB NOT NULL,
    "scheduleConfig" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_executions" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "resultData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ab_tests" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "variantAName" VARCHAR(255) NOT NULL,
    "variantBName" VARCHAR(255) NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,
    "status" VARCHAR(50) NOT NULL DEFAULT 'running',
    "evaluationConfig" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ab_tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ab_test_results" (
    "id" SERIAL NOT NULL,
    "abTestId" INTEGER NOT NULL,
    "reportExecutionId" INTEGER,
    "variant" VARCHAR(1) NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DECIMAL(10,6),
    "statisticalSignificance" DECIMAL(5,2),
    "zScore" DECIMAL(10,4),
    "periodDays" INTEGER,
    "aiEvaluation" TEXT,
    "recommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ab_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_configs" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "steps" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funnel_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funnel_results" (
    "id" SERIAL NOT NULL,
    "funnelConfigId" INTEGER NOT NULL,
    "reportExecutionId" INTEGER,
    "stepOrder" INTEGER NOT NULL,
    "stepName" VARCHAR(255) NOT NULL,
    "usersCount" INTEGER NOT NULL DEFAULT 0,
    "conversionRate" DECIMAL(10,6),
    "dropoffRate" DECIMAL(10,6),
    "continuationRate" DECIMAL(10,6),
    "dateRangeStart" DATE,
    "dateRangeEnd" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "funnel_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sessionId" VARCHAR(255) NOT NULL,
    "userId" VARCHAR(255),
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "durationSeconds" INTEGER,
    "referrer" TEXT,
    "userAgent" TEXT,
    "deviceType" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "heatmap_events" (
    "id" BIGSERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "sessionId" VARCHAR(255) NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "eventType" VARCHAR(50) NOT NULL,
    "x" INTEGER,
    "y" INTEGER,
    "scrollDepth" INTEGER,
    "viewportWidth" INTEGER,
    "viewportHeight" INTEGER,
    "elementSelector" TEXT,
    "metadata" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "heatmap_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_isActive_idx" ON "products"("isActive");

-- CreateIndex
CREATE INDEX "reports_productId_idx" ON "reports"("productId");

-- CreateIndex
CREATE INDEX "reports_reportType_idx" ON "reports"("reportType");

-- CreateIndex
CREATE INDEX "report_executions_reportId_idx" ON "report_executions"("reportId");

-- CreateIndex
CREATE INDEX "report_executions_status_idx" ON "report_executions"("status");

-- CreateIndex
CREATE INDEX "report_executions_createdAt_idx" ON "report_executions"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "ab_tests_productId_idx" ON "ab_tests"("productId");

-- CreateIndex
CREATE INDEX "ab_tests_status_idx" ON "ab_tests"("status");

-- CreateIndex
CREATE INDEX "ab_tests_startDate_endDate_idx" ON "ab_tests"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "ab_test_results_abTestId_idx" ON "ab_test_results"("abTestId");

-- CreateIndex
CREATE INDEX "ab_test_results_reportExecutionId_idx" ON "ab_test_results"("reportExecutionId");

-- CreateIndex
CREATE INDEX "funnel_configs_productId_idx" ON "funnel_configs"("productId");

-- CreateIndex
CREATE INDEX "funnel_results_funnelConfigId_idx" ON "funnel_results"("funnelConfigId");

-- CreateIndex
CREATE INDEX "funnel_results_reportExecutionId_idx" ON "funnel_results"("reportExecutionId");

-- CreateIndex
CREATE INDEX "funnel_results_dateRangeStart_dateRangeEnd_idx" ON "funnel_results"("dateRangeStart", "dateRangeEnd");

-- CreateIndex
CREATE INDEX "sessions_productId_idx" ON "sessions"("productId");

-- CreateIndex
CREATE INDEX "sessions_sessionId_idx" ON "sessions"("sessionId");

-- CreateIndex
CREATE INDEX "sessions_startedAt_idx" ON "sessions"("startedAt" DESC);

-- CreateIndex
CREATE INDEX "heatmap_events_productId_timestamp_idx" ON "heatmap_events"("productId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "heatmap_events_sessionId_idx" ON "heatmap_events"("sessionId");

-- CreateIndex
CREATE INDEX "heatmap_events_pageUrl_idx" ON "heatmap_events"("pageUrl");

-- CreateIndex
CREATE INDEX "heatmap_events_eventType_idx" ON "heatmap_events"("eventType");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_executions" ADD CONSTRAINT "report_executions_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_tests" ADD CONSTRAINT "ab_tests_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_test_results" ADD CONSTRAINT "ab_test_results_abTestId_fkey" FOREIGN KEY ("abTestId") REFERENCES "ab_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_configs" ADD CONSTRAINT "funnel_configs_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funnel_results" ADD CONSTRAINT "funnel_results_funnelConfigId_fkey" FOREIGN KEY ("funnelConfigId") REFERENCES "funnel_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "heatmap_events" ADD CONSTRAINT "heatmap_events_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
