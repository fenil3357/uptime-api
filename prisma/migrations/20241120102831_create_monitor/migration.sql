-- CreateEnum
CREATE TYPE "MonitorType" AS ENUM ('website', 'api');

-- CreateEnum
CREATE TYPE "RequestMethodType" AS ENUM ('get', 'post', 'put', 'patch', 'delete');

-- CreateTable
CREATE TABLE "Monitor" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "user_id" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "type" "MonitorType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "method" "RequestMethodType" NOT NULL DEFAULT 'get',
    "payload" JSONB,
    "headers" JSONB,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
