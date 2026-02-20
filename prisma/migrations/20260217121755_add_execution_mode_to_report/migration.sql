-- AlterTable
ALTER TABLE "reports" ADD COLUMN     "executionMode" VARCHAR(50);

-- CreateIndex
CREATE INDEX "reports_executionMode_idx" ON "reports"("executionMode");
