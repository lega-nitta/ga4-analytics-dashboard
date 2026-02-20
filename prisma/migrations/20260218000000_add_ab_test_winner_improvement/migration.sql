-- AlterTable
ALTER TABLE "ab_tests" ADD COLUMN     "winnerVariant" VARCHAR(1);
ALTER TABLE "ab_tests" ADD COLUMN     "improvementVsAPercent" DECIMAL(8,2);
