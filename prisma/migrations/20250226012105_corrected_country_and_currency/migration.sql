-- CreateEnum
CREATE TYPE "ReceiverAccountType" AS ENUM ('ALIPAY_ACCOUNT', 'WECHAT_ACCOUNT', 'BANK_ACCOUNT');

-- CreateEnum
CREATE TYPE "ReceiverAccountIdentifier" AS ENUM ('EMAIL', 'PHONE_NUMBER', 'QR_CODE_IMAGE', 'NONE');

-- CreateEnum
CREATE TYPE "RateSource" AS ENUM ('FIXER_IO', 'OPEN_EXCHANGE_RATES', 'XE_COM', 'NGTRANSFERT_RATES');

-- CreateTable
CREATE TABLE "country" (
    "country_id" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "continent" TEXT NOT NULL,
    "country_flag_url" TEXT,
    "currencyId" TEXT,
    "languageId" TEXT,

    CONSTRAINT "country_pkey" PRIMARY KEY ("country_id")
);

-- CreateTable
CREATE TABLE "bank" (
    "bank_id" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "bank_name_eng" TEXT,
    "bank_short_name" TEXT,
    "bank_logo_url" TEXT,
    "country_id" TEXT,

    CONSTRAINT "bank_pkey" PRIMARY KEY ("bank_id")
);

-- CreateTable
CREATE TABLE "receiver_account" (
    "receiver_account_id" TEXT NOT NULL,
    "receiver_account_name" TEXT,
    "receiver_account_type" "ReceiverAccountType" NOT NULL,
    "client_id" TEXT NOT NULL,
    "receiver_account_identifier" "ReceiverAccountIdentifier" NOT NULL,
    "qr_code_url" TEXT,
    "qr_code_content" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "balance" DECIMAL(65,30) NOT NULL,
    "bank_account_number" TEXT,
    "bank_id" TEXT,
    "limit" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "receiver_account_pkey" PRIMARY KEY ("receiver_account_id")
);

-- CreateTable
CREATE TABLE "admin_percentage" (
    "admin_percentage_id" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,
    "percentage" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "admin_percentage_pkey" PRIMARY KEY ("admin_percentage_id")
);

-- CreateTable
CREATE TABLE "bank_deposit_address" (
    "bank_deposit_address_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "bank_id" TEXT,

    CONSTRAINT "bank_deposit_address_pkey" PRIMARY KEY ("bank_deposit_address_id")
);

-- CreateTable
CREATE TABLE "cash_deposit_address" (
    "cash_deposit_address_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "country_id" TEXT NOT NULL,

    CONSTRAINT "cash_deposit_address_pkey" PRIMARY KEY ("cash_deposit_address_id")
);

-- CreateTable
CREATE TABLE "exchange_rate" (
    "exchange_rate_id" TEXT NOT NULL,
    "rate_value" DECIMAL(65,30) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" "RateSource" NOT NULL,
    "source_currency_id" TEXT NOT NULL,
    "target_currency_id" TEXT NOT NULL,

    CONSTRAINT "exchange_rate_pkey" PRIMARY KEY ("exchange_rate_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "receiver_account_qr_code_content_key" ON "receiver_account"("qr_code_content");

-- CreateIndex
CREATE UNIQUE INDEX "receiver_account_email_key" ON "receiver_account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "receiver_account_phone_number_key" ON "receiver_account"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "admin_percentage_country_id_percentage_key" ON "admin_percentage"("country_id", "percentage");

-- CreateIndex
CREATE UNIQUE INDEX "bank_deposit_address_address_bank_id_key" ON "bank_deposit_address"("address", "bank_id");

-- CreateIndex
CREATE UNIQUE INDEX "cash_deposit_address_address_country_id_key" ON "cash_deposit_address"("address", "country_id");

-- CreateIndex
CREATE UNIQUE INDEX "exchange_rate_source_currency_id_target_currency_id_key" ON "exchange_rate"("source_currency_id", "target_currency_id");

-- AddForeignKey
ALTER TABLE "country" ADD CONSTRAINT "country_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency"("currency_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "country" ADD CONSTRAINT "country_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "language"("language_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank" ADD CONSTRAINT "bank_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("country_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiver_account" ADD CONSTRAINT "receiver_account_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "receiver_account" ADD CONSTRAINT "receiver_account_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "bank"("bank_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_percentage" ADD CONSTRAINT "admin_percentage_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("country_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_deposit_address" ADD CONSTRAINT "bank_deposit_address_bank_id_fkey" FOREIGN KEY ("bank_id") REFERENCES "bank"("bank_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_deposit_address" ADD CONSTRAINT "cash_deposit_address_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("country_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rate" ADD CONSTRAINT "exchange_rate_source_currency_id_fkey" FOREIGN KEY ("source_currency_id") REFERENCES "currency"("currency_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exchange_rate" ADD CONSTRAINT "exchange_rate_target_currency_id_fkey" FOREIGN KEY ("target_currency_id") REFERENCES "currency"("currency_id") ON DELETE RESTRICT ON UPDATE CASCADE;
