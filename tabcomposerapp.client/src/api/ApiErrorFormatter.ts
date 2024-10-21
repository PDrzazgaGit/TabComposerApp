import axios from "axios";

interface FormattedApiErrors {
    [key: string]: string[];
}

export const apiErrorFormatter = (
    error: unknown,
    keywords: { [key: string]: string }
): FormattedApiErrors => {
    const formattedErrors: FormattedApiErrors = {};

    if (axios.isAxiosError(error) && error.response) {
        const serverErrors = error.response.data;
        if (Array.isArray(serverErrors)) {
            serverErrors.forEach((err: { code: string; description: string }) => {
                let matched = false;

                for (const [key, keyword] of Object.entries(keywords)) {
                    if (err.code.includes(keyword)) {
                        formattedErrors[key] = formattedErrors[key] || [];
                        formattedErrors[key].push(err.description);
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    formattedErrors.unknown = formattedErrors.unknown || [];
                    formattedErrors.unknown.push(err.description);
                }
            });
        } else if (typeof serverErrors === 'object' && serverErrors !== null) {

            Object.entries(serverErrors).forEach(([field, description]) => {
                let matched = false;

                for (const [key, keyword] of Object.entries(keywords)) {
                    if (field.includes(keyword)) {
                        formattedErrors[key] = formattedErrors[key] || [];
                        formattedErrors[key].push(description as string);
                        matched = true;
                        break;
                    }
                }

                if (!matched) {
                    formattedErrors.unknown = formattedErrors.unknown || [];
                    formattedErrors.unknown.push(description as string);
                }
            });

        } else {
            formattedErrors.unknown = ['Unexpected error occurred'];
        }
        
    } else {
        formattedErrors.unknown = ['Unexpected error occurred'];
    }
    return formattedErrors;
}