import React from 'react';

function SelectedMethodDisplay({ method }) {
    return (
        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <>
                <span>{method.label}</span>
                {method.icon}
            </>
        </div>
    );
}

export default SelectedMethodDisplay;