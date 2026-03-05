-- Admin Table
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,                       
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "failedAttempts" INTEGER DEFAULT 0,        
    "lockUntil" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),  
    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- AdminLog Table
CREATE TABLE "AdminLog" (
    "id" SERIAL NOT NULL,                      
    "action" TEXT NOT NULL,
    "old_value" TEXT,
    "new_value" TEXT,
    "ticket_ref" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),  
    "adminId" INTEGER,
    CONSTRAINT "AdminLog_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "AdminLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tickets Table (already mostly fine)
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "issue" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "priority" VARCHAR(50) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "date" VARCHAR(50) NOT NULL,
    "ticket_ref" VARCHAR(100) NOT NULL,
    "image_path" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);