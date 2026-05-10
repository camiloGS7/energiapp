-- CreateEnum
CREATE TYPE "Role" AS ENUM ('comercio', 'cliente', 'fundacion');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispositivos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispositivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecturas" (
    "id" SERIAL NOT NULL,
    "dispositivo_id" INTEGER NOT NULL,
    "consumo_kwh" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lecturas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "lecturas_dispositivo_id_idx" ON "lecturas"("dispositivo_id");

-- CreateIndex
CREATE INDEX "lecturas_fecha_idx" ON "lecturas"("fecha");

-- AddForeignKey
ALTER TABLE "dispositivos" ADD CONSTRAINT "dispositivos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecturas" ADD CONSTRAINT "lecturas_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
