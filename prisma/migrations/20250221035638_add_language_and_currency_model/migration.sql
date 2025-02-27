-- CreateTable
CREATE TABLE "currency" (
    "currency_id" TEXT NOT NULL,
    "currency_code" TEXT NOT NULL,
    "currency_name" TEXT NOT NULL,
    "currency_symbol" TEXT,

    CONSTRAINT "currency_pkey" PRIMARY KEY ("currency_id")
);

-- CreateTable
CREATE TABLE "language" (
    "language_id" TEXT NOT NULL,
    "language_code" TEXT NOT NULL,
    "language_name" TEXT NOT NULL,

    CONSTRAINT "language_pkey" PRIMARY KEY ("language_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currency_currency_code_key" ON "currency"("currency_code");

-- CreateIndex
CREATE UNIQUE INDEX "currency_currency_name_key" ON "currency"("currency_name");
