import React, { ReactNode } from "react";

interface PublicWrapperProps {
    children: ReactNode;
}

const PublicWrapper: React.FC<PublicWrapperProps> = ({ children }) => {
    return (
        <div className="w-full max-w-3xl mx-auto text-center">
            {children}
        </div>
    );
};

export default PublicWrapper;
