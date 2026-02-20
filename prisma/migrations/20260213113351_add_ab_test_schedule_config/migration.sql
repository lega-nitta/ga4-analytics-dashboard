-- AlterTable
ALTER TABLE "ab_tests" ADD COLUMN     "ga4Config" JSONB,
ADD COLUMN     "autoExecute" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "scheduleConfig" JSONB,
ADD COLUMN     "lastExecutedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "ab_tests_autoExecute_endDate_idx" ON "ab_tests"("autoExecute", "endDate");

-- CreateTable
CREATE TABLE "ab_test_report_executions" (
    "id" SERIAL NOT NULL,
    "abTestId" INTEGER NOT NULL,
    "reportExecutionId" INTEGER,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "resultData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ab_test_report_executions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ab_test_report_executions_abTestId_idx" ON "ab_test_report_executions"("abTestId");

-- CreateIndex
CREATE INDEX "ab_test_report_executions_status_idx" ON "ab_test_report_executions"("status");

-- CreateIndex
CREATE INDEX "ab_test_report_executions_createdAt_idx" ON "ab_test_report_executions"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "ab_test_report_executions" ADD CONSTRAINT "ab_test_report_executions_abTestId_fkey" FOREIGN KEY ("abTestId") REFERENCES "ab_tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ab_test_report_executions" ADD CONSTRAINT "ab_test_report_executions_reportExecutionId_fkey" FOREIGN KEY ("reportExecutionId") REFERENCES "report_executions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
