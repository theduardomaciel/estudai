-- CreateTable
CREATE TABLE "Announcement" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "materialCondition" INTEGER NOT NULL,
    "materialPrice" INTEGER,
    "whatsAppNumber" BIGINT,
    "phoneNumber" BIGINT,
    "email" TEXT,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
