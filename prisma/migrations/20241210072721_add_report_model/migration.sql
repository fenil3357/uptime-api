-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('success', 'error');

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "monitor_id" TEXT NOT NULL,
    "status" "ResponseStatus" NOT NULL,
    "statusCode" INTEGER,
    "message" TEXT,
    "data" JSONB,
    "time_taken" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "Monitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
