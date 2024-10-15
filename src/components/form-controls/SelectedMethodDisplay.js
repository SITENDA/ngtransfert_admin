function SelectedMethodDisplay({ orderedReceiverAccountType }) {
    return (
        <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
            <>
                <span>{orderedReceiverAccountType.label}</span>
                {orderedReceiverAccountType.icon}
            </>
        </span>
    );
}

export default SelectedMethodDisplay;