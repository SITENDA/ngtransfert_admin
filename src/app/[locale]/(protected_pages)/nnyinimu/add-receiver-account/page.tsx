//  src/app/[locale]/(protected_pages)/nnyinimu/add-receiver-account/page.tsx

// import { redirect } from "next/navigation";
import ProtectedWrapper from "@/components/ProtectedWrapper";
import getSession from "@/lib/getSession";
import AddReceiverAccountForm from "./AddReceiverAccountForm";

import {
    ReceiverAccountCategoryEnum,
    ReceiverAccountIdentifierEnum,
} from "@/zod-schemas/receiver-account";
import { RequestReceiverAccount } from "../../../../../../types/receiver-account";

export const metadata = {
    title: "Add Receiver Account",
};

export default async function AddReceiverAccountPage() {
    const session = await getSession();
    const user = session?.user;

    // if (!user || !session?.accessToken) {
    //     redirect("/");
    // }

    const receiverAccount: RequestReceiverAccount = {
        receiverAccountId: 0,
        receiverAccountName: "",
        receiverAccountCategory: ReceiverAccountCategoryEnum.enum.WECHAT_ACCOUNT,
        receiverAccountIdentifier: ReceiverAccountIdentifierEnum.enum.EMAIL,
        qrCodeUrl: "",
        qrCodeContent: "",
        email: "",
        phoneNumber: "",
        balance: 0,
        currencyId: 1,
        limit: 60000,
        limitCurrencyId: 1,
        bankAccountNumber: "",
        bankId: 0,
        clientId: Number(user?.userId ?? 0),
        creationDate: new Date(),
        cardHolderName: "",
    };

    return (
        <ProtectedWrapper>
            <AddReceiverAccountForm receiverAccount={receiverAccount} />
        </ProtectedWrapper>
    );
}