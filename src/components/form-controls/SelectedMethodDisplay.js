import React from 'react';

function SelectedMethodDisplay({ method }) {
    return (
        <span style={{display: 'inline-flex', alignItems: 'center', gap: '10px'}}>
            <>
                <span>{method.label}</span>
                {method.icon}
            </>
        </span>
    );
}

export default SelectedMethodDisplay;