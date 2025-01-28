-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_monitor_id_fkey";

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_monitor_id_fkey" FOREIGN KEY ("monitor_id") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
