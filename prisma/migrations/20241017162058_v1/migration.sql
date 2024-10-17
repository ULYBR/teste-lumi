-- CreateTable
CREATE TABLE "Fatura" (
    "id" SERIAL NOT NULL,
    "numCliente" TEXT NOT NULL,
    "mesReferencia" TEXT NOT NULL,
    "energiaEletricaKwh" DOUBLE PRECISION NOT NULL,
    "energiaSceeeKwh" DOUBLE PRECISION NOT NULL,
    "energiaCompensadaGdi" DOUBLE PRECISION NOT NULL,
    "valorTotal" DOUBLE PRECISION NOT NULL,
    "valorEconomiaGd" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);
