import React from 'react';

type Props = {
    result: {
        data?: {
            message?: string;
        };
        serverError?: string;
        validationErrors?: Record<string, any> | undefined; // Changed type here
    };
};

const MessageBox = ({
    type,
    content,
}: {
    type: 'success' | 'error';
    content: React.ReactNode;
}) => (
    <div className={`bg-accent px-4 py-2 my-2 rounded-lg ${type === 'error' ? 'text-red-500' : ''}`}>
        {type === 'success' ? '🎉' : '🚨'} {content}
    </div>
);

export function DisplayServerActionResponse({ result }: Props) {
    const { data, serverError, validationErrors } = result;

    const formatValidationErrors = (errors: Record<string, any>) => {
        const formattedErrors: Record<string, string[]> = {};

        for (const field in errors) {
            if (errors.hasOwnProperty(field)) {
                const error = errors[field];

                if (Array.isArray(error)) {
                    formattedErrors[field] = error.map((err: any) => err.message || err); // Handle string or error object
                } else if (error && error._errors) {
                    formattedErrors[field] = error._errors.map((err: any) => err.message || err); // Handle nested _errors
                } else if (typeof error === 'object' && error !== null) {
                    // Handle cases where the error is an object (e.g., nested objects)
                    for (const nestedField in error) {
                        if (error.hasOwnProperty(nestedField) && error[nestedField] && error[nestedField]._errors) {
                            formattedErrors[nestedField] = error[nestedField]._errors.map((err: any) => err.message || err);
                        }
                    }
                }
            }
        }
        return formattedErrors;
    };


    const formattedValidationErrors = validationErrors ? formatValidationErrors(validationErrors) : undefined;


    return (
        <div>
            {data?.message && <MessageBox type="success" content={`Success: ${data?.message}`} />}

            {serverError && <MessageBox type="error" content={serverError} />}

            {formattedValidationErrors && (
                <MessageBox
                    type="error"
                    content={Object.keys(formattedValidationErrors).map((key) => (
                        <p key={key}>{`${key}: ${formattedValidationErrors[key as keyof typeof formattedValidationErrors].join(', ')}`}</p>
                    ))}
                />
            )}
        </div>
    );
}