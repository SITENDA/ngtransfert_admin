import AddReceiverAccountForm
    from "@/app/[locale]/(protected_pages)/kaasitoma/add-receiver-account/AddReceiverAccountForm";
import PublicWrapper from "@/components/PublicWrapper"; // Assuming you have an InputWithLabel

type Props = object

function AddReceiverAccount({  }: Props ) {
    return (
        <PublicWrapper>
            {/* Added styling for semi-transparent background and centering */}
            <div className="
                w-full max-w-2xl mx-auto my-8 p-6 rounded-lg shadow-xl
                bg-background/80 backdrop-blur-sm border border-border
                dark:bg-gray-800/80 dark:border-gray-700
            ">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Add Receiver Account</h2>
                <AddReceiverAccountForm/>
            </div>
        </PublicWrapper>
    )
}

export default AddReceiverAccount